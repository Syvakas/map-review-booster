import { useState, useEffect } from 'react';
import { ReviewForm } from '@/components/ReviewForm';
import { ResultCard } from '@/components/ResultCard';
import { parseQuery, getStoredValue, STORAGE_KEYS } from '@/lib/config';
import { Separator } from '@/components/ui/separator';
import { FileText, Shield } from 'lucide-react';
import Footer from '@/components/Footer';
import { AccessCodeForm } from '@/components/AccessCodeForm';

const Index = () => {
  const [improvedText, setImprovedText] = useState<string>('');
  const [config, setConfig] = useState(() => parseQuery());
  const [hasAccess, setHasAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  // Check access on mount
  useEffect(() => {
    const accessGranted = localStorage.getItem('access_granted');
    const accessTimestamp = localStorage.getItem('access_timestamp');
    
    if (accessGranted === 'true' && accessTimestamp) {
      const timestamp = parseInt(accessTimestamp);
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      if (now - timestamp < twentyFourHours) {
        setHasAccess(true);
      } else {
        localStorage.removeItem('access_granted');
        localStorage.removeItem('access_timestamp');
      }
    }
    setIsCheckingAccess(false);
  }, []);

  // Load stored improved text on mount
  useEffect(() => {
    const stored = getStoredValue(STORAGE_KEYS.IMPROVED_TEXT);
    if (stored) {
      setImprovedText(stored);
    }
  }, []);

  const handleAccessGranted = () => {
    setHasAccess(true);
  };

  const handleImprovedText = (text: string) => {
    setImprovedText(text);
  };

  const handleCopyAndOpen = () => {
    console.log('User completed copy and open action');
  };

  // Show loading while checking access
  if (isCheckingAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-8 w-8 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Έλεγχος πρόσβασης...</p>
        </div>
      </div>
    );
  }

  // Show access code form if no access
  if (!hasAccess) {
    return <AccessCodeForm onAccessGranted={handleAccessGranted} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8 md:py-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-2xl shadow-lg">
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
      <main className="max-w-5xl mx-auto px-6 sm:px-8 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Review Form */}
          <div className="space-y-6">
            <ReviewForm 
              onImprovedText={handleImprovedText}
              config={config}
            />
          </div>

          {/* Results */}
          <div className="space-y-6">
            <ResultCard 
              improvedText={improvedText}
              onCopyAndOpen={handleCopyAndOpen}
              config={config}
            />
          </div>
        </div>

        <Separator className="my-12" />

        {/* Features Section */}
        <div className="text-center space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Γιατί να χρησιμοποιήσεις αυτό το εργαλείο;
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                <div className="text-primary mb-3">
                  <FileText className="h-6 w-6 mx-auto" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Σαφήνεια</h3>
                <p className="text-sm text-muted-foreground">
                  Το κείμενό σου γίνεται πιο κατανοητό και οργανωμένο
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                <div className="text-primary mb-3">
                  <Shield className="h-6 w-6 mx-auto" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Αυθεντικότητα</h3>
                <p className="text-sm text-muted-foreground">
                  Διατηρεί τη δική σου φωνή και εμπειρία
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                <div className="text-primary mb-3">
                  <FileText className="h-6 w-6 mx-auto" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Χρησιμότητα</h3>
                <p className="text-sm text-muted-foreground">
                  Βοηθά άλλους να κατανοήσουν καλύτερα την εμπειρία σου
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Compliance Note */}
      <div className="border-t border-border/50 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-4">
          <p className="text-xs text-muted-foreground text-center">
            🔒 Προστατευμένο με κωδικό πρόσβασης για ασφαλή χρήση των OpenAI tokens
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;