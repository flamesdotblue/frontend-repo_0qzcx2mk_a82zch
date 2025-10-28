export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} RedTeam AI. Built for public-interest AI safety.</p>
          <div className="flex items-center gap-4 text-sm">
            <a href="#privacy" className="text-gray-600 hover:text-gray-900">Privacy</a>
            <a href="#terms" className="text-gray-600 hover:text-gray-900">Terms</a>
            <a href="#export" className="text-gray-600 hover:text-gray-900">Data Export</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
