
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Heart, Trash2, Edit3, Save, X, Volume2, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VocabularyListProps {
  words: any[];
  onUpdateWords: (words: any[]) => void;
  isVisible: boolean;
  onToggleVisibility: (visible: boolean) => void;
}

const VocabularyList: React.FC<VocabularyListProps> = ({
  words,
  onUpdateWords,
  isVisible,
  onToggleVisibility
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    const updatedWords = words.filter(word => word.id !== id);
    onUpdateWords(updatedWords);
    toast({
      title: "Word removed",
      description: "The word has been removed from your vocabulary."
    });
  };

  const handleEditStart = (word: any) => {
    setEditingId(word.id);
    setEditNotes(word.notes || '');
  };

  const handleEditSave = (id: number) => {
    const updatedWords = words.map(word =>
      word.id === id ? { ...word, notes: editNotes } : word
    );
    onUpdateWords(updatedWords);
    setEditingId(null);
    setEditNotes('');
    toast({
      title: "Notes updated",
      description: "Your personal notes have been saved."
    });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditNotes('');
  };

  const playPronunciation = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      speechSynthesis.speak(utterance);
    }
  };

  const getCefrColor = (level: string) => {
    switch (level) {
      case 'A1':
      case 'A2':
        return 'bg-green-500';
      case 'B1':
      case 'B2':
        return 'bg-yellow-500';
      case 'C1':
      case 'C2':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span>My Vocabulary</span>
            <Badge variant="secondary" className="ml-2">
              {words.length}
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleVisibility(!isVisible)}
            className="md:hidden"
          >
            {isVisible ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {(isVisible || window.innerWidth >= 768) && (
        <CardContent>
          {words.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No saved words yet</p>
              <p className="text-xs">Click on words in the text to save them</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {words.map((word, index) => (
                  <div key={word.id} className="border rounded-lg p-3 space-y-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-lg">{word.word}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => playPronunciation(word.word)}
                        >
                          <Volume2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditStart(word)}
                          disabled={editingId === word.id}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(word.id)}
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {word.partOfSpeech}
                      </Badge>
                      <Badge className={`text-xs text-white ${getCefrColor(word.cefr)}`}>
                        {word.cefr}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {word.definitions?.[0] || 'No definition available'}
                    </p>

                    {/* Personal Notes */}
                    <div className="border-t pt-2">
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Personal Notes:
                      </label>
                      {editingId === word.id ? (
                        <div className="mt-1 space-y-2">
                          <Textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Add your personal notes..."
                            className="text-sm"
                            rows={2}
                          />
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleEditSave(word.id)}
                            >
                              <Save className="h-3 w-3 mr-1" />
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleEditCancel}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 min-h-[20px]">
                          {word.notes || <em>No notes added</em>}
                        </p>
                      )}
                    </div>

                    <div className="text-xs text-gray-400">
                      Added: {new Date(word.dateAdded).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default VocabularyList;
