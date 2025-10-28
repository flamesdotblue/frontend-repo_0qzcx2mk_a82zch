export default function InfoPanel() {
  return (
    <section className="mx-auto max-w-6xl w-full px-4">
      <div className="mt-6 rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Getting started</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
          <li>Add your first section into the empty canvas above.</li>
          <li>Use Tailwind utility classes for quick styling.</li>
          <li>Keep components focused and reusable.</li>
        </ul>
      </div>
    </section>
  );
}
