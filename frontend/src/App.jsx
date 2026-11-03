import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ProposalsList from './components/ProposalsList';
import CatalogView from './components/CatalogView';
import EstimationMatrix from './components/EstimationMatrix';
import ComparisonView from './components/ComparisonView';
import NewProposalModal from './components/NewProposalModal';
import UserGuideModal from './components/UserGuideModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('proposals'); // 'proposals', 'catalog', 'comparison', 'matrix'
  const [selectedProposalId, setSelectedProposalId] = useState(null);
  const [showNewProposalModal, setShowNewProposalModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  function handleSelectProposal(id) {
    setSelectedProposalId(id);
    setActiveTab('matrix');
  }

  function handleOpenComparison(id) {
    setSelectedProposalId(id);
    setActiveTab('comparison');
  }

  function handleProposalCreated(newId) {
    setSelectedProposalId(newId);
    setActiveTab('matrix');
    setRefreshTrigger((prev) => prev + 1);
  }

  function handleBackToProposals() {
    setSelectedProposalId(null);
    setActiveTab('proposals');
    setRefreshTrigger((prev) => prev + 1);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        {/* Barra de Navegación */}
        <Navbar
          activeTab={activeTab === 'matrix' ? 'proposals' : activeTab}
          setActiveTab={(tab) => {
            if (tab === 'proposals') {
              setSelectedProposalId(null);
            }
            setActiveTab(tab);
          }}
          onOpenGuide={() => setShowGuideModal(true)}
        />

        {/* Contenido Principal */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'matrix' && selectedProposalId ? (
            <EstimationMatrix
              proposalId={selectedProposalId}
              onBack={handleBackToProposals}
              onOpenComparison={handleOpenComparison}
            />
          ) : activeTab === 'proposals' ? (
            <ProposalsList
              onSelectProposal={handleSelectProposal}
              onOpenNewProposalModal={() => setShowNewProposalModal(true)}
              refreshTrigger={refreshTrigger}
            />
          ) : activeTab === 'catalog' ? (
            <CatalogView />
          ) : activeTab === 'comparison' ? (
            <ComparisonView
              targetProposalId={selectedProposalId}
              onSelectProposal={handleSelectProposal}
            />
          ) : null}
        </main>
      </div>

      {/* Pie de Página Institucional */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            <span className="font-bold text-slate-700">Dominio Estudio</span> – Prototipo de Estimación de Tareas Técnicas (OE3)
          </div>
          <div className="text-center sm:text-right">
            <span>Trabajo de Grado: Holnaver Dagua Cunda | Asesor: Elkin Rojas</span>
            <span className="block text-[11px] text-slate-400">Instituto Superior de Educación Rural (ISER) – 2026</span>
          </div>
        </div>
      </footer>

      {/* Modal para Crear Nueva Propuesta */}
      <NewProposalModal
        isOpen={showNewProposalModal}
        onClose={() => setShowNewProposalModal(false)}
        onCreated={handleProposalCreated}
      />

      {/* Modal de Guía Básica de Uso */}
      <UserGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />
    </div>
  );
}
