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

// Expanded mock data with more words
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
    },
    'brown': {
      word: 'brown',
      pronunciation: '/braʊn/',
      partOfSpeech: 'adjective',
      cefr: 'A2',
      frequency: 'High',
      definitions: [
        'A color that is a mixture of red, yellow, and black',
        'Having the color of wood or chocolate'
      ],
      synonyms: ['tan', 'chestnut', 'chocolate', 'coffee'],
      antonyms: ['white', 'light'],
      examples: [
        'The brown dog ran across the field.',
        'She has beautiful brown eyes.'
      ],
      translations: {
        'es': 'marrón',
        'fr': 'brun',
        'de': 'braun',
        'it': 'marrone'
      }
    },
    'fox': {
      word: 'fox',
      pronunciation: '/fɒks/',
      partOfSpeech: 'noun',
      cefr: 'A2',
      frequency: 'Medium',
      definitions: [
        'A wild animal with reddish fur and a bushy tail',
        'A clever or cunning person'
      ],
      synonyms: ['vixen', 'canine'],
      antonyms: [],
      examples: [
        'The red fox is native to many countries.',
        'He\'s a sly old fox when it comes to business.'
      ],
      translations: {
        'es': 'zorro',
        'fr': 'renard',
        'de': 'fuchs',
        'it': 'volpe'
      }
    },
    'jumps': {
      word: 'jumps',
      pronunciation: '/dʒʌmps/',
      partOfSpeech: 'verb',
      cefr: 'B1',
      frequency: 'High',
      definitions: [
        'Moves quickly off the ground by pushing with the legs',
        'Moves suddenly or quickly'
      ],
      synonyms: ['leaps', 'bounds', 'hops', 'springs'],
      antonyms: ['falls', 'drops'],
      examples: [
        'The cat jumps onto the table.',
        'She jumps to conclusions too quickly.'
      ],
      translations: {
        'es': 'salta',
        'fr': 'saute',
        'de': 'springt',
        'it': 'salta'
      }
    },
    'lazy': {
      word: 'lazy',
      pronunciation: '/ˈleɪzi/',
      partOfSpeech: 'adjective',
      cefr: 'B1',
      frequency: 'Medium',
      definitions: [
        'Unwilling to work or be active',
        'Moving slowly or appearing to require little effort'
      ],
      synonyms: ['idle', 'sluggish', 'inactive', 'lethargic'],
      antonyms: ['active', 'energetic', 'hardworking', 'diligent'],
      examples: [
        'He\'s too lazy to do his homework.',
        'It was a lazy summer afternoon.'
      ],
      translations: {
        'es': 'perezoso',
        'fr': 'paresseux',
        'de': 'faul',
        'it': 'pigro'
      }
    },
    'pangram': {
      word: 'pangram',
      pronunciation: '/ˈpænɡræm/',
      partOfSpeech: 'noun',
      cefr: 'C1',
      frequency: 'Low',
      definitions: [
        'A sentence that contains every letter of the alphabet at least once'
      ],
      synonyms: ['holoalphabetic sentence'],
      antonyms: [],
      examples: [
        'The quick brown fox jumps over the lazy dog is a famous pangram.',
        'Pangrams are often used to test fonts and keyboards.'
      ],
      translations: {
        'es': 'pangrama',
        'fr': 'pangramme',
        'de': 'pangramm',
        'it': 'pangramma'
      }
    },
    'language': {
      word: 'language',
      pronunciation: '/ˈlæŋɡwɪdʒ/',
      partOfSpeech: 'noun',
      cefr: 'A2',
      frequency: 'High',
      definitions: [
        'A system of communication used by people',
        'The words and expressions used in a particular field'
      ],
      synonyms: ['tongue', 'speech', 'dialect', 'vocabulary'],
      antonyms: [],
      examples: [
        'English is a global language.',
        'She speaks three languages fluently.'
      ],
      translations: {
        'es': 'idioma',
        'fr': 'langue',
        'de': 'sprache',
        'it': 'lingua'
      }
    },
    'learning': {
      word: 'learning',
      pronunciation: '/ˈlɜːrnɪŋ/',
      partOfSpeech: 'noun',
      cefr: 'A2',
      frequency: 'High',
      definitions: [
        'The process of acquiring knowledge or skills',
        'Knowledge gained through study or experience'
      ],
      synonyms: ['education', 'study', 'training', 'instruction'],
      antonyms: ['ignorance'],
      examples: [
        'Learning a new language takes time and practice.',
        'Online learning has become very popular.'
      ],
      translations: {
        'es': 'aprendizaje',
        'fr': 'apprentissage',
        'de': 'lernen',
        'it': 'apprendimento'
      }
    },
    'vocabulary': {
      word: 'vocabulary',
      pronunciation: '/vəˈkæbjʊləri/',
      partOfSpeech: 'noun',
      cefr: 'B1',
      frequency: 'Medium',
      definitions: [
        'All the words known and used by a person',
        'The words used in a particular language or subject'
      ],
      synonyms: ['lexicon', 'wordstock', 'terminology'],
      antonyms: [],
      examples: [
        'Reading helps expand your vocabulary.',
        'Medical vocabulary can be difficult to understand.'
      ],
      translations: {
        'es': 'vocabulario',
        'fr': 'vocabulaire',
        'de': 'wortschatz',
        'it': 'vocabolario'
      }
    }
  };

  // If word not found in mock data, create a basic definition
  if (!mockData[word as keyof typeof mockData]) {
    return {
      word,
      pronunciation: `/${word}/`,
      partOfSpeech: 'word',
      cefr: 'Unknown',
      frequency: 'Unknown',
      definitions: [`Definition for "${word}" - a word in the text`],
      synonyms: [],
      antonyms: [],
      examples: [`Example with "${word}" would appear here.`],
      translations: {
        'es': `${word} (Spanish)`,
        'fr': `${word} (French)`,
        'de': `${word} (German)`,
        'it': `${word} (Italian)`,
        'pt': `${word} (Portuguese)`,
        'ru': `${word} (Russian)`,
        'ja': `${word} (Japanese)`,
        'ko': `${word} (Korean)`,
        'zh': `${word} (Chinese)`,
        'ar': `${word} (Arabic)`,
        'hi': `${word} (Hindi)`
      }
    };
  }

  return mockData[word as keyof typeof mockData];
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
    }, 300);
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
        {targetLanguage !== sourceLanguage && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-1">
              <Globe className="h-3 w-3" />
              <span>Translation</span>
            </h4>
            <Badge className="bg-blue-500 text-white">
              {wordData.translations[targetLanguage] || `${word} (${targetLanguage})`}
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
