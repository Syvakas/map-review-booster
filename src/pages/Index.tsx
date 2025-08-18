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
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
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
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Review Form */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="gradient-card shadow-lg rounded-2xl p-6 border border-border/50 hover:shadow-xl transition-all duration-300">
                <ReviewForm
                  initialKeywords={config.keywords}
                  onImprovedText={handleImprovedText}
                />
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {improvedText ? (
                <div className="shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                  <ResultCard
                    improvedText={improvedText}
                    gmapsUrl={config.gmapsUrl}
                    onCopyAndOpen={handleCopyAndOpen}
                  />
                </div>
              ) : (
                <div className="gradient-card shadow-lg rounded-2xl p-8 text-center border border-border/50 hover:shadow-xl transition-all duration-300">
                  <div className="p-4 bg-muted/30 rounded-2xl mb-4 mx-auto w-fit shadow-sm">
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

          {/* Features Section - Premium 3-Column Grid */}
          <div className="py-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Πώς λειτουργεί;
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Απλά 3 βήματα για την τέλεια κριτική
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature Card 1 */}
              <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Γράψε την κριτική σου
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Περιέγραψε την εμπειρία σου με φυσικό τρόπο, όπως θα την έλεγες σε έναν φίλο
                </p>
              </div>

              {/* Feature Card 2 */}
              <div className="group bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Λάβε βελτιωμένο κείμενο
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Το κείμενο γίνεται πιο σαφές, ευανάγνωστο και επαγγελματικό αυτόματα
                </p>
              </div>

              {/* Feature Card 3 */}
              <div className="group bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Δημοσίευσε στο Google Maps
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Αντίγραψε και επικόλλησε την βελτιωμένη κριτική στο Google Maps
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Premium styling */}
      <footer className="border-t border-border/50 bg-muted/30 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-start gap-3 p-6 bg-amber-50/50 border border-amber-200/50 rounded-2xl shadow-lg">
            <Shield className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800 leading-relaxed">
              <strong>Σημείωση συμμόρφωσης:</strong> Η κριτική πρέπει να αντικατοπτρίζει αληθινή εμπειρία. 
              Μην προσθέτεις στοιχεία που δεν ισχύουν και μην δημοσιεύεις προσωπικά δεδομένα τρίτων.
            </div>
          </div>
        </div>
      </footer>
      
      <Footer />
    </div>
  );
};

export default Index;