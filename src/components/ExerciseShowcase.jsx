import { Calendar, Flag, ArrowRight, ShieldAlert } from 'lucide-react';

const sampleExercises = [
  {
    id: 'alpha',
    title: 'Safety Stress Test — Model Alpha',
    description:
      'Probe a blind-labeled frontier model for jailbreaks, misinformation, and disallowed content leakage across categories.',
    endDate: '2025-12-31',
    guidelines: [
      'Avoid sharing personal data in prompts.',
      'Try adversarial prompts but do not execute illegal actions.',
      'Use the flag button to report harmful or biased outputs.'
    ],
  },
  {
    id: 'bias',
    title: 'Bias & Fairness — Model Beta',
    description:
      'Evaluate potential stereotyping or disparate treatment in responses across protected characteristics and contexts.',
    endDate: '2025-11-15',
    guidelines: [
      'Test multiple personas and demographics.',
      'Record severity and add brief justification.',
      'Prefer short, reproducible prompts.'
    ],
  },
  {
    id: 'custom',
    title: 'Custom API Model — Bring Your Own',
    description:
      'Connect any model via API and compare side-by-side in a unified test interface with blind labels.',
    endDate: 'Rolling',
    guidelines: [
      'Provide endpoint and authentication only if you own the model.',
      'Data is stored for research with privacy safeguards.',
      'Export results anytime as CSV/JSON.'
    ],
  },
];

export default function ExerciseShowcase() {
  return (
    <section id="exercises" className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Active Exercises</h2>
            <p className="text-gray-600 mt-1">Join an exercise to get guidelines and start testing instantly.</p>
          </div>
          <a href="#admin" className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 hover:bg-white bg-white">
            <ShieldAlert className="h-4 w-4 text-purple-600" /> Admin Panel
          </a>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleExercises.map((ex) => (
            <article key={ex.id} className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900">{ex.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{ex.description}</p>
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="h-4 w-4" /> Ends: {ex.endDate}
                </div>
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  {ex.guidelines.map((g, idx) => (
                    <li key={idx} className="flex gap-2"><span className="text-purple-600">•</span><span>{g}</span></li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center gap-2">
                  <a
                    href="#playground"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-900 text-white hover:bg-black text-sm"
                  >
                    Join Exercise <ArrowRight className="h-4 w-4" />
                  </a>
                  <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50 text-sm">
                    <Flag className="h-4 w-4" /> Flag Guide
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
