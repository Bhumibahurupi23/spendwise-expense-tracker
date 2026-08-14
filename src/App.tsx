import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { ToastContainer } from './components/Toast';
import { TransactionModal } from './components/TransactionModal';
import { ConfirmationModal } from './components/ConfirmationModal';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const {
    activePage,
    toasts,
    dismissToast,
    isTransactionModalOpen,
    editingTransaction,
    closeTransactionModal,
    addTransaction,
    updateTransaction,
    settings,
    confirmModalConfig,
    closeConfirmModal,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

      {/* Main Body Layout with Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar (Desktop + Mobile drawer) */}
        <Sidebar
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Backdrop overlay for mobile sidebar */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-xs lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Page Content Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {activePage === 'dashboard' && <DashboardPage />}
              {activePage === 'transactions' && <TransactionsPage />}
              {activePage === 'budgets' && <BudgetsPage />}
              {activePage === 'analytics' && <AnalyticsPage />}
              {activePage === 'settings' && <SettingsPage />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Bottom Navigation for Mobile Devices */}
      <MobileNav />

      {/* Global Transaction Modal */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        editingTransaction={editingTransaction}
        currency={settings.currency}
        onClose={closeTransactionModal}
        onSave={addTransaction}
        onUpdate={updateTransaction}
      />

      {/* Global Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!confirmModalConfig}
        title={confirmModalConfig?.title || ''}
        message={confirmModalConfig?.message || ''}
        confirmLabel={confirmModalConfig?.confirmLabel}
        isDestructive={confirmModalConfig?.isDestructive}
        onConfirm={confirmModalConfig?.onConfirm || (() => {})}
        onClose={closeConfirmModal}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
