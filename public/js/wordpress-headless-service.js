/**
 * @file wordpress-headless-service.js
 * @description Service pour WordPress Headless (WPGraphQL v1.6+)
 * @version 5.0.0 - CORRIGÉ POUR TON ENDPOINT
 */

// ======================
// CONFIGURATION
// ======================
const DEFAULT_CONFIG = {
  endpoint: 'https://www.gpc65-gestion.cazu1740.odns.fr/graphql', // ✅ TON ENDPOINT EXACT
  apiKey: '',
  cacheTTL: 300,
  useLocalStorage: true,
};

// ======================
// CLASSE PRINCIPALE
// ======================
class WordPressHeadlessService {
  constructor(config = DEFAULT_CONFIG) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.cache = new Map();
  }

  // ======================
  // GESTION DU CACHE
  // ======================
  _getCacheKey(query, variables) {
    return JSON.stringify({ query, variables });
  }

  _getFromCache(key) {
    if (!this.config.useLocalStorage) return this.cache.get(key);
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      const { data, expiry } = JSON.parse(item);
      return expiry > Date.now() ? data : null;
    } catch { return null; }
  }

  _setToCache(key, data) {
    if (!this.config.useLocalStorage) {
      this.cache.set(key, data);
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        expiry: Date.now() + this.config.cacheTTL * 1000
      }));
    } catch {}
  }

  // ======================
  // REQUÊTE GRAPHQL (CORRIGÉE)
  // ======================
  async _fetchGraphQL(query, variables = {}) {
    const cacheKey = this._getCacheKey(query, variables);
    const cached = this._getFromCache(cacheKey);
    if (cached) return cached;

    const headers = {
      'Content-Type': 'application/json',
      ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
    };

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();
      if (result.errors) {
        console.error('GraphQL Errors:', result.errors);
        throw new Error(result.errors.map(e => e.message).join('\n'));
      }

      this._setToCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('GraphQL Error:', error.message);
      throw error;
    }
  }

  // ======================
  // REQUÊTE CORRIGÉE (SANS ERREURS)
  // ======================
  _getArticlesQuery = `
    query GetArticles(
      $first: Int
      $after: String
      $where: RootQueryToPostConnectionWhereArgs
    ) {
      posts(
        first: $first
        after: $after
        where: $where
      ) {
        nodes {
          id
          title
          excerpt
          content
          date
          uri
          slug
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              id
              name
              slug
            }
          }
          tags {
            nodes {
              id
              name
              slug
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
      # Requête séparée pour le total
      postsCount: posts(where: $where) {
        nodes {
          id
        }
      }
    }
  `;

  _getArticleQuery = `
    query GetArticle($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        id
        title
        excerpt
        content
        date
        uri
        slug
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            id
            name
            slug
          }
        }
        tags {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
  `;

  // ======================
  // MÉTHODES PUBLIQUES
  // ======================
  /**
   * Récupère un article
   * @param {string} id - ID ou slug
   * @param {'DATABASE_ID'|'SLUG'} [idType='DATABASE_ID']
   * @returns {Promise<Object>}
   */
  async getArticle(id, idType = 'DATABASE_ID') {
    const result = await this._fetchGraphQL(this._getArticleQuery, { id, idType });
    if (!result.data.post) throw new Error(`Article ${id} introuvable`);
    return result.data.post;
  }

  /**
   * Récupère une liste d'articles paginés
   * @param {Object} options
   * @param {number} [options.perPage=6] - Articles par page
   * @param {number} [options.page=1] - Numéro de page
   * @param {string} [options.categorySlug] - Filtre par catégorie
   * @param {string} [options.tagSlug] - Filtre par tag
   * @returns {Promise<{articles: Array, pagination: Object}>}
   */
  async getArticles(options = {}) {
    const {
      perPage = 6,
      page = 1,
      categorySlug,
      tagSlug,
    } = options;

    const where = {};
    if (categorySlug) where.categoryName = categorySlug;
    if (tagSlug) where.tagSlug = tagSlug;

    const variables = {
      first: perPage,
      after: page > 1 ? String((page - 1) * perPage) : null,
      where,
    };

    const result = await this._fetchGraphQL(this._getArticlesQuery, variables);

    if (!result.data.posts) {
      throw new Error('Aucun article trouvé');
    }

    const articles = result.data.posts.nodes;
    const total = result.data.postsCount.nodes.length;
    const pages = Math.ceil(total / perPage);

    return {
      articles,
      pagination: {
        total,
        pages,
        currentPage: page,
        hasNextPage: result.data.posts.pageInfo.hasNextPage,
        hasPreviousPage: result.data.posts.pageInfo.hasPreviousPage,
        startCursor: result.data.posts.pageInfo.startCursor,
        endCursor: result.data.posts.pageInfo.endCursor,
      },
    };
  }
}

// ======================
// EXPORT POUR UTILISATION
// ======================
window.WordPressHeadlessService = WordPressHeadlessService;
