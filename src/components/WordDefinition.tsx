
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Volume2, Heart, X, BookOpen, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WordDefinitionProps {
  word: string;
  sourceLanguage: string;
  targetLanguage: string;
  position: { x: number, y: number };
  onSave: (wordData: any) => void;
  onClose: () => void;
}

// Mock data - in a real app, this would come from dictionary APIs
const getWordData = (word: string) => {
  const mockData = {
    'quick': {
      word: 'quick',
      pronunciation: '/kwɪk/',
      partOfSpeech: 'adjective',
      cefr: 'A2',
      frequency: 'High',
      definitions: [
        'Moving fast or doing something in a short time',
        'Happening in a short time'
      ],
      synonyms: ['fast', 'rapid', 'swift', 'speedy'],
      antonyms: ['slow', 'sluggish', 'gradual'],
      examples: [
        'She gave a quick glance at her watch.',
        'We need a quick solution to this problem.'
      ],
      translations: {
        'es': 'rápido',
        'fr': 'rapide',
        'de': 'schnell',
        'it': 'veloce'
      }
    },
    'authentic': {
      word: 'authentic',
      pronunciation: '/ɔːˈθentɪk/',
      partOfSpeech: 'adjective',
      cefr: 'C1',
      frequency: 'Medium',
      definitions: [
        'Real or genuine; not copied or false',
        'True to one\'s own personality, spirit, or character'
      ],
      synonyms: ['genuine', 'real', 'original', 'legitimate'],
      antonyms: ['fake', 'artificial', 'counterfeit', 'false'],
      examples: [
        'The restaurant serves authentic Italian cuisine.',
        'She wanted to be authentic in her presentation.'
      ],
      translations: {
        'es': 'auténtico',
        'fr': 'authentique',
        'de': 'authentisch',
        'it': 'autentico'
      }
    }
  };

  return mockData[word as keyof typeof mockData] || {
    word,
    pronunciation: `/${word}/`,
    partOfSpeech: 'unknown',
    cefr: 'Unknown',
    frequency: 'Unknown',
    definitions: [`Definition for "${word}" not available`],
    synonyms: [],
    antonyms: [],
    examples: [],
    translations: {}
  };
};

const WordDefinition: React.FC<WordDefinitionProps> = ({
  word,
  sourceLanguage,
  targetLanguage,
  position,
  onSave,
  onClose
}) => {
  const [wordData, setWordData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const data = getWordData(word);
      setWordData(data);
      setIsLoading(false);
    }, 500);
  }, [word]);

  const playPronunciation = () => {
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
      onSave(wordData);
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

  if (isLoading) {
    return (
      <Card className="shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Loading definition...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            {wordData.pronunciation}
          </span>
          <Button variant="outline" size="sm" onClick={playPronunciation}>
            <Volume2 className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            {wordData.partOfSpeech}
          </Badge>
          <Badge className={`text-xs text-white ${getCefrColor(wordData.cefr)}`}>
            {wordData.cefr}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {wordData.frequency} frequency
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Definitions */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
            Definitions
          </h4>
          <ul className="space-y-1">
            {wordData.definitions.map((def: string, index: number) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                {index + 1}. {def}
              </li>
            ))}
          </ul>
        </div>

        {/* Examples */}
        {wordData.examples.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
              Examples
            </h4>
            <ul className="space-y-1">
              {wordData.examples.map((example: string, index: number) => (
                <li key={index} className="text-sm text-gray-600 dark:text-gray-400 italic">
                  "{example}"
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Synonyms */}
        {wordData.synonyms.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
              Synonyms
            </h4>
            <div className="flex flex-wrap gap-1">
              {wordData.synonyms.map((synonym: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {synonym}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Antonyms */}
        {wordData.antonyms.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
              Antonyms
            </h4>
            <div className="flex flex-wrap gap-1">
              {wordData.antonyms.map((antonym: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {antonym}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Translation */}
        {targetLanguage !== sourceLanguage && wordData.translations[targetLanguage] && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-1">
              <Globe className="h-3 w-3" />
              <span>Translation</span>
            </h4>
            <Badge className="bg-blue-500 text-white">
              {wordData.translations[targetLanguage]}
            </Badge>
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
