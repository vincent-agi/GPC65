/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Link, useRouter } from "../router";
import { getPosts, getTags } from "../api";
import { WPPost, WPTag } from "../types";
import { PostCard } from "../components/PostCard";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Tag as TagIcon, ArrowLeft, BookOpen } from "lucide-react";

export const Tag: React.FC = () => {
  const { params } = useRouter();
  const slug = params.slug;

  const [tag, setTag] = useState<WPTag | null>(null);
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchTagData = async () => {
      setLoading(true);
      try {
        const [loadedPosts, loadedTags] = await Promise.all([
          getPosts(),
          getTags()
        ]);
        
        if (active) {
          const foundTag = loadedTags.find(t => t.slug === slug);
          if (foundTag) {
            setTag(foundTag);
            const filtered = loadedPosts.filter(p => p.tags.includes(foundTag.id));
            setPosts(filtered);
          } else {
            setTag(null);
            setPosts([]);
          }
        }
      } catch (err) {
        console.error("GPC65: Error fetching tag archive", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchTagData();
    return () => { active = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="h-10 bg-slate-100 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 py-16 space-y-8">
          <div className="h-16 bg-slate-100 animate-pulse rounded-xl w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((n) => (
              <div key={n} className="bg-slate-50 animate-pulse rounded-2xl h-80" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!tag) {
    return (
      <div className="w-full">
        <Breadcrumbs items={[{ label: "Aucune étiquette trouvée" }]} />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <TagIcon className="h-16 w-16 text-rose-500 mx-auto mb-4" />
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">Aucune étiquette trouvée</h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base leading-relaxed">
            Aucune étiquette avec le terme « {slug} ».
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/blog"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-display font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 focus:outline-none"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour au blog</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id={`tag-archive-${tag.id}`} className="w-full">
      <Breadcrumbs
        items={[
          { label: "Blog", path: "/blog" },
          { label: `Etiquettes: #${tag.name}` }
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tag Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center p-3.5 bg-blue-50 text-blue-700 rounded-full mb-4 shadow-inner">
            <TagIcon className="h-6 w-6" />
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight mb-2">
            Etiqueté avec « {tag.name} »
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            {tag.description}
          </p>
        </div>

        {/* Tag Meta */}
        <div className="mb-6 flex items-center justify-between text-slate-400 text-xs font-semibold px-1">
          <span>{posts.length} articles trouvés avec l'étiquette {tag.name}</span>
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
            <h3 className="font-display font-bold text-lg text-slate-900 mb-2">Etiquette vide</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              Il n'y a actuellement aucun article publié associé à l'étiquette « {tag.name} ».
            </p>
            <Link
              to="/blog"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-display font-bold text-sm rounded-xl transition-all shadow-md focus:outline-none"
            >
              Retour blog
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};
