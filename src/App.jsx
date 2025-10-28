import SiteHeader from "./components/SiteHeader";
import EmptyCanvas from "./components/EmptyCanvas";
import InfoPanel from "./components/InfoPanel";
import SiteFooter from "./components/SiteFooter";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <SiteHeader />
      <main className="w-full py-8">
        <EmptyCanvas />
        <InfoPanel />
      </main>
      <SiteFooter />
    </div>
  );
}
