/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Link, useRouter } from "../router";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Search, Compass, AlertTriangle, ArrowLeft } from "lucide-react";

export const NotFound: React.FC = () => {
  const { navigate } = useRouter();
  const [searchInput, setSearchInput] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div id="not-found-page" className="w-full">
      <Breadcrumbs items={[{ label: "404 Page Not Found" }]} />

      <main className="max-w-xl mx-auto px-4 py-16 sm:py-24 text-center">
        {/* Visual Badge */}
        <div className="inline-flex items-center justify-center p-4 bg-amber-50 text-amber-600 rounded-full mb-6 shadow-inner">
          <AlertTriangle className="h-10 w-10 animate-bounce" />
        </div>

        <h1 className="font-display font-black text-4xl sm:text-5xl text-slate-900 tracking-tight mb-4">
          404 - Perdu dans les montagnes.
        </h1>
        
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed mb-10 max-w-md mx-auto">
          La page ou le dossier de préservation que vous recherchez n'existe pas, a été déplacé ou se trouve dans un volume d'archives non indexé. Laissez-nous vous guider vers le retour.
        </p>

        {/* Quick Search bar */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-8 text-left">
          <h3 className="font-display font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">
            Rechercher dans nos articles
          </h3>
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <label htmlFor="not-found-search-input" className="sr-only">Search</label>
            <input
              id="not-found-search-input"
              type="text"
              placeholder="Search watchtower, roman baths..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-20 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm text-slate-800 bg-white"
            />
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
            <button
              type="submit"
              className="absolute right-1.5 px-3.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-display font-bold text-xs rounded-lg transition-colors"
            >
              Rechercher
            </button>
          </form>
        </div>

        {/* Action controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-display font-bold text-sm rounded-xl shadow-md shadow-blue-600/10 transition-all flex items-center justify-center gap-2 focus:outline-none"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour à l'accueil</span>
          </Link>
          <Link
            to="/blog"
            className="w-full sm:w-auto px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-display font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 focus:outline-none"
          >
            <Compass className="h-4 w-4 text-slate-400" />
            <span>Exploprer nos articles</span>
          </Link>
        </div>
      </main>
    </div>
  );
};
