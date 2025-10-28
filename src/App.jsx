import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ExerciseShowcase from './components/ExerciseShowcase';
import Footer from './components/Footer';

function Divider() {
  return <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Divider />
        <ExerciseShowcase />
      </main>
      <Footer />
    </div>
  );
}
