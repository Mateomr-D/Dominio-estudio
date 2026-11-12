import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      <div>
        {/* Barra de Encabezado Oficial Dominio Estudio (Fondo Morado Oscuro) */}
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

        {/* Contenido Principal de la Aplicación */}
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

      {/* Pie de Página Oficial Dominio Estudio (Franja Verde + Fondo Oscuro con Contacto y Redes) */}
      <Footer />

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
