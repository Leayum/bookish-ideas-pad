import { useState, useEffect } from 'react';
import { IdeaBase } from '@/types/ideas';

const STORAGE_KEY = 'ideas_base';

export const useIdeasBase = () => {
  const [ideas, setIdeas] = useState<IdeaBase[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setIdeas(JSON.parse(stored));
    }
  }, []);

  const saveIdeas = (newIdeas: IdeaBase[]) => {
    setIdeas(newIdeas);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newIdeas));
  };

  const addIdea = (idea: Omit<IdeaBase, 'id'>) => {
    const newId = ideas.length > 0 ? Math.max(...ideas.map(i => i.id)) + 1 : 1;
    const newIdea = { ...idea, id: newId };
    saveIdeas([...ideas, newIdea]);
  };

  const updateIdea = (id: number, updates: Partial<IdeaBase>) => {
    saveIdeas(ideas.map(idea => idea.id === id ? { ...idea, ...updates } : idea));
  };

  const deleteIdea = (id: number) => {
    saveIdeas(ideas.filter(idea => idea.id !== id));
  };

  return { ideas, addIdea, updateIdea, deleteIdea };
};
