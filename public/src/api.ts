/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WPPost, WPCategory, WPTag, SimplifiedPost } from "./types";

const WP_API_BASE = "https://www.gpc65.serenypets.fr/wp-json/wp/v2";

// Helper to simplify WPPost to SimplifiedPost
export function simplifyPost(post: WPPost): SimplifiedPost {
  const authorName = post._embedded?.author?.[0]?.name || "GPC65 Contributor";
  const featuredImageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                           "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"; // Default Pyrenees landscape

  const categories = post._embedded?.['wp:term']?.[0]?.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug
  })) || [];

  const tags = post._embedded?.['wp:term']?.[1]?.map(tag => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug
  })) || [];

  return {
    id: post.id,
    slug: post.slug,
    title: post.title.rendered,
    content: post.content.rendered,
    excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160) + "...",
    date: post.date,
    authorName,
    featuredImageUrl,
    categories,
    tags
  };
}

// In-memory cache
const cache = {
  posts: null as WPPost[] | null,
  categories: null as WPCategory[] | null,
  tags: null as WPTag[] | null,
  lastFetched: 0
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function getPosts(forceRefresh = false): Promise<WPPost[]> {
  const now = Date.now();
  if (!forceRefresh && cache.posts && (now - cache.lastFetched < CACHE_DURATION)) {
    return cache.posts;
  }

  try {
    const res = await fetchWithTimeout(`${WP_API_BASE}/posts?_embed=true&per_page=50`, {}, 4000);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      cache.posts = data;
      cache.lastFetched = now;
      return data;
    }
    throw new Error("Empty posts array from API");
  } catch (err) {
    console.warn("GPC65: Falling back to seed historical database for posts due to connection error:", err);
    return [];
  }
}

export async function getCategories(forceRefresh = false): Promise<WPCategory[]> {
  const now = Date.now();
  if (!forceRefresh && cache.categories) return cache.categories;

  try {
    const res = await fetchWithTimeout(`${WP_API_BASE}/categories?per_page=50`, {}, 4000);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      cache.categories = data;
      return data;
    }
    throw new Error("Empty categories array from API");
  } catch (err) {
    console.warn("GPC65: Falling back to seed categories:", err);
    return [];
  }
}

export async function getTags(forceRefresh = false): Promise<WPTag[]> {
  const now = Date.now();
  if (!forceRefresh && cache.tags) return cache.tags;

  try {
    const res = await fetchWithTimeout(`${WP_API_BASE}/tags?per_page=100`, {}, 4000);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      cache.tags = data;
      return data;
    }
    throw new Error("Empty tags array from API");
  } catch (err) {
    console.warn("GPC65: Falling back to seed tags:", err);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const posts = await getPosts();
  const found = posts.find(p => p.slug === slug);
  if (found) return found;

  // Try API specifically for slug
  try {
    const res = await fetchWithTimeout(`${WP_API_BASE}/posts?_embed=true&slug=${encodeURIComponent(slug)}`, {}, 3000);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data[0];
      }
    }
  } catch (err) {
    console.error(`GPC65: Could not fetch post by slug '${slug}' from API:`, err);
  }

  return null;
}
