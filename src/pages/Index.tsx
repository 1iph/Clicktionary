
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Languages, BookOpen, Heart, Volume2, Moon, Sun, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import WordDefinition from '@/components/WordDefinition';
import LanguageSelector from '@/components/LanguageSelector';
import VocabularyList from '@/components/VocabularyList';
import TextDisplay from '@/components/TextDisplay';

const Index = () => {
  const [text, setText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordPosition, setWordPosition] = useState({ x: 0, y: 0 });
  const [savedWords, setSavedWords] = useState<any[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleWordClick = (word: string, position: { x: number, y: number }) => {
    setSelectedWord(word);
    setWordPosition(position);
    console.log('Word clicked:', word, 'at position:', position);
  };

  const handleSaveWord = (wordData: any) => {
    const newWord = {
      ...wordData,
      id: Date.now(),
      dateAdded: new Date().toISOString(),
      notes: ''
    };
    setSavedWords(prev => [...prev, newWord]);
    toast({
      title: "Word saved!",
      description: `"${wordData.word}" has been added to your vocabulary.`
    });
  };

  const clearSelectedWord = () => {
    setSelectedWord(null);
  };

  const sampleText = `The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and is commonly used for testing fonts and keyboards. Language learning becomes more effective when students engage with authentic materials that challenge their vocabulary knowledge.`;

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Clicktionary
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Click any word to learn more</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVocabulary(!showVocabulary)}
              className="hidden md:flex"
            >
              <Heart className="h-4 w-4 mr-2" />
              Vocabulary ({savedWords.length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Language Selection */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Languages className="h-5 w-5 text-blue-600" />
                  <span>Language Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LanguageSelector
                  sourceLanguage={sourceLanguage}
                  targetLanguage={targetLanguage}
                  onSourceChange={setSourceLanguage}
                  onTargetChange={setTargetLanguage}
                />
              </CardContent>
            </Card>

            {/* Text Input */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Enter Text</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setText(sampleText)}
                  >
                    Load Sample
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste your text here to start learning..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[120px] resize-none border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </CardContent>
            </Card>

            {/* Text Display */}
            {text && (
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Interactive Text</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click on any word to see its definition, pronunciation, and more
                  </p>
                </CardHeader>
                <CardContent>
                  <TextDisplay
                    text={text}
                    onWordClick={handleWordClick}
                    sourceLanguage={sourceLanguage}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Word Definition Panel */}
            {selectedWord && (
              <WordDefinition
                word={selectedWord}
                sourceLanguage={sourceLanguage}
                targetLanguage={targetLanguage}
                position={wordPosition}
                onSave={handleSaveWord}
                onClose={clearSelectedWord}
              />
            )}

            {/* Vocabulary List */}
            <VocabularyList
              words={savedWords}
              onUpdateWords={setSavedWords}
              isVisible={showVocabulary}
              onToggleVisibility={setShowVocabulary}
            />

            {/* Legend */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Difficulty Levels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">A1-A2 (Basic)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm">B1-B2 (Intermediate)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">C1-C2 (Advanced)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                  <span className="text-sm">Unknown</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
