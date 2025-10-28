import { Home } from "lucide-react";

export default function SiteHeader() {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-3">
        <div className="inline-flex items-center justify-center rounded-md border p-2 text-gray-700">
          <Home className="h-5 w-5" />
        </div>
        <h1 className="text-lg font-semibold tracking-tight text-gray-900">Blank Starter</h1>
      </div>
    </header>
  );
}
