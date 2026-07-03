/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WPTitle {
  rendered: string;
}

export interface WPContent {
  rendered: string;
  protected?: boolean;
}

export interface WPExcerpt {
  rendered: string;
  protected?: boolean;
}

export interface WPCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
}

export interface WPTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface WPMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: WPTitle;
  source_url: string;
  alt_text?: string;
}

export interface WPAuthor {
  id: number;
  name: string;
  url?: string;
  description?: string;
  slug?: string;
}

export interface WPPost {
  id: number;
  date: string;
  date_gmt?: string;
  guid?: { rendered: string };
  modified?: string;
  slug: string;
  status?: string;
  type?: string;
  link?: string;
  title: WPTitle;
  content: WPContent;
  excerpt: WPExcerpt;
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  
  // Embedded properties returned when using `_embed=true`
  _embedded?: {
    author?: Array<WPAuthor>;
    'wp:featuredmedia'?: Array<{
      id?: number;
      source_url: string;
      alt_text?: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
      taxonomy: string;
    }>>;
  };
}

export interface SimplifiedPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  authorName: string;
  featuredImageUrl: string;
  categories: { id: number; name: string; slug: string }[];
  tags: { id: number; name: string; slug: string }[];
}
