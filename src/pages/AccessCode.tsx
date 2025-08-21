import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AccessCodeProps {
  onAccessGranted: () => void;
  requiredCode: string;
}

const AccessCode = ({ onAccessGranted, requiredCode }: AccessCodeProps) => {
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    if (code === requiredCode) {
      toast({
        title: "Επιτυχής πρόσβαση! 🎉",
        description: "Καλώς ήρθατε στο Map Review Booster",
      });
      onAccessGranted();
    } else {
      toast({
        title: "Λάθος κωδικός πρόσβασης",
        description: "Παρακαλώ δοκιμάστε ξανά",
        variant: "destructive",
      });
      setCode("");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Map Review Booster
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Εισάγετε τον κωδικό πρόσβασης για να συνεχίσετε
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="access-code" className="text-sm font-medium text-gray-700">
                Κωδικός Πρόσβασης
              </label>
              <div className="relative">
                <Input
                  id="access-code"
                  type={showPassword ? "text" : "password"}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Εισάγετε τον κωδικό σας"
                  className="pr-10"
                  disabled={isLoading}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!code.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Επαλήθευση...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Είσοδος
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Προστατευμένη πρόσβαση • Map Review Booster
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessCode;