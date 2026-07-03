/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { Link, useRouter } from "../router";
import { getPosts, getCategories, getTags } from "../api";
import { WPPost, WPCategory, WPTag } from "../types";
import { PostCard } from "../components/PostCard";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUpDown, X, FolderOpen, Calendar } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export const Blog: React.FC = () => {
  const { params, navigate } = useRouter();
  const pageParam = parseInt(params.page || "1", 10);
  const currentPage = isNaN(pageParam) ? 1 : pageParam;

  const [posts, setPosts] = useState<WPPost[]>([]);
  const [categories, setCategories] = useState<WPCategory[]>([]);
  const [tags, setTags] = useState<WPTag[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [selectedTag, setSelectedTag] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  // Load Posts, Categories, and Tags
  useEffect(() => {
    let active = true;
    const loadAllData = async () => {
      try {
        const [loadedPosts, loadedCats, loadedTags] = await Promise.all([
          getPosts(),
          getCategories(),
          getTags()
        ]);
        if (active) {
          setPosts(loadedPosts);
          setCategories(loadedCats);
          setTags(loadedTags);
        }
      } catch (err) {
        console.error("GPC65: Error loading blog dependencies", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadAllData();
    return () => { active = false; };
  }, []);

  // Real-time search query debouncing (300ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Filter and Sort logic
  const filteredAndSortedPosts = useMemo(() => {
    let result = [...posts];

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(post => post.categories.includes(selectedCategory));
    }

    // Filter by tag
    if (selectedTag !== "all") {
      result = result.filter(post => post.tags.includes(selectedTag));
    }

    // Filter by debounced search query (title or content)
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase().trim();
      result = result.filter(post => 
        post.title.rendered.toLowerCase().includes(q) ||
        post.content.rendered.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return result;
  }, [posts, selectedCategory, selectedTag, debouncedQuery, sortBy]);

  // Reset page when filters change
  useEffect(() => {
    if (currentPage > 1) {
      navigate("/blog", { replace: true });
    }
  }, [selectedCategory, selectedTag, debouncedQuery, sortBy]);

  // Pagination bounds
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedPosts.length / ITEMS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);

  const paginatedPosts = useMemo(() => {
    const start = (activePage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedPosts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedPosts, activePage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      if (newPage === 1) {
        navigate("/blog");
      } else {
        navigate(`/blog/page/${newPage}`);
      }
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    setSelectedCategory("all");
    setSelectedTag("all");
    setSortBy("newest");
  };

  return (
    <div id="blog-archive-page" className="w-full">
      <Breadcrumbs items={[{ label: "Blog" }]} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters Panel */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm mb-10">
          <div className="flex items-center gap-2 pb-4 mb-5 border-b border-slate-100 text-slate-700 font-display font-bold text-sm">
            <SlidersHorizontal className="h-4 w-4 text-blue-600" />
            <span>Recherche et filtres</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Real-time search bar */}
            <div className="relative">
              <label htmlFor="blog-search-input" className="sr-only">Recherche</label>
              <input
                id="blog-search-input"
                type="text"
                placeholder="Rechercher ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-800"
              />
              <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
            </div>

            {/* Category dropdown filter */}
            <div>
              <label htmlFor="category-filter" className="sr-only">Catégorie</label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value === "all" ? "all" : Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-700 bg-white"
              >
                <option value="all">Toutes catégories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Tag dropdown filter */}
            <div>
              <label htmlFor="tag-filter" className="sr-only">Tag</label>
              <select
                id="tag-filter"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value === "all" ? "all" : Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-700 bg-white"
              >
                <option value="all">Toutes les étiquettes</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort order */}
            <div className="flex gap-2">
              <div className="relative w-full">
                <label htmlFor="sort-order" className="sr-only">Tri</label>
                <select
                  id="sort-order"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-700 bg-white appearance-none"
                >
                  <option value="newest">Plus récents</option>
                  <option value="oldest">Plus anciens</option>
                </select>
                <ArrowUpDown className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
              </div>

              {(selectedCategory !== "all" || selectedTag !== "all" || searchQuery.trim() !== "" || sortBy !== "newest") && (
                <button
                  onClick={handleClearFilters}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                  title="Clear all filters"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick info about matches */}
          {!loading && (
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400 font-medium px-1">
              <span>{filteredAndSortedPosts.length} articles correspondants</span>
              {debouncedQuery.trim() && (
                <span>Recherche: &ldquo;{debouncedQuery}&rdquo;</span>
              )}
            </div>
          )}
        </div>

        {/* Content Listing */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-slate-50 animate-pulse rounded-2xl h-80 border border-slate-100" />
            ))}
          </div>
        ) : paginatedPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {paginatedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination UI */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-6">
                <button
                  onClick={() => handlePageChange(activePage - 1)}
                  disabled={activePage === 1}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-1.5 focus:outline-none"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Précedent</span>
                </button>

                <div className="hidden sm:flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`h-10 w-10 rounded-xl text-sm font-bold font-display transition-all ${
                        p === activePage
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                          : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <div className="sm:hidden text-sm text-slate-500 font-medium">
                  Page <strong className="text-slate-800">{activePage}</strong> sur <strong className="text-slate-800">{totalPages}</strong>
                </div>

                <button
                  onClick={() => handlePageChange(activePage + 1)}
                  disabled={activePage === totalPages}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-1.5 focus:outline-none"
                >
                  <span>Suivant</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-3xl max-w-2xl mx-auto">
            <FolderOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-display font-bold text-lg text-slate-900 mb-2">Aucun article</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              Nous n'avons trouvé aucun journal de préservation correspondant à votre combinaison de catégorie, d'étiquette ou de terme de recherche.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-display font-bold text-sm rounded-xl transition-all shadow-md focus:outline-none"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
