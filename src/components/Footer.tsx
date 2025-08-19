export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 py-8">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-gray-500 text-xs font-light">
          © {year} Map Review Booster — Ανάπτυξη από{" "}
          <a
            href="https://www.linkedin.com/in/loizos-syvakas/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700 transition-colors duration-200 font-normal text-gray-600"
          >
            Loizos Syvakas
          </a>{" "} &{" "}
          <a
            href="https://gridisi.gr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700 transition-colors duration-200 font-normal"
          >
            gridisi.gr
          </a>
        </p>
      </div>
    </footer>
  );
}