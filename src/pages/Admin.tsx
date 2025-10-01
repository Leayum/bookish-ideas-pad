import { useState } from 'react';
import { useIdeasBase } from '@/hooks/useIdeasBase';
import { IdeaBase } from '@/types/ideas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { ideas, addIdea, updateIdea, deleteIdea } = useIdeasBase();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<IdeaBase | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    url_imagen: '',
    prompt_adicional: ''
  });

  const resetForm = () => {
    setFormData({ nombre: '', url_imagen: '', prompt_adicional: '' });
    setEditingIdea(null);
  };

  const handleOpenDialog = (idea?: IdeaBase) => {
    if (idea) {
      setEditingIdea(idea);
      setFormData({
        nombre: idea.nombre,
        url_imagen: idea.url_imagen,
        prompt_adicional: idea.prompt_adicional || ''
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.nombre || !formData.url_imagen) {
      toast({
        title: "Error",
        description: "Nombre y URL de imagen son obligatorios",
        variant: "destructive"
      });
      return;
    }

    if (editingIdea) {
      updateIdea(editingIdea.id, formData);
      toast({ title: "Actualizado", description: "Idea base actualizada correctamente" });
    } else {
      addIdea(formData);
      toast({ title: "Creado", description: "Nueva idea base creada correctamente" });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    deleteIdea(id);
    setDeleteId(null);
    toast({ title: "Eliminado", description: "Idea base eliminada correctamente" });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Administración de Ideas Base</h1>
            <p className="text-muted-foreground">Gestiona las imágenes de fondo de libros</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Nueva Idea Base
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>{editingIdea ? 'Editar' : 'Nueva'} Idea Base</DialogTitle>
                <DialogDescription>
                  {editingIdea ? 'Modifica' : 'Añade'} los detalles de la imagen de fondo del libro
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Libro antiguo sobre escritorio"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url_imagen">URL de Imagen *</Label>
                  <Input
                    id="url_imagen"
                    value={formData.url_imagen}
                    onChange={(e) => setFormData({ ...formData, url_imagen: e.target.value })}
                    placeholder="https://ejemplo.com/libro.jpg"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="prompt_adicional">Prompt Adicional (opcional)</Label>
                  <Textarea
                    id="prompt_adicional"
                    value={formData.prompt_adicional}
                    onChange={(e) => setFormData({ ...formData, prompt_adicional: e.target.value })}
                    placeholder="texto en fuente gótica"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>
                  {editingIdea ? 'Actualizar' : 'Crear'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {ideas.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground text-lg mb-4">No hay ideas base creadas</p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Crear primera idea base
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <Card key={idea.id} className="overflow-hidden">
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={idea.url_imagen}
                    alt={idea.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{idea.nombre}</CardTitle>
                  {idea.prompt_adicional && (
                    <CardDescription className="line-clamp-2">
                      {idea.prompt_adicional}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenDialog(idea)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteId(idea.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará permanentemente esta idea base. No se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Admin;
