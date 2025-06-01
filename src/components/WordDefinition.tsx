
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Volume2, Heart, X, BookOpen, Globe, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WordDefinitionProps {
  word: string;
  sourceLanguage: string;
  targetLanguage: string;
  position: { x: number, y: number };
  onSave: (wordData: any) => void;
  onClose: () => void;
}

interface DictionaryResponse {
  word: string;
  phonetics: Array<{
    text?: string;
    audio?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }>;
    synonyms?: string[];
    antonyms?: string[];
  }>;
}

const fetchWordDefinition = async (word: string): Promise<DictionaryResponse | null> => {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    if (!response.ok) {
      throw new Error('Word not found');
    }
    const data = await response.json();
    return data[0]; // Return the first result
  } catch (error) {
    console.error('Dictionary API error:', error);
    return null;
  }
};

const WordDefinition: React.FC<WordDefinitionProps> = ({
  word,
  sourceLanguage,
  targetLanguage,
  position,
  onSave,
  onClose
}) => {
  const [wordData, setWordData] = useState<DictionaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadWordData = async () => {
      setIsLoading(true);
      setError(null);
      
      const data = await fetchWordDefinition(word);
      if (data) {
        setWordData(data);
      } else {
        setError(`No definition found for "${word}"`);
      }
      setIsLoading(false);
    };

    loadWordData();
  }, [word]);

  const playPronunciation = () => {
    // Try to use audio from the API first
    const audioUrl = wordData?.phonetics?.find(p => p.audio)?.audio;
    
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(() => {
        // Fallback to speech synthesis
        useSpeechSynthesis();
      });
    } else {
      useSpeechSynthesis();
    }
  };

  const useSpeechSynthesis = () => {
    if ('speechSynthesis' in window && wordData) {
      const utterance = new SpeechSynthesisUtterance(wordData.word);
      utterance.lang = sourceLanguage === 'auto' ? 'en-US' : sourceLanguage;
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Audio not available",
        description: "Speech synthesis is not supported in your browser.",
        variant: "destructive"
      });
    }
  };

  const handleSave = () => {
    if (wordData) {
      // Convert API data to our internal format
      const saveData = {
        word: wordData.word,
        pronunciation: wordData.phonetics?.[0]?.text || `/${wordData.word}/`,
        partOfSpeech: wordData.meanings?.[0]?.partOfSpeech || 'word',
        definitions: wordData.meanings?.flatMap(m => 
          m.definitions.map(d => d.definition)
        ).slice(0, 3) || [],
        examples: wordData.meanings?.flatMap(m => 
          m.definitions.map(d => d.example).filter(Boolean)
        ).slice(0, 2) || [],
        synonyms: wordData.meanings?.flatMap(m => 
          [...(m.synonyms || []), ...m.definitions.flatMap(d => d.synonyms || [])]
        ).slice(0, 5) || [],
        antonyms: wordData.meanings?.flatMap(m => 
          [...(m.antonyms || []), ...m.definitions.flatMap(d => d.antonyms || [])]
        ).slice(0, 5) || []
      };
      onSave(saveData);
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Looking up definition...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm animate-fade-in">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-200">
                Definition Not Found
              </CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Try checking the spelling or searching for a different word.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!wordData) return null;

  const primaryPhonetic = wordData.phonetics?.find(p => p.text)?.text || `/${wordData.word}/`;
  const allDefinitions = wordData.meanings?.flatMap(m => m.definitions) || [];
  const allExamples = allDefinitions.map(d => d.example).filter(Boolean).slice(0, 3);
  const allSynonyms = wordData.meanings?.flatMap(m => 
    [...(m.synonyms || []), ...m.definitions.flatMap(d => d.synonyms || [])]
  ).slice(0, 6) || [];
  const allAntonyms = wordData.meanings?.flatMap(m => 
    [...(m.antonyms || []), ...m.definitions.flatMap(d => d.antonyms || [])]
  ).slice(0, 6) || [];

  return (
    <Card className="shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {wordData.word}
            </CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-gray-600 dark:text-gray-400 font-mono">
            {primaryPhonetic}
          </span>
          <Button variant="outline" size="sm" onClick={playPronunciation}>
            <Volume2 className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {wordData.meanings?.map((meaning, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {meaning.partOfSpeech}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Definitions by part of speech */}
        {wordData.meanings?.map((meaning, meaningIndex) => (
          <div key={meaningIndex}>
            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
              {meaning.partOfSpeech} definitions
            </h4>
            <ul className="space-y-1">
              {meaning.definitions.slice(0, 2).map((def, defIndex) => (
                <li key={defIndex} className="text-sm text-gray-600 dark:text-gray-400">
                  {defIndex + 1}. {def.definition}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Examples */}
        {allExamples.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
              Examples
            </h4>
            <ul className="space-y-1">
              {allExamples.map((example, index) => (
                <li key={index} className="text-sm text-gray-600 dark:text-gray-400 italic">
                  "{example}"
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Synonyms */}
        {allSynonyms.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
              Synonyms
            </h4>
            <div className="flex flex-wrap gap-1">
              {allSynonyms.map((synonym, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {synonym}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Antonyms */}
        {allAntonyms.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
              Antonyms
            </h4>
            <div className="flex flex-wrap gap-1">
              {allAntonyms.map((antonym, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {antonym}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button onClick={handleSave} className="flex-1" size="sm">
            <Heart className="h-3 w-3 mr-1" />
            Save Word
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WordDefinition;
