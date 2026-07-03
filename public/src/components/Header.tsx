/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Link, useRouter } from "../router";
import { Search, Menu, X, Landmark, Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Header: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPath]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchExpanded(false);
    }
  };

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "A propos", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isLinkActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  return (
    <header
      id="site-header"
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 text-slate-900 shadow-md backdrop-blur-md border-b border-slate-100"
          : "bg-white text-slate-800 border-b border-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="GPC65 Home"
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-700 to-blue-800 text-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <Landmark className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-none block">
                GPC65
              </span>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 leading-none mt-1 block">
                Guêt Patrimoine Caducéen
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-lg font-display text-sm font-semibold transition-colors duration-200 focus:outline-none ${
                    active
                      ? "text-blue-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>{link.name}</span>
                  {active && (
                    <motion.span
                      layoutId="nav-active-indicator"
                      className="absolute bottom-1 left-4 right-4 h-0.5 bg-blue-600 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Utility / Search bar */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search toggler desktop */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {searchExpanded && (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0, ease: "easeInOut" }}
                    onSubmit={handleSearchSubmit}
                    className="absolute right-0 flex items-center"
                  >
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm font-medium px-4 py-1.5 pr-10 rounded-full border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="absolute right-3 text-slate-400 hover:text-blue-700"
                      aria-label="Submit Search"
                    >
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {!searchExpanded && (
                <button
                  onClick={() => setSearchExpanded(true)}
                  className="p-2 text-slate-500 hover:text-blue-700 hover:bg-slate-50 rounded-full transition-colors focus:outline-none"
                  aria-label="Expand Search"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}

              {searchExpanded && (
                <button
                  onClick={() => {
                    setSearchExpanded(false);
                    setSearchQuery("");
                  }}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-50 rounded-full transition-colors focus:outline-none z-10"
                  aria-label="Close Search"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 shadow-inner overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => {
                const active = isLinkActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-4 py-3 rounded-xl font-display font-bold text-base transition-colors ${
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              
              {/* Simple Mobile search input directly visible */}
              <form onSubmit={handleSearchSubmit} className="pt-4 border-t border-slate-100 flex items-center relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 text-sm px-4 py-2.5 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
                />
                <button
                  type="submit"
                  className="absolute right-3 p-1.5 text-slate-400 hover:text-blue-700"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
