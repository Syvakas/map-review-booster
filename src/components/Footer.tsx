export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
        
        {/* Αριστερά */}
        <p className="text-sm text-gray-500">
          © 2025 <span className="font-medium">Map Review Booster</span> — Ανάπτυξη από{" "}
          <span className="font-medium">Loizos Syvakas</span> &{" "}
          <a
            href="https://gridisi.gr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            gridisi.gr
          </a>
        </p>

        {/* Δεξιά */}
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="/terms" className="text-sm text-gray-500 hover:text-blue-500">
            Όροι χρήσης
          </a>
          <a href="/privacy" className="text-sm text-gray-500 hover:text-blue-500">
            Πολιτική απορρήτου
          </a>
        </div>
      </div>
    </footer>
  );
}