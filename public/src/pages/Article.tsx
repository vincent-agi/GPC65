/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Link, useRouter } from "../router";
import { getPosts, getPostBySlug, simplifyPost } from "../api";
import { WPPost } from "../types";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { formatDate } from "../components/PostCard";
import { Calendar, User, ArrowLeft, ArrowRight, Tag, Folder, BookOpen, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

export const Article: React.FC = () => {
  const { params, navigate } = useRouter();
  const slug = params.slug;

  const [post, setPost] = useState<WPPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [allPosts, setAllPosts] = useState<WPPost[]>([]);

  useEffect(() => {
    let active = true;
    const fetchArticle = async () => {
      setLoading(true);
      if (!slug) return;
      try {
        const [targetPost, postsList] = await Promise.all([
          getPostBySlug(slug),
          getPosts()
        ]);
        if (active) {
          setPost(targetPost);
          setAllPosts(postsList);
        }
      } catch (err) {
        console.error("GPC65: Could not fetch post", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchArticle();
    return () => { active = false; };
  }, [slug]);

  // Find adjacent posts and related posts
  const { prevPost, nextPost, relatedPosts } = React.useMemo(() => {
    if (!post || allPosts.length === 0) {
      return { prevPost: null, nextPost: null, relatedPosts: [] };
    }

    const index = allPosts.findIndex((p) => p.id === post.id);

    // sorted descending by date (newest first)
    // Next post (newer) is index - 1, Previous post (older) is index + 1
    const nextPost = index > 0 ? allPosts[index - 1] : null;
    const prevPost = index < allPosts.length - 1 && index !== -1 ? allPosts[index + 1] : null;

    // Related posts: same category or tag, excluding current post
    let related = allPosts.filter((p) => {
      if (p.id === post.id) return false;
      const sharedCat = p.categories.some((catId) => post.categories.includes(catId));
      const sharedTag = p.tags.some((tagId) => post.tags.includes(tagId));
      return sharedCat || sharedTag;
    });

    // Backfill with latest if needed to reach 3
    if (related.length < 3) {
      const ids = new Set(related.map((r) => r.id));
      const leftovers = allPosts.filter((p) => p.id !== post.id && !ids.has(p.id));
      related = [...related, ...leftovers].slice(0, 3);
    } else {
      related = related.slice(0, 3);
    }

    return { prevPost, nextPost, relatedPosts: related };
  }, [post, allPosts]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="h-10 bg-slate-100 animate-pulse" />
        <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
          <div className="h-12 bg-slate-100 animate-pulse rounded-xl w-3/4" />
          <div className="h-6 bg-slate-100 animate-pulse rounded-lg w-1/3" />
          <div className="h-[400px] bg-slate-100 animate-pulse rounded-2xl" />
          <div className="space-y-4">
            <div className="h-4 bg-slate-100 animate-pulse rounded w-full" />
            <div className="h-4 bg-slate-100 animate-pulse rounded w-full" />
            <div className="h-4 bg-slate-100 animate-pulse rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full">
        <Breadcrumbs items={[{ label: "Article Not Found" }]} />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <AlertCircle className="h-16 w-16 text-rose-500 mx-auto mb-4" />
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">Journal Entry Not Found</h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base leading-relaxed">
            Le dossier de préservation que vous recherchez n'existe pas ou a peut-être été délisté de notre registre.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/blog"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-display font-bold text-sm rounded-xl transition-all shadow-md focus:outline-none"
            >
              Retour aux archives
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-display font-bold text-sm rounded-xl transition-all focus:outline-none"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const simplified = simplifyPost(post);

  return (
    <article id={`article-page-${post.id}`} className="w-full bg-white pb-16">
      <Breadcrumbs
        items={[
          { label: "Blog", path: "/blog" },
          { label: simplified.title }
        ]}
      />

      {/* Editorial Header */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {simplified.categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold font-display hover:bg-blue-600 hover:text-white transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-slate-900 leading-tight tracking-tight mb-6">
          {simplified.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-slate-500 font-medium border-y border-slate-100 py-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-blue-700 to-blue-800 flex items-center justify-center text-white text-xs font-bold uppercase">
              {simplified.authorName.charAt(0)}
            </div>
            <span className="text-slate-800">{simplified.authorName}</span>
          </div>
          <span className="text-slate-200">|</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
            <span>Publié le : {formatDate(simplified.date)}</span>
          </div>
        </div>
      </header>

      {/* Featured Banner */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="aspect-[21/9] sm:rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm relative">
          <img
            src={simplified.featuredImageUrl}
            alt={simplified.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Body Content */}
        <div className="lg:col-span-8">
          {/* WordPress HTML Content Wrapper */}
          <div
            id="wordpress-article-content"
            className="prose prose-blue max-w-none text-slate-700 leading-relaxed space-y-6 text-[15px] sm:text-base
              prose-headings:font-display prose-headings:font-bold prose-headings:text-slate-900
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:mt-0 prose-p:mb-6
              prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ul:space-y-2
              prose-li:text-slate-600
              prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:text-slate-800 prose-blockquote:my-8
              prose-blockquote-cite:block prose-blockquote-cite:text-xs prose-blockquote-cite:text-slate-500 prose-blockquote-cite:mt-2 prose-blockquote-cite:not-italic
            "
            dangerouslySetInnerHTML={{ __html: simplified.content }}
          />

          {/* Tags list */}
          {simplified.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-100 flex items-start gap-3">
              <Tag className="h-4 w-4 text-slate-400 mt-1 shrink-0" />
              <div className="flex flex-wrap gap-2">
                {simplified.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/tag/${tag.slug}`}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors border border-slate-150"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Previous / Next Article Navigation */}
          <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevPost ? (
              <Link
                to={`/article/${prevPost.slug}`}
                className="p-4 rounded-2xl border border-slate-100 hover:border-blue-100 bg-slate-50/50 hover:bg-white text-left group transition-all flex items-start gap-3 focus:outline-none"
              >
                <ArrowLeft className="h-5 w-5 text-slate-400 group-hover:-translate-x-1 transition-transform shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold font-display uppercase tracking-wider text-slate-400 block mb-1">
                    Article précédent
                  </span>
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {prevPost.title.rendered}
                  </span>
                </div>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}

            {nextPost && (
              <Link
                to={`/article/${nextPost.slug}`}
                className="p-4 rounded-2xl border border-slate-100 hover:border-blue-100 bg-slate-50/50 hover:bg-white text-right group transition-all flex items-start justify-end gap-3 focus:outline-none"
              >
                <div className="order-1">
                  <span className="text-[10px] font-bold font-display uppercase tracking-wider text-slate-400 block mb-1">
                    Article suivant
                  </span>
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {nextPost.title.rendered}
                  </span>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0 mt-0.5 order-2" />
              </Link>
            )}
          </div>
        </div>

        {/* Right Side: Quick facts sidebar & Author detail */}
        <div className="lg:col-span-4 space-y-8">
          {/* Author mini profile card */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-700 to-blue-800 flex items-center justify-center text-white text-sm font-extrabold shadow-sm">
                {simplified.authorName.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-tight">{simplified.authorName}</h4>
              </div>
            </div>
          </div>

          {/* Quick facts list */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-3 mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span>Détails</span>
            </h3>
            <dl className="space-y-3.5 text-xs">
              <div>
                <dt className="text-slate-400 font-semibold mb-1">TAXONOMY</dt>
                <dd className="text-slate-800 font-bold">
                  {simplified.categories.map(c => c.name).join(", ")}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Bottom Segment: Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-slate-50 border-t border-slate-100 mt-16 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-bold text-2xl text-slate-900 mb-8 tracking-tight">
              Études connexes et dossiers de préservation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => {
                const simp = simplifyPost(relatedPost);
                return (
                  <motion.article
                    key={relatedPost.id}
                    className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group"
                  >
                    <Link to={`/article/${simp.slug}`} className="block relative aspect-video overflow-hidden bg-slate-100">
                      <img
                        src={simp.featuredImageUrl}
                        alt={simp.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300"
                      />
                    </Link>
                    <div className="p-5 flex flex-col flex-grow">
                      <span className="text-[10px] font-bold font-display text-blue-600 uppercase tracking-widest mb-2 block">
                        {simp.categories[0]?.name}
                      </span>
                      <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug mb-3">
                        <Link to={`/article/${simp.slug}`}>
                          {simp.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2 mt-auto">
                        {simp.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-3 border-t border-slate-100">
                        <span>{formatDate(simp.date)}</span>
                        <Link to={`/article/${simp.slug}`} className="text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
                          <span>Read</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </article>
  );
};
