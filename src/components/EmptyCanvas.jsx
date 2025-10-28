import React from 'react';

export default function EmptyCanvas() {
  return (
    <section className="relative mx-auto mt-8 w-full max-w-6xl flex-1 px-4">
      <div className="rounded-xl border border-dashed border-neutral-300/80 bg-white/60 p-8 shadow-sm">
        <div className="grid place-items-center py-24">
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">Your blank canvas</h2>
            <p className="mt-2 max-w-xl text-sm text-neutral-600">
              Start adding components, layouts, or data. This area is intentionally empty—perfect for rapid prototyping
              and experimentation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
