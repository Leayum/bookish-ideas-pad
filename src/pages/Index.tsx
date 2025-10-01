import { useState } from "react";
import { useIdeasBase } from "@/hooks/useIdeasBase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { ideas } = useIdeasBase();
  const [selectedIdea, setSelectedIdea] = useState<number | null>(null);
  const [frase, setFrase] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!selectedIdea) {
      toast({
        title: "Error",
        description: "Por favor, selecciona una imagen base",
        variant: "destructive",
      });
      return;
    }

    if (!frase.trim()) {
      toast({
        title: "Error",
        description: "Por favor, escribe una frase",
        variant: "destructive",
      });
      return;
    }

    const selectedIdeaData = ideas.find(idea => idea.id === selectedIdea);
    if (!selectedIdeaData) return;

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const response = await fetch(
        "https://us-central1-tu-proyecto-ia.cloudfunctions.net/generar-frase-ia",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            frase_a_insertar: frase,
            url_base: selectedIdeaData.url_imagen,
            prompt_extra: selectedIdeaData.prompt_adicional || "",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al generar la imagen");
      }

      const data = await response.json();
      setGeneratedImage(data.url_imagen_final);
      
      toast({
        title: "¡Éxito!",
        description: "Tu obra de arte ha sido generada",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo generar la imagen. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Control Panel */}
          <Card className="shadow-lg border-2 border-border">
            <CardHeader>
              <CardTitle className="text-3xl font-serif text-primary">
                Generador de Citas en Libros Clásicos
              </CardTitle>
              <CardDescription className="text-base">
                Crea hermosas citas literarias en páginas de libros antiguos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Gallery */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  Selecciona una imagen base:
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {ideas.map((idea) => (
                    <button
                      key={idea.id}
                      onClick={() => setSelectedIdea(idea.id)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-4 transition-all hover:scale-105 ${
                        selectedIdea === idea.id
                          ? "border-primary ring-4 ring-primary/30"
                          : "border-border hover:border-accent"
                      }`}
                    >
                      <img
                        src={idea.url_imagen}
                        alt={idea.nombre}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/80 to-transparent p-2">
                        <p className="text-xs text-primary-foreground font-medium truncate">
                          {idea.nombre}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
                {ideas.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No hay imágenes base disponibles. Ve al panel de administración para agregar algunas.
                  </p>
                )}
              </div>

              {/* Text Input */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  Escribe tu frase:
                </h3>
                <Textarea
                  placeholder="Escribe la frase que quieres plasmar en el libro..."
                  value={frase}
                  onChange={(e) => setFrase(e.target.value)}
                  className="min-h-[120px] text-base resize-none"
                />
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !selectedIdea || !frase.trim()}
                className="w-full h-12 text-lg font-semibold"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generando...
                  </>
                ) : (
                  "Generar Obra de Arte"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card className="shadow-lg border-2 border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-primary">
                Resultado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center min-h-[400px] lg:min-h-[600px] bg-muted rounded-lg border-2 border-border">
                {generatedImage ? (
                  <img
                    src={generatedImage}
                    alt="Imagen generada"
                    className="max-w-full max-h-full object-contain rounded"
                  />
                ) : (
                  <p className="text-center text-muted-foreground text-lg px-8">
                    La imagen generada aparecerá aquí
                  </p>
                )}
              </div>
              
              {generatedImage && (
                <Button
                  asChild
                  className="w-full h-12 text-lg font-semibold"
                  size="lg"
                  variant="secondary"
                >
                  <a href={generatedImage} download="obra-de-arte.jpg">
                    Descargar Imagen
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
