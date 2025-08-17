import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface KeywordsInputProps {
  value: string[];
  onChange: (keywords: string[]) => void;
  placeholder?: string;
}

export function KeywordsInput({ value, onChange, placeholder }: KeywordsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addKeyword();
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      // Remove last keyword when backspacing on empty input
      onChange(value.slice(0, -1));
    }
  };

  const addKeyword = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue('');
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    onChange(value.filter(k => k !== keywordToRemove));
  };

  // Handle paste with comma-separated values
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const keywords = pastedText
      .split(',')
      .map(k => k.trim())
      .filter(k => k && !value.includes(k));
    
    if (keywords.length > 0) {
      onChange([...value, ...keywords]);
    }
    setInputValue('');
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="keywords-input">
        Λέξεις-κλειδιά (προαιρετικό)
      </Label>
      <div className="space-y-2">
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map((keyword) => (
              <Badge 
                key={keyword} 
                variant="secondary" 
                className="transition-fast hover:bg-secondary-hover"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => removeKeyword(keyword)}
                  className="ml-2 hover:text-destructive transition-fast"
                  aria-label={`Αφαίρεση λέξης-κλειδιού: ${keyword}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <Input
          id="keywords-input"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onPaste={handlePaste}
          onBlur={addKeyword}
          placeholder={placeholder || "Προσθήκη λέξης-κλειδιού... (πάτα Enter ή κόμμα)"}
          className="transition-smooth focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Πληκτρολόγησε λέξεις-κλειδιά και πάτα Enter ή κόμμα για προσθήκη
      </p>
    </div>
  );
}