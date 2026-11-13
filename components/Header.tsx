'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageContext';
import { GuestSession } from '@/types';
import { useGlobalUI } from './AppProviders';
import {
  BookOpen,
  Coins,
  Globe,
  FolderOpen,
  User,
  LogOut,
  Moon,
  Sun,
  ShieldCheck,
  Menu,
  X,
  Layers,
  Tag,
  MessageSquare,
  Home,
  ChevronRight,
  ChevronDown,
  Check,
} from 'lucide-react';

interface HeaderProps {
  session: GuestSession;
  savedDocsCount: number;
  onOpenSavedDocs?: () => void;
  onOpenAuthModal?: () => void;
  onLogout: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  session,
  savedDocsCount,
  onOpenSavedDocs,
  onOpenAuthModal,
  onLogout,
  isDark,
  onToggleTheme,
}) => {
  const { language, setLanguage, currentLanguageInfo, availableLanguages, t } = useLanguage();
  const globalUI = useGlobalUI();
  const pathname = usePathname() || '/';
  const isAr = language === 'ar';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const handleOpenSavedDocs = onOpenSavedDocs ?? globalUI?.openSavedDocs ?? (() => {});
  const handleOpenAuthModal = onOpenAuthModal ?? globalUI?.openAuthModal ?? (() => {});

  // Close language dropdown menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/', label: isAr ? 'الرئيسية' : 'Home', icon: Home },
    { href: '/templates', label: isAr ? 'القوالب' : 'Templates', icon: Layers, badge: '22' },
    { href: '/guides', label: isAr ? 'الأدلة' : 'Guides', icon: BookOpen },
    { href: '/pricing', label: isAr ? 'الأسعار' : 'Pricing', icon: Tag },
    { href: '/contact', label: isAr ? 'تواصل' : 'Contact', icon: MessageSquare },
  ];

  return (
    <header className="no-print sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo & Name */}
        <div className="flex items-center shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
              <span className="text-lg">✒️</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                  {isAr ? 'مداد' : 'midadd'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold uppercase tracking-wider">
                  AI Docs
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden 2xl:block leading-tight">
                {isAr ? 'محوّل Markdown لمستندات Word & PDF' : 'AI Markdown to Word & PDF'}
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 min-w-0" aria-label="Main Navigation">
          {navLinks.map(item => {
            const isActive =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 px-2 lg:px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/80'
                    : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                <IconComponent className="h-3.5 w-3.5 shrink-0" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                    ({item.badge})
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Mobile Navigation Trigger */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Credits Counter Pill */}
          <Link
            href="/pricing"
            className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-[11px] sm:text-xs font-semibold hover:border-amber-400 transition shrink-0 whitespace-nowrap"
            title="Export Credits - 1 credit per export. Click to top up."
          >
            <Coins className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="font-bold">{session.credits}</span>
            <span className="text-slate-400 text-[10px] hidden xl:inline">/ {session.maxCredits}</span>
          </Link>

          {/* Saved Documents Button (Visible on tablet & desktop) */}
          <button
            type="button"
            onClick={handleOpenSavedDocs}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium whitespace-nowrap shrink-0 transition cursor-pointer"
            title={t.savedDocsTitle}
            aria-label={t.savedDocsTitle}
          >
            <FolderOpen className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <span className="hidden xl:inline">{isAr ? 'مستنداتي' : 'Saved'}</span>
            {savedDocsCount > 0 && (
              <span className="h-4.5 w-4.5 flex items-center justify-center rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-bold">
                {savedDocsCount}
              </span>
            )}
          </button>

          {/* Multi-Language Translation Dropdown (Visible on tablet & desktop) */}
          <div className="relative hidden sm:block" ref={langMenuRef}>
            <button
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition cursor-pointer whitespace-nowrap"
              title="Select Language & Auto-Translate / اختر لغة الترجمة"
              aria-expanded={langMenuOpen}
              aria-label="Language translation dropdown"
            >
              <Globe className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="text-sm leading-none">{currentLanguageInfo?.flag || '🌐'}</span>
              <span className="hidden lg:inline font-bold">{currentLanguageInfo?.nativeName || 'Language'}</span>
              <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-1.5 w-52 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 animate-fadeIn">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
                  <span>{isAr ? 'لغة الموقع والترجمة' : 'Site Translation'}</span>
                  <span className="text-[9px] text-indigo-500 font-mono">Auto-Translate</span>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-0.5">
                  {availableLanguages.map(item => {
                    const isSelected = language === item.code;
                    return (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          setLanguage(item.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-start flex items-center justify-between px-3 py-2 text-xs font-medium hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition cursor-pointer ${
                          isSelected
                            ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/70 dark:bg-indigo-950/40'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{item.flag}</span>
                          <div className="flex flex-col">
                            <span className="leading-tight">{item.nativeName}</span>
                            <span className="text-[10px] text-slate-400">{item.name}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle (Visible on tablet & desktop) */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="hidden sm:flex p-1.5 sm:p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition cursor-pointer"
            title={isDark ? 'Light Mode' : 'Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>

          {/* User Account / Upgrade (Visible on tablet & desktop) */}
          {session.isGuest ? (
            <div className="hidden sm:flex items-center gap-1.5">
              <Link
                href="/login"
                className="hidden lg:inline-flex items-center px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold whitespace-nowrap transition"
              >
                <span>{isAr ? 'دخول' : 'Sign In'}</span>
              </Link>
              <button
                type="button"
                onClick={handleOpenAuthModal}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold whitespace-nowrap shrink-0 transition shadow-sm cursor-pointer"
              >
                <User className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden xl:inline">{t.convertAccount}</span>
                <span className="xl:hidden">{isAr ? 'حساب' : 'Sign Up'}</span>
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center space-x-2 rtl:space-x-reverse">
              <Link
                href="/profile"
                className="flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 text-xs rounded-full font-semibold hover:border-green-400 transition"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-green-600 shrink-0" />
                <span className="max-w-[100px] truncate">{session.name || session.email}</span>
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded-md transition cursor-pointer"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Mobile Hamburger Button (Visible on mobile screens < md) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition cursor-pointer active:scale-95 touch-target flex items-center justify-center"
            aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة الرئيسية'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer & Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md px-4 py-4 space-y-3 shadow-xl animate-fadeIn">
          {/* Mobile Navigation Links */}
          <div className="space-y-1">
            {navLinks.map(item => {
              const isActive =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComponent className="h-4 w-4 text-indigo-500" />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 text-slate-400 rtl:rotate-180" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Mobile Theme & Language Selection */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {isAr ? 'لغة الموقع والترجمة' : 'Site Language & Auto-Translation'}
              </span>
              <button
                type="button"
                onClick={onToggleTheme}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                {isDark ? (
                  <>
                    <Sun className="h-3.5 w-3.5 text-amber-400" />
                    <span>{isAr ? 'نهاري' : 'Light'}</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-3.5 w-3.5 text-slate-600" />
                    <span>{isAr ? 'ليلي' : 'Dark'}</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {availableLanguages.map(item => {
                const isSelected = language === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setLanguage(item.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between p-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span>{item.flag}</span>
                      <span className="truncate">{item.nativeName}</span>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Saved Documents button on mobile */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              handleOpenSavedDocs();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-red-500" />
              <span>{t.savedDocsTitle}</span>
            </div>
            {savedDocsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold">
                {savedDocsCount}
              </span>
            )}
          </button>

          {/* Mobile Auth / Account Section */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            {session.isGuest ? (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleOpenAuthModal();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  <span>{t.loginSignup}</span>
                </button>
                <div className="flex items-center justify-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold"
                  >
                    {isAr ? 'تسجيل الدخول' : 'Sign In'}
                  </Link>
                  <span>•</span>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold"
                  >
                    {isAr ? 'إنشاء حساب جديد' : 'Sign Up'}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/40 rounded-xl border border-green-200 dark:border-green-800">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-xs font-bold text-green-800 dark:text-green-300"
                >
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span>{session.name || session.email}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="text-xs text-red-600 dark:text-red-400 font-bold p-1 hover:underline"
                >
                  {isAr ? 'خروج' : 'Logout'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
