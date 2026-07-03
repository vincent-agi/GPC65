/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { WPPost } from "../types";
import { simplifyPost } from "../api";
import { Link } from "../router";
import { Calendar, User, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface PostCardProps {
  post: WPPost;
}

export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  } catch (e) {
    return dateString;
  }
};

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const simplified = simplifyPost(post);

  return (
    <motion.article
      id={`post-card-${post.id}`}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-100 transition-all flex flex-col h-full group"
    >
      {/* Aspect ratio box for image */}
      <Link to={`/article/${simplified.slug}`} className="block overflow-hidden relative aspect-video bg-slate-100">
        <img
          src={simplified.featuredImageUrl}
          alt={simplified.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow">
        {/* Badges/Category */}
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {simplified.categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="px-2.5 py-0.5 rounded-full text-xs font-bold font-display bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors duration-200"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 leading-snug mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
          <Link to={`/article/${simplified.slug}`} className="focus:outline-none">
            {simplified.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-slate-500 leading-relaxed mb-5 line-clamp-3">
          {simplified.excerpt}
        </p>

        {/* Spacer to push metadata to the bottom */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-300 shrink-0" />
              <span>{formatDate(simplified.date)}</span>
            </span>
            <span className="text-slate-200">|</span>
            <span className="flex items-center gap-1 max-w-[100px] truncate">
              <User className="h-3.5 w-3.5 text-slate-300 shrink-0" />
              <span className="truncate">{simplified.authorName}</span>
            </span>
          </div>

          <Link
            to={`/article/${simplified.slug}`}
            className="flex items-center gap-1 font-display font-bold text-blue-600 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all text-xs"
          >
            <span>Lire</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};
