
import React, { useMemo } from 'react';

interface TextDisplayProps {
  text: string;
  onWordClick: (word: string, position: { x: number, y: number }) => void;
  sourceLanguage: string;
}

// Mock CEFR difficulty data - in a real app, this would come from an API
const wordDifficulty: { [key: string]: string } = {
  'the': 'A1', 'a': 'A1', 'and': 'A1', 'is': 'A1', 'in': 'A1', 'to': 'A1', 'of': 'A1',
  'quick': 'A2', 'brown': 'A2', 'fox': 'A2', 'over': 'A2', 'dog': 'A1', 'every': 'A2',
  'jumps': 'B1', 'lazy': 'B1', 'pangram': 'C1', 'contains': 'B1', 'letter': 'A2',
  'alphabet': 'B1', 'commonly': 'B2', 'testing': 'B1', 'fonts': 'B2', 'keyboards': 'B2',
  'language': 'A2', 'learning': 'A2', 'becomes': 'B1', 'effective': 'B2', 'students': 'A2',
  'engage': 'B2', 'authentic': 'C1', 'materials': 'B1', 'challenge': 'B1', 'vocabulary': 'B1',
  'knowledge': 'A2'
};

const getDifficultyColor = (word: string): string => {
  const level = wordDifficulty[word.toLowerCase()];
  switch (level) {
    case 'A1':
    case 'A2':
      return 'bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 border-green-300 dark:border-green-700';
    case 'B1':
    case 'B2':
      return 'bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:hover:bg-yellow-800 border-yellow-300 dark:border-yellow-700';
    case 'C1':
    case 'C2':
      return 'bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 border-red-300 dark:border-red-700';
    default:
      return 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600';
  }
};

const TextDisplay: React.FC<TextDisplayProps> = ({ text, onWordClick, sourceLanguage }) => {
  const processedText = useMemo(() => {
    // Split text into words while preserving punctuation and spaces
    const tokens = text.split(/(\s+|[^\w\s])/);
    
    return tokens.map((token, index) => {
      // Check if token is a word (contains letters)
      if (/\w/.test(token) && token.trim()) {
        const cleanWord = token.toLowerCase().replace(/[^\w]/g, '');
        const colorClass = getDifficultyColor(cleanWord);
        
        return (
          <span
            key={index}
            className={`inline-block px-1 py-0.5 m-0.5 rounded-md cursor-pointer transition-all duration-200 border ${colorClass} hover:scale-105 hover:shadow-sm`}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              onWordClick(cleanWord, {
                x: rect.left + rect.width / 2,
                y: rect.top
              });
            }}
          >
            {token}
          </span>
        );
      }
      
      // Return non-word tokens as-is
      return <span key={index}>{token}</span>;
    });
  }, [text, onWordClick]);

  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      <div className="leading-relaxed text-gray-800 dark:text-gray-200 select-text">
        {processedText}
      </div>
    </div>
  );
};

export default TextDisplay;
