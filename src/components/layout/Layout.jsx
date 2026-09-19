import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import VerifyDocModal from '../modals/VerifyDocModal';
import InspectionModal from '../modals/InspectionModal';
import TrainingModal from '../modals/TrainingModal';

export default function Layout() {
  const [verifyDocOpen, setVerifyDocOpen] = useState(false);
  const [inspectionOpen, setInspectionOpen] = useState(false);
  const [trainingOpen, setTrainingOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-brand-orange selection:text-white relative">
      
      <Navbar
        onOpenVerifyDoc={() => setVerifyDocOpen(true)}
        onOpenInspection={() => setInspectionOpen(true)}
      />
      
      <main className="flex-1">
        <Outlet context={{
          onOpenVerifyDoc: () => setVerifyDocOpen(true),
          onOpenInspection: () => setInspectionOpen(true),
          onOpenTraining: () => setTrainingOpen(true)
        }} />
      </main>

      {/* ================================================================= */}
      {/* STICKY RIGHT-EDGE FORM BUTTONS                                    */}
      {/* ================================================================= */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2.5 shadow-2xl">
        <button
          onClick={() => setInspectionOpen(true)}
          className="bg-brand-orange hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider py-4 px-3 rounded-l-lg shadow-lg flex items-center space-x-2 transition-transform hover:-translate-x-1.5 [writing-mode:vertical-rl] rotate-180 cursor-pointer"
          aria-label="Open Technical Inquiry Form"
        >
          <span className="rotate-90 text-sm mb-1">&#9993;</span>
          <span>Inquiry Form</span>
        </button>
        <button
          onClick={() => setTrainingOpen(true)}
          className="bg-brand-blue hover:bg-brand-dark text-white font-bold text-xs uppercase tracking-wider py-4 px-3 rounded-l-lg shadow-lg flex items-center space-x-2 transition-transform hover:-translate-x-1.5 [writing-mode:vertical-rl] rotate-180 cursor-pointer"
          aria-label="Open Corporate Training Registration"
        >
          <span className="rotate-90 text-sm mb-1">&#127891;</span>
          <span>Training Registration</span>
        </button>
      </div>

      {/* ================================================================= */}
      {/* FLOATING WHATSAPP BUTTON (Bottom Right)                           */}
      {/* ================================================================= */}
      <aside aria-label="Quick WhatsApp Contact" className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/918200441159"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
        >
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold text-xs pl-0 group-hover:pl-2">
            Chat with Dispatch Desk
          </span>
        </a>
      </aside>

      <Footer onOpenVerifyDoc={() => setVerifyDocOpen(true)} />

      {/* Global Modals */}
      <VerifyDocModal
        isOpen={verifyDocOpen}
        onClose={() => setVerifyDocOpen(false)}
      />

      <InspectionModal
        isOpen={inspectionOpen}
        onClose={() => setInspectionOpen(false)}
      />

      <TrainingModal
        isOpen={trainingOpen}
        onClose={() => setTrainingOpen(false)}
      />
    </div>
  );
}
