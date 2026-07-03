/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Link, useRouter } from "../router";
import { getPosts } from "../api";
import { WPPost } from "../types";
import { PostCard } from "../components/PostCard";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Search as SearchIcon, Compass, AlertCircle, FileText } from "lucide-react";

export const Search: React.FC = () => {
  const { searchParams, navigate } = useRouter();
  const query = searchParams.get("query") || "";

  const [posts, setPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    let active = true;
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const loadedPosts = await getPosts();
        if (active) {
          setPosts(loadedPosts);
        }
      } catch (err) {
        console.error("GPC65: Error loading search index", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchPosts();
    return () => { active = false; };
  }, []);

  const searchResults = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return posts.filter(
      (post) =>
        post.title.rendered.toLowerCase().includes(q) ||
        post.content.rendered.toLowerCase().includes(q)
    );
  }, [posts, query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div id="search-results-page" className="w-full">
      <Breadcrumbs
        items={[
          { label: "Recherche d'articles" }
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search header & inline search input */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight mb-6">
            Rechercher
          </h1>
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <label htmlFor="search-page-input" className="sr-only">Search</label>
            <input
              id="search-page-input"
              type="text"
              placeholder="Search journals, excavations, landmarks..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-12 pr-24 py-3 sm:py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-sm text-sm sm:text-base text-slate-800"
            />
            <SearchIcon className="absolute left-4 h-5 w-5 text-slate-400" />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-display font-bold text-xs sm:text-sm shadow-md shadow-blue-600/10 transition-colors"
            >
              Rechercher
            </button>
          </form>
        </div>

        {/* Results Metadata */}
        {query.trim() && (
          <div className="border-b border-slate-100 pb-4 mb-8 flex items-center justify-between text-xs sm:text-sm text-slate-400 font-semibold px-1">
            <span>
              Résultat pour: &ldquo;<strong className="text-slate-800 font-bold">{query}</strong>&rdquo;
            </span>
            <span>{searchResults.length} correspondants</span>
          </div>
        )}

        {/* Content Listing */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((n) => (
              <div key={n} className="bg-slate-50 animate-pulse rounded-2xl h-80" />
            ))}
          </div>
        ) : !query.trim() ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-100 max-w-2xl mx-auto">
            <Compass className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-display font-bold text-lg text-slate-900 mb-2">Explorer</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Saisissez des mots-clés ci-dessus comme « tour de guet », « fouilles » ou « pierre » pour parcourir les documents et rapports de recherche correspondants dans notre base de données d'archives.
            </p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {searchResults.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-3xl max-w-2xl mx-auto">
            <AlertCircle className="h-12 w-12 text-rose-400 mx-auto mb-4" />
            <h3 className="font-display font-bold text-lg text-slate-900 mb-2">Aucun résultat trouvé</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              Nous n'avons trouvé aucun article dont le titre ou le contenu correspond à « {query} ». Vérifiez l'orthographe ou essayez des termes.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/blog"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-display font-bold text-xs rounded-xl transition-all shadow-md focus:outline-none"
              >
                Parcourir tous les articles
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
