import Spline from '@splinetool/react-spline';
import { Rocket } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-16 md:pb-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-200 text-purple-700 bg-purple-50 text-xs">
              Public Interest • Safer AI Together
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
              Public AI Red-Teaming Platform
            </h1>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              Join community exercises to stress test AI models, report harmful or biased outputs, and generate
              actionable insights for researchers and policymakers. No-code, privacy-conscious, and research-ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#playground" className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-gray-900 text-white hover:bg-black">
                <Rocket className="h-4 w-4" /> Start Testing
              </a>
              <a href="#exercises" className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-gray-300 hover:bg-gray-50">
                View Exercises
              </a>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div>
                <div className="text-2xl font-semibold">3</div>
                <div className="text-sm text-gray-600">Models supported</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">Flag</div>
                <div className="text-sm text-gray-600">Harm & bias types</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">Export</div>
                <div className="text-sm text-gray-600">CSV / JSON data</div>
              </div>
            </div>
          </div>
          <div className="relative h-[420px] sm:h-[520px] md:h-[560px]">
            <div className="absolute inset-0 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <Spline
                scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode"
                style={{ width: '100%', height: '100%' }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-white/40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
