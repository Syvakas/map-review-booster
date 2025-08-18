import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, Check } from 'lucide-react';
import { copyToClipboard } from '@/lib/clipboard';
import { toast } from '@/hooks/use-toast';

interface ResultCardProps {
  improvedText: string;
  gmapsUrl: string;
  onCopyAndOpen: () => void;
}

export function ResultCard({ improvedText, gmapsUrl, onCopyAndOpen }: ResultCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(improvedText);
    if (success) {
      setIsCopied(true);
      toast({
        title: "Αντιγράφηκε στο πρόχειρο!",
        description: "Το βελτιωμένο κείμενο αντιγράφηκε επιτυχώς",
        duration: 2000,
      });
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      toast({
        title: "Σφάλμα αντιγραφής",
        description: "Δεν ήταν δυνατή η αντιγραφή. Δοκιμάστε χειροκίνητη επιλογή.",
        variant: "destructive",
      });
    }
  };

  const handleCopyAndOpenGmaps = async () => {
    setIsLoading(true);
    
    try {
      // First copy the text
      const success = await copyToClipboard(improvedText);
      
      if (success) {
        toast({
          title: "Αντιγράφηκε στο πρόχειρο!",
          description: "Άνοιγμα Google Maps...",
        });
        
        // Small delay to ensure user sees the first toast
        setTimeout(() => {
          // Then open Google Maps
          if (gmapsUrl) {
            window.open(gmapsUrl, '_blank', 'noopener,noreferrer');
            toast({
              title: "Google Maps άνοιξε!",
              description: "Επικολλήστε το κείμενο και δημοσιεύστε την κριτική σας",
            });
          } else {
            toast({
              title: "Δεν υπάρχει URL Google Maps",
              description: "Ρυθμίστε το VITE_GMAPS_URL ή χρησιμοποιήστε το query parameter gmaps",
              variant: "destructive",
            });
          }
          onCopyAndOpen();
        }, 500);
      } else {
        toast({
          title: "Σφάλμα αντιγραφής",
          description: "Αντιγράψτε χειροκίνητα το κείμενο και επισκεφθείτε το Google Maps",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const characterCount = improvedText.length;

  return (
    <Card className="gradient-card shadow-medium transition-smooth hover:shadow-strong">
      <CardHeader>
        <CardTitle className="text-success flex items-center gap-2">
          <Check className="h-5 w-5" />
          Προτεινόμενο κείμενο
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <div 
            className="prose prose-sm max-w-none p-4 bg-accent/30 rounded-lg border border-accent/50 min-h-[120px] whitespace-pre-wrap"
            role="region"
            aria-label="Βελτιωμένο κείμενο κριτικής"
          >
            {improvedText}
          </div>
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded backdrop-blur-sm">
            {characterCount} χαρακτήρες
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={isCopied}
            className="flex-1 transition-smooth hover:bg-secondary-hover"
          >
            {isCopied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-success" />
                Αντιγράφηκε!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Αντιγραφή
              </>
            )}
          </Button>
          
          <Button
            onClick={handleCopyAndOpenGmaps}
            disabled={isLoading || !gmapsUrl}
            className="flex-1 gradient-primary hover:brightness-110 transition-smooth"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Φόρτωση...
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Αντιγραφή & Άνοιγμα Maps
              </>
            )}
          </Button>
        </div>
        
        {!gmapsUrl && (
          <p className="text-sm text-destructive bg-destructive-light p-3 rounded-lg">
            ⚠️ Δεν έχει ρυθμιστεί URL Google Maps. Ορίστε το VITE_GMAPS_URL ή χρησιμοποιήστε το query parameter ?gmaps=...
          </p>
        )}
      </CardContent>
    </Card>
  );
}