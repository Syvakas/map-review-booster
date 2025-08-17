import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Save } from 'lucide-react';
import { getStoredValue, setStoredValue, STORAGE_KEYS } from '@/lib/config';

interface ApiSetupProps {
  onApiBaseSet: (apiBase: string) => void;
}

export function ApiSetup({ onApiBaseSet }: ApiSetupProps) {
  const [apiBase, setApiBase] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const stored = getStoredValue(STORAGE_KEYS.API_BASE_OVERRIDE);
    if (stored) {
      setApiBase(stored);
    }
  }, []);

  const handleSave = () => {
    if (apiBase.trim()) {
      setStoredValue(STORAGE_KEYS.API_BASE_OVERRIDE, apiBase.trim());
      onApiBaseSet(apiBase.trim());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <Settings className="h-5 w-5" />
          Ρύθμιση API
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            Το VITE_API_BASE δεν είναι ρυθμισμένο. Εισάγετε προσωρινά το URL του backend για να συνεχίσετε.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <Label htmlFor="api-base-input">
            Backend URL (π.χ. https://api.example.com)
          </Label>
          <div className="flex gap-2">
            <Input
              id="api-base-input"
              value={apiBase}
              onChange={(e) => setApiBase(e.target.value)}
              placeholder="https://api.example.com"
              className="flex-1"
            />
            <Button 
              onClick={handleSave}
              disabled={!apiBase.trim() || isSaved}
              variant={isSaved ? "outline" : "default"}
            >
              {isSaved ? (
                <>
                  <Save className="mr-1 h-4 w-4" />
                  Αποθηκεύτηκε
                </>
              ) : (
                'Αποθήκευση'
              )}
            </Button>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Αυτή η ρύθμιση αποθηκεύεται τοπικά στον browser σας και δεν διαμοιράζεται.
        </p>
      </CardContent>
    </Card>
  );
}