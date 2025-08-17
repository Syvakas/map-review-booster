interface RewriteRequest {
  text: string;
  keywords?: string[];
}

interface RewriteResponse {
  improved: string;
}

interface ApiError {
  error: string;
}

const API_BASE = import.meta.env.VITE_API_BASE || '';

export class ApiClient {
  private controller: AbortController | null = null;

  async rewriteReview(data: RewriteRequest): Promise<RewriteResponse> {
    if (!API_BASE) {
      throw new Error('API_BASE δεν είναι ρυθμισμένο');
    }

    // Cancel previous request if it exists
    if (this.controller) {
      this.controller.abort();
    }

    this.controller = new AbortController();
    const timeoutId = setTimeout(() => this.controller?.abort(), 15000);

    try {
      const response = await fetch(`${API_BASE}/api/rewrite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: this.controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({ 
          error: 'Άγνωστο σφάλμα διακομιστή' 
        }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result: RewriteResponse = await response.json();
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Το αίτημα διακόπηκε (timeout)');
        }
        throw error;
      }
      
      throw new Error('Απρόβλεπτο σφάλμα δικτύου');
    } finally {
      this.controller = null;
    }
  }
}

export const apiClient = new ApiClient();