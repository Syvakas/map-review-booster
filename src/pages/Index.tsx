import { useState, useEffect } from 'react';
import { ReviewForm } from '@/components/ReviewForm';
import { ResultCard } from '@/components/ResultCard';
import { parseQuery, getStoredValue, STORAGE_KEYS } from '@/lib/config';
import { Separator } from '@/components/ui/separator';
import { FileText, Shield } from 'lucide-react';
import Footer from '@/components/Footer';

const Index = () => {
  const [improvedText, setImprovedText] = useState<string>('');
  const [config, setConfig] = useState(() => parseQuery());

  // Load stored improved text on mount
  useEffect(() => {
    const stored = getStoredValue(STORAGE_KEYS.IMPROVED_TEXT);
    if (stored) {
      setImprovedText(stored);
    }
  }, []);

  const handleImprovedText = (text: string) => {
    setImprovedText(text);
  };

  const handleCopyAndOpen = () => {
    // Optional callback for analytics or additional actions
    console.log('User completed copy and open action');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero border-b border-border/50">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Βελτίωση κριτικής πριν το Google Maps
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Γράψε με δικά σου λόγια την εμπειρία σου. Το κείμενο θα γίνει πιο σαφές και χρήσιμο — 
              χωρίς να προστεθούν πράγματα που δεν είπες.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Review Form */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="gradient-card shadow-medium rounded-xl p-6">
                <ReviewForm
                  initialKeywords={config.keywords}
                  onImprovedText={handleImprovedText}
                />
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {improvedText ? (
                <ResultCard
                  improvedText={improvedText}
                  gmapsUrl={config.gmapsUrl}
                  onCopyAndOpen={handleCopyAndOpen}
                />
              ) : (
                <div className="gradient-card shadow-soft rounded-xl p-8 text-center border border-border/50">
                  <div className="p-4 bg-muted/30 rounded-xl mb-4 mx-auto w-fit">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Αναμονή για βελτίωση
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Συμπληρώστε την κριτική σας και πατήστε "Βελτίωση κειμένου" για να δείτε το αποτέλεσμα εδώ.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Separator */}
          <div className="py-4">
            <Separator className="bg-border/50" />
          </div>

          {/* Instructions */}
          <div className="gradient-card shadow-soft rounded-xl p-6 border border-accent/30">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              Πώς λειτουργεί;
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold text-lg">1</span>
                </div>
                <h3 className="font-medium">Γράψε την κριτική σου</h3>
                <p className="text-sm text-muted-foreground">
                  Περιέγραψε την εμπειρία σου με φυσικό τρόπο
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold text-lg">2</span>
                </div>
                <h3 className="font-medium">Λάβε βελτιωμένο κείμενο</h3>
                <p className="text-sm text-muted-foreground">
                  Το κείμενο γίνεται πιο σαφές και ευανάγνωστο
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold text-lg">3</span>
                </div>
                <h3 className="font-medium">Δημοσίευσε στο Google Maps</h3>
                <p className="text-sm text-muted-foreground">
                  Αντίγραψε και επικόλλησε στην κριτική σου
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Replaced with new Footer component */}
      <footer className="border-t border-border/50 bg-muted/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-3 p-4 bg-amber-50/50 border border-amber-200/50 rounded-lg">
              <Shield className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800 leading-relaxed">
                <strong>Σημείωση συμμόρφωσης:</strong> Η κριτική πρέπει να αντικατοπτρίζει αληθινή εμπειρία. 
                Μην προσθέτεις στοιχεία που δεν ισχύουν και μην δημοσιεύεις προσωπικά δεδομένα τρίτων.
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      <Footer />
    </div>
  );
};

export default Index;