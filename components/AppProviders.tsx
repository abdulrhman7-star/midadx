'use client';

import React, { createContext, useContext, useState } from 'react';
import nextDynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { LanguageProvider, useLanguage } from '@/components/LanguageContext';
import { CookieConsentBanner } from '@/components/CookieConsentBanner';
import {
  useSession,
  useSavedDocsList,
  convertGuestToFullAccount,
  deleteDocument,
} from '@/lib/guest-session';
import { SavedDocument } from '@/types';

const AuthModal = nextDynamic(
  () => import('@/components/AuthModals').then(m => m.AuthModal),
  { ssr: false }
);

const SavedDocumentsDrawer = nextDynamic(
  () => import('@/components/SavedDocumentsDrawer').then(m => m.SavedDocumentsDrawer),
  { ssr: false }
);

interface GlobalUIContextValue {
  openSavedDocs: () => void;
  openAuthModal: () => void;
}

const GlobalUIContext = createContext<GlobalUIContextValue | null>(null);

export function useGlobalUI() {
  return useContext(GlobalUIContext);
}

function GlobalShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { t } = useLanguage();
  const session = useSession();
  const savedDocs = useSavedDocsList();
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSelectDoc = (doc: SavedDocument) => {
    try {
      localStorage.setItem(
        'midaddExternalTemplate',
        JSON.stringify({ markdown: doc.markdown, title: doc.title })
      );
      window.dispatchEvent(new Event('midaddTemplateSelected'));
    } catch {
      // Ignore storage errors
    }
    setIsSavedDrawerOpen(false);
    router.push('/');
  };

  const handleDeleteDoc = async (id: string) => {
    if (typeof window !== 'undefined' && window.confirm(t.deleteConfirm)) {
      const { deleteUserDocument } = await import('@/lib/firebase');
      await deleteUserDocument(id, session.id);
      deleteDocument(id);
    }
  };

  const handleExportDocx = async (md: string, title: string) => {
    const { exportToDocx } = await import('@/lib/docx-export');
    await exportToDocx(md, `${title}.docx`);
  };

  const handleNewDoc = () => {
    try {
      localStorage.setItem(
        'midaddExternalTemplate',
        JSON.stringify({ markdown: '', title: 'Untitled Document' })
      );
      window.dispatchEvent(new Event('midaddTemplateSelected'));
    } catch {
      // Ignore storage errors
    }
    setIsSavedDrawerOpen(false);
    router.push('/');
  };

  return (
    <GlobalUIContext.Provider
      value={{
        openSavedDocs: () => setIsSavedDrawerOpen(true),
        openAuthModal: () => setIsAuthModalOpen(true),
      }}
    >
      {children}
      <CookieConsentBanner />
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onRegister={(email, name) => convertGuestToFullAccount(email, name)}
        />
      )}
      {isSavedDrawerOpen && (
        <SavedDocumentsDrawer
          isOpen={isSavedDrawerOpen}
          onClose={() => setIsSavedDrawerOpen(false)}
          documents={savedDocs}
          onSelectDoc={handleSelectDoc}
          onDeleteDoc={handleDeleteDoc}
          onExportDocx={handleExportDocx}
          onNewDoc={handleNewDoc}
        />
      )}
    </GlobalUIContext.Provider>
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <GlobalShell>{children}</GlobalShell>
    </LanguageProvider>
  );
}
