import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, Loader2, AlertCircle } from 'lucide-react';

interface AccessCodeFormProps {
  onAccessGranted: () => void;
}

export function AccessCodeForm({ onAccessGranted }: AccessCodeFormProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    setTimeout(() => {
      // Διαβάζει τον κωδικό μόνο από το .env αρχείο
      const correctCode = import.meta.env.VITE_ACCESS_CODE;
      
      if (code === correctCode) {
        localStorage.setItem('access_granted', 'true');
        localStorage.setItem('access_timestamp', Date.now().toString());
        onAccessGranted();
      } else {
        setError('Λάθος κωδικός πρόσβασης.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-primary/10 rounded-2xl shadow-lg">
              <Shield className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Προστατευμένη Πρόσβαση
          </h1>
          <p className="text-muted-foreground">
            Εισάγετε τον κωδικό πρόσβασης για να χρησιμοποιήσετε το εργαλείο βελτίωσης κριτικών
          </p>
        </div>

        <div className="gradient-card shadow-lg rounded-2xl p-8 border border-border/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="access-code" className="text-sm font-medium">
                Κωδικός Πρόσβασης
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="access-code"
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Εισάγετε τον κωδικό"
                  className="pl-10 text-center text-lg tracking-widest"
                  maxLength={4}
                  required
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !code.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Έλεγχος κωδικού...
                </>
              ) : (
                'Είσοδος στο Εργαλείο'
              )}
            </Button>
          </form>
        </div>

        <div className="text-center">
          <div className="flex items-start gap-3 p-4 bg-amber-50/50 border border-amber-200/50 rounded-xl">
            <Shield className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-800">
              🔒 Η προστασία με κωδικό εξασφαλίζει ότι μόνο εξουσιοδοτημένοι χρήστες 
              μπορούν να χρησιμοποιήσουν το εργαλείο και να καταναλώσουν OpenAI tokens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}