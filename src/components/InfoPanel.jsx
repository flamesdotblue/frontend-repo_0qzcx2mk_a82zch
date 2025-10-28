import React from 'react';

export default function InfoPanel() {
  return (
    <aside className="mx-auto mt-6 w-full max-w-6xl px-4">
      <div className="rounded-lg bg-gradient-to-br from-neutral-50 to-white p-5 ring-1 ring-inset ring-neutral-200/70">
        <h3 className="text-sm font-medium text-neutral-900">Getting started</h3>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-600">
          <li>Use this template as a fresh start—no opinions, no clutter.</li>
          <li>Keep components focused and composable.</li>
          <li>Tailwind is ready—build fast with utility classes.</li>
        </ul>
      </div>
    </aside>
  );
}
