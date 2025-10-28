import Navbar from './components/Navbar';
import TeamManager from './components/TeamManager';
import ExerciseFilter from './components/ExerciseFilter';
import PlaygroundAdmin from './components/PlaygroundAdmin';

function Divider() {
  return <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Navbar />
      <main className="flex-1">
        <TeamManager />
        <Divider />
        <ExerciseFilter />
        <Divider />
        <PlaygroundAdmin />
      </main>
    </div>
  );
}
