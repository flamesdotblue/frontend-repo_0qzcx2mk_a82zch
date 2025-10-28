import React from 'react';
import SiteHeader from './components/SiteHeader.jsx';
import EmptyCanvas from './components/EmptyCanvas.jsx';
import InfoPanel from './components/InfoPanel.jsx';
import SiteFooter from './components/SiteFooter.jsx';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 text-neutral-900">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <EmptyCanvas />
        <InfoPanel />
      </main>
      <SiteFooter />
    </div>
  );
}
