import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { KeywordsInput } from './KeywordsInput';
import { apiClient } from '@/lib/api';
import { getStoredValue, setStoredValue, STORAGE_KEYS } from '@/lib/config';

interface ReviewFormProps {
  initialKeywords: string[];
  onImprovedText: (text: string) => void;
}

const MAX_CHARACTERS = 2000;
const MIN_CHARACTERS = 5;

export function ReviewForm({ initialKeywords, onImprovedText }: ReviewFormProps) {
  const [originalText, setOriginalText] = useState('');
  const [keywords, setKeywords] = useState<string[]>(initialKeywords);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Load stored text on mount
  useEffect(() => {
    const stored = getStoredValue(STORAGE_KEYS.ORIGINAL_TEXT);
    if (stored) {
      setOriginalText(stored);
    }
  }, []);

  // Save text to storage when it changes
  useEffect(() => {
    if (originalText) {
      setStoredValue(STORAGE_KEYS.ORIGINAL_TEXT, originalText);
    }
  }, [originalText]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARACTERS) {
      setOriginalText(value);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (originalText.length < MIN_CHARACTERS) {
      setError(`Γράψε λίγες προτάσεις για την εμπειρία σου (≥ ${MIN_CHARACTERS} χαρακτήρες).`);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.rewriteReview({
        text: originalText,
        keywords: keywords.length > 0 ? keywords : undefined,
      });

      // Store the improved text
      setStoredValue(STORAGE_KEYS.IMPROVED_TEXT, response.improvedText);
      onImprovedText(response.improvedText);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Απρόβλεπτο σφάλμα';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const characterCount = originalText.length;
  const isValid = characterCount >= MIN_CHARACTERS && characterCount <= MAX_CHARACTERS;
  const isNearLimit = characterCount > MAX_CHARACTERS * 0.9;

  return (
    <form onSubmit={handleSubmit} className="space-y-6" role="form">
      <div className="space-y-2">
        <Label htmlFor="review-text" className="text-base font-medium">
          Η κριτική σου *
        </Label>
        <div className="relative">
          <Textarea
            id="review-text"
            value={originalText}
            onChange={handleTextChange}
            placeholder="Π.χ. Η κυρία Έφη είναι η καλύτερη! Με βοήθησε πολύ με τα αγγλικά και είναι πολύ υπομονετική..."
            className={`min-h-[120px] resize-y transition-smooth focus:ring-2 focus:ring-primary/20 ${
              isNearLimit ? 'border-amber-400 focus:border-amber-400' : ''
            } ${!isValid && originalText.length > 0 ? 'border-destructive focus:border-destructive' : ''}`}
            aria-describedby="character-count validation-message"
            required
          />
          <div 
            id="character-count"
            className={`absolute bottom-2 right-2 text-xs px-2 py-1 rounded backdrop-blur-sm ${
              isNearLimit 
                ? 'text-amber-600 bg-amber-50/80' 
                : characterCount > MAX_CHARACTERS 
                  ? 'text-destructive bg-destructive-light/80'
                  : 'text-muted-foreground bg-background/80'
            }`}
            aria-live="polite"
          >
            {characterCount}/{MAX_CHARACTERS}
          </div>
        </div>
      </div>

      <KeywordsInput
        value={keywords}
        onChange={setKeywords}
        placeholder="π.χ. μαθήματα αγγλικών, υπομονετική"
      />

      {error && (
        <Alert variant="destructive" role="alert">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription id="validation-message">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full gradient-primary hover:brightness-110 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
        aria-describedby={error ? "validation-message" : undefined}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span aria-live="polite">Βελτίωση κειμένου...</span>
          </>
        ) : (
          'Βελτίωση κειμένου'
        )}
      </Button>
    </form>
  );
}