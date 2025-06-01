
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Languages, BookOpen, Heart, Moon, Sun, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import WordDefinition from '@/components/WordDefinition';
import LanguageSelector from '@/components/LanguageSelector';
import VocabularyList from '@/components/VocabularyList';
import TextDisplay from '@/components/TextDisplay';

const Index = () => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordPosition, setWordPosition] = useState({ x: 0, y: 0 });
  const [savedWords, setSavedWords] = useState<any[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  // Load saved words from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('clicktionary-vocabulary');
    if (saved) {
      try {
        setSavedWords(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved vocabulary:', error);
      }
    }
  }, []);

  // Save words to localStorage whenever savedWords changes
  useEffect(() => {
    localStorage.setItem('clicktionary-vocabulary', JSON.stringify(savedWords));
  }, [savedWords]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const translateText = async () => {
    if (!text.trim() || sourceLanguage === targetLanguage) {
      toast({
        title: "Translation not needed",
        description: "Please enter text and select different source/target languages.",
        variant: "destructive"
      });
      return;
    }

    setIsTranslating(true);
    try {
      // Using MyMemory Translation API (free)
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLanguage}|${targetLanguage}`
      );
      const data = await response.json();
      
      if (data.responseStatus === 200) {
        setTranslatedText(data.responseData.translatedText);
        toast({
          title: "Translation complete",
          description: "Text has been translated successfully."
        });
      } else {
        throw new Error('Translation failed');
      }
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText(`Translation failed. Showing original text: ${text}`);
      toast({
        title: "Translation failed",
        description: "Using a fallback translation service. Results may vary.",
        variant: "destructive"
      });
    }
    setIsTranslating(false);
  };

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
                  <CardTitle>Enter Text ({sourceLanguage === 'auto' ? 'Auto-detect' : sourceLanguage})</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setText(sampleText)}
                    >
                      English Sample
                    </Button>

                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your text here to start learning..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[120px] resize-none border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                  dir={sourceLanguage === 'he' ? 'rtl' : 'ltr'}
                />
                {text && sourceLanguage !== targetLanguage && (
                  <Button 
                    onClick={translateText} 
                    disabled={isTranslating}
                    className="w-full"
                  >
                    {isTranslating ? 'Translating...' : `Translate to ${targetLanguage}`}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Original Text Display */}
            {text && (
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Original Text ({sourceLanguage === 'auto' ? 'Auto-detected' : sourceLanguage})</CardTitle>
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

            {/* Translated Text Display */}
            {translatedText && sourceLanguage !== targetLanguage && (
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Translated Text ({targetLanguage})</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click on words in the translated text to learn more
                  </p>
                </CardHeader>
                <CardContent>
                  <TextDisplay
                    text={translatedText}
                    onWordClick={handleWordClick}
                    sourceLanguage={targetLanguage}
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
