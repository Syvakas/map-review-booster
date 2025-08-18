export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 py-6 mt-12">
      <div className="max-w-4xl mx-auto text-center text-gray-600 text-sm">
        © {year} Map Review Booster — Ανάπτυξη από{" "}
        <span className="font-medium">Loizos Syvakas</span> &{" "}
        <a
          href="https://gridisi.gr"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline font-medium"
        >
          gridisi.gr
        </a>
      </div>
    </footer>
  );
}