/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Link, useRouter } from "../router";
import { getPosts, getCategories } from "../api";
import { WPPost, WPCategory } from "../types";
import { PostCard } from "../components/PostCard";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { FolderOpen, ArrowLeft, BookOpen } from "lucide-react";

export const Category: React.FC = () => {
  const { params } = useRouter();
  const slug = params.slug;

  const [category, setCategory] = useState<WPCategory | null>(null);
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const [loadedPosts, loadedCats] = await Promise.all([
          getPosts(),
          getCategories()
        ]);
        
        if (active) {
          const foundCat = loadedCats.find(c => c.slug === slug);
          if (foundCat) {
            setCategory(foundCat);
            const filtered = loadedPosts.filter(p => p.categories.includes(foundCat.id));
            setPosts(filtered);
          } else {
            setCategory(null);
            setPosts([]);
          }
        }
      } catch (err) {
        console.error("GPC65: Error fetching category archive", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchCategoryData();
    return () => { active = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="h-10 bg-slate-100 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 py-16 space-y-8">
          <div className="h-16 bg-slate-100 animate-pulse rounded-xl w-1/2" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((n) => (
              <div key={n} className="bg-slate-50 animate-pulse rounded-2xl h-80" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="w-full">
        <Breadcrumbs items={[{ label: "Aucune catégorie trouvée" }]} />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <FolderOpen className="h-16 w-16 text-rose-500 mx-auto mb-4" />
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">Aucune catégorie trouvée</h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base leading-relaxed">
            La catégorie « {slug} » n'est pas enregistrée.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/blog"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-display font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 focus:outline-none"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour au Blog</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id={`category-archive-${category.id}`} className="w-full">
      <Breadcrumbs
        items={[
          { label: "Blog", path: "/blog" },
          { label: `Catégorie: ${category.name}` }
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category Header Card */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-3xl p-8 sm:p-12 shadow-md mb-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
          </div>
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold font-display uppercase tracking-widest text-blue-200 block mb-2">
              Articles par catégories
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-4">
              {category.name}
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-2xl">
              {category.description}
            </p>
          </div>
        </div>

        {/* Posts in Category */}
        <div className="mb-6 flex items-center justify-between text-slate-400 text-xs font-semibold px-1">
          <span>{posts.length} articles dans la catégorie</span>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-3xl max-w-2xl mx-auto">
            <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-display font-bold text-lg text-slate-900 mb-2">Catégorie vide</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              Il n'y a actuellement aucun article publié dans la catégorie {category.name}.
            </p>
            <Link
              to="/blog"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-display font-bold text-sm rounded-xl transition-all shadow-md focus:outline-none"
            >
              Voir d'autres catégories
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};
