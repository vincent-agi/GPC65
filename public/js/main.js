/**
 * @file main.js
 * @description Script principal pour l'intégration WordPress Headless
 * @version 1.0.0
 * 
 * Ce fichier orchestre toutes les fonctionnalités dynamiques du site :
 * - Chargement des articles depuis l'API WordPress
 * - Chargement des catégories et tags
 * - Gestion du contenu des pages
 * - Navigation et interactivité
 */

// =============================================
// CONFIGURATION
// =============================================
const CONFIG = {
  // REMPLACER par l'URL de site WordPress de l'asso.
  wordpressEndpoint: 'https://www.gpc65-gestion.cazu1740.odns.fr/graphql',
  
  // Nombre d'articles par page
  articlesPerPage: 6,
  
  // Durée du cache en secondes (10 secondes)
  cacheDuration: 10,
};

// =============================================
// UTILITAIRES
// =============================================

/**
 * Formate une date en français
 * @param {string} dateString - Date ISO
 * @returns {string} Date formatée
 */
function formatDate(dateString) {
  const options = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}

/**
 * Génère un slug URL-friendly
 * @param {string} text - Texte à transformer
 * @returns {string} Slug
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .trim();
}

/**
 * Extrait le texte brut d'un HTML
 * @param {string} html - Contenu HTML
 * @param {number} maxLength - Longueur maximale
 * @returns {string} Texte tronqué
 */
function extractText(html, maxLength = 150) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  let text = tmp.textContent || tmp.innerText || '';
  text = text.trim();
  if (text.length > maxLength) {
    text = text.substring(0, maxLength).trim() + '...';
  }
  return text;
}

/**
 * Affiche un message d'erreur dans un conteneur
 * @param {string} containerId - ID du conteneur
 * @param {string} message - Message d'erreur
 */
function showError(containerId, message) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
      <div class="error-message">
        <p>❌ ${message}</p>
        <button onclick="location.reload()" class="mt-4 px-4 py-2 gradient-primary text-white rounded-lg">
          Réessayer
        </button>
      </div>
    `;
  }
}

/**
 * Affiche l'état "vide" quand aucune donnée
 * @param {string} containerId - ID du conteneur
 * @param {string} message - Message à afficher
 */
function showEmptyState(containerId, message) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
      <div class="empty-state">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
        </svg>
        <p>${message}</p>
      </div>
    `;
  }
}

/**
 * Génère le HTML d'un skeleton loader
 * @param {number} count - Nombre de skeleton
 * @returns {string} HTML
 */
function generateSkeletons(count = 3) {
  let html = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="bg-white border border-amber-200 rounded-lg overflow-hidden">
        <div class="skeleton skeleton-image"></div>
        <div class="p-4">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text" style="width: 80%;"></div>
        </div>
      </div>
    `;
  }
  html += '</div>';
  return html;
}

// =============================================
// API WORDPRESS
// =============================================

/**
 * Effectue une requête GraphQL
 * @param {string} query - Requête GraphQL
 * @param {Object} variables - Variables de la requête
 * @returns {Promise<Object>} Données retournées
 */
async function fetchGraphQL(query, variables = {}) {
  const cacheKey = `wp_${JSON.stringify({ query, variables })}`;
  
  // Vérifier le cache
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { value, expiry } = JSON.parse(cached);
      if (expiry > Date.now()) {
        return value;
      }
    }
  } catch (e) {
    // Ignorer les erreurs de cache
  }

  try {
    const response = await fetch(CONFIG.wordpressEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    // Mettre en cache
    try {
      const cacheData = {
        value: result,
        expiry: Date.now() + (CONFIG.cacheDuration * 1000),
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (e) {
      // Ignorer les erreurs de cache plein
    }

    return result;
  } catch (error) {
    console.error('Erreur GraphQL:', error);
    throw error;
  }
}

// =============================================
// RÉCUPÉRATION DES ARTICLES
// =============================================

/**
 * Récupère les articles depuis WordPress
 * @param {Object} options - Options de pagination et filtrage
 * @returns {Promise<{articles: Array, pagination: Object}>}
 */
async function getArticles(options = {}) {
  const {
    perPage = CONFIG.articlesPerPage,
    page = 1,
    categorySlug = null,
    tagSlug = null,
    search = null,
  } = options;

  const skip = (page - 1) * perPage;
  const where = {};
  
  if (categorySlug) {
    where.categoryName = categorySlug;
  }
  if (tagSlug) {
    where.tagSlug = tagSlug;
  }
  if (search) {
    where.search = search;
  }

  const query = `
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
    }
  `;

  const variables = {
    first: perPage,
    after: skip > 0 ? String(skip) : null,
    where,
  };

  const result = await fetchGraphQL(query, variables);
  const data = result.data?.posts;

  if (!data) {
    return { articles: [], pagination: null };
  }

  const articles = data.nodes.map(post => ({
    id: post.id,
    title: post.title,
    excerpt: extractText(post.excerpt || '', 200),
    date: post.date,
    uri: post.uri,
    slug: post.slug,
    image: post.featuredImage?.node?.sourceUrl || null,
    imageAlt: post.featuredImage?.node?.altText || post.title,
    categories: post.categories?.nodes || [],
    tags: post.tags?.nodes || [],
  }));

  const pagination = {
    currentPage: page,
    hasNextPage: data.pageInfo?.hasNextPage || false,
    hasPreviousPage: data.pageInfo?.hasPreviousPage || false,
  };

  return { articles, pagination };
}

/**
 * Récupère un article par son SLUG (pour le routage)
 * @param {string} slug - Slug de l'article (ex: "journee-du-patrimoine-culturelle-de-france")
 * @returns {Promise<Object>}
 */
async function getArticleBySlug(slug) {
  const query = `
    query GetArticleBySlug($slug: String!) {
      postBy(slug: $slug) {
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

  const result = await this._fetchGraphQL(query, { slug });
  if (!result.data.postBy) throw new Error(`Article avec slug "${slug}" introuvable`);
  return result.data.postBy;
}

// =============================================
// RÉCUPÉRATION DES CATÉGORIES & TAGS
// =============================================

/**
 * Récupère toutes les catégories
 * @returns {Promise<Array>}
 */
async function getCategories() {
  const query = `
    query GetCategories {
      categories(first: 100) {
        nodes {
          id
          name
          slug
          count
          description
          uri
        }
      }
    }
  `;

  const result = await fetchGraphQL(query);
  return result.data?.categories?.nodes || [];
}

/**
 * Récupère tous les tags
 * @returns {Promise<Array>}
 */
async function getTags() {
  const query = `
    query GetTags {
      tags(first: 100) {
        nodes {
          id
          name
          slug
          count
        }
      }
    }
  `;

  const result = await fetchGraphQL(query);
  return result.data?.tags?.nodes || [];
}

/**
 * Récupère une catégorie par son slug
 * @param {string} slug - Slug de la catégorie
 * @returns {Promise<Object|null>}
 */
async function getCategoryBySlug(slug) {
  const query = `
    query GetCategory($slug: ID!) {
      category(id: $slug, idType: SLUG) {
        id
        name
        slug
        description
        count
        uri
      }
    }
  `;

  const result = await fetchGraphQL(query, { slug });
  return result.data?.category || null;
}

// =============================================
// RÉCUPÉRATION DES PAGES
// =============================================

/**
 * Récupère le contenu d'une page par son slug
 * @param {string} slug - Slug de la page
 * @returns {Promise<Object|null>}
 */
async function getPageBySlug(slug) {
  const query = `
    query GetPage($slug: ID!) {
      page(id: $slug, idType: SLUG) {
        id
        title
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
      }
    }
  `;

  const result = await fetchGraphQL(query, { slug });
  const page = result.data?.page;

  if (!page) return null;

  return {
    id: page.id,
    title: page.title,
    content: page.content,
    date: page.date,
    uri: page.uri,
    slug: page.slug,
    image: page.featuredImage?.node?.sourceUrl || null,
    imageAlt: page.featuredImage?.node?.altText || page.title,
  };
}

// =============================================
// GÉNÉRATION DE TEMPLATES HTML
// =============================================

/**
 * Génère le HTML d'une carte d'article
 * @param {Object} article - Données de l'article
 * @returns {string} HTML
 */
function generateArticleCard(article) {
  const dateFormatted = article.date ? formatDate(article.date) : '';
  const imageUrl = article.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80';
  
  let categoriesHtml = '';
  if (article.categories && article.categories.length > 0) {
    categoriesHtml = article.categories.map(cat => 
      `<span class="category-chip">${cat.name}</span>`
    ).join('');
  }

  return `
    <article class="article-card" onclick="window.location.href='.${article.uri || '/'}'">
      <div class="card-image">
        <img src="${imageUrl}" alt="${article.imageAlt || article.title}" loading="lazy">
      </div>
      <div class="card-content">
        <div class="flex flex-wrap gap-2 mb-3">
          ${categoriesHtml}
        </div>
        <h3 class="text-xl font-bold text-red-600 mb-2 line-clamp-2">
          ${article.title}
        </h3>
        <p class="text-gray-600 text-sm mb-4 line-clamp-3">
          ${article.excerpt}
        </p>
        <div class="flex items-center justify-between text-xs text-gray-500">
          <span>${dateFormatted}</span>
          <span class="text-red-600 font-medium">Lire la suite →</span>
        </div>
      </div>
    </article>
  `;
}

/**
 * Génère le HTML des contrôles de pagination
 * @param {Object} pagination - Informations de pagination
 * @param {string} containerId - ID du conteneur de destination
 * @returns {string} HTML
 */
function generatePagination(pagination, containerId) {
  const { currentPage, hasNextPage, hasPreviousPage } = pagination;

  let html = '<div class="flex items-center justify-center gap-2 mt-8">';
  
  // Bouton précédent
  html += `
    <button 
      class="pagination-btn" 
      ${!hasPreviousPage ? 'disabled' : ''}
      onclick="loadPage(${currentPage - 1}, '${containerId}')"
    >
      ← Précédent
    </button>
  `;

  // Pages numérotées
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(0, startPage + maxVisible - 1);
  
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  if (startPage > 1) {
    html += `<button class="pagination-btn" onclick="loadPage(1, '${containerId}')">1</button>`;
    if (startPage > 2) {
      html += `<span class="px-2 text-gray-500">...</span>`;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const isActive = i === currentPage;
    html += `
      <button 
        class="pagination-btn ${isActive ? 'active' : ''}"
        onclick="loadPage(${i}, '${containerId}')"
      >
        ${i}
      </button>
    `;
  }

  // Bouton suivant
  html += `
    <button 
      class="pagination-btn" 
      ${!hasNextPage ? 'disabled' : ''}
      onclick="loadPage(${currentPage + 1}, '${containerId}')"
    >
      Suivant →
    </button>
  `;

  html += '</div>';
  return html;
}

// =============================================
// FONCTIONS DE CHARGEMENT
// =============================================

/**
 * Charge les articles dans le conteneur spécifié
 * @param {number} page - Numéro de page
 * @param {string} containerId - ID du conteneur
 * @param {Object} filters - Filtres optionnels
 */
async function loadPage(page = 1, containerId = 'articles-grid', filters = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Afficher les skeletons pendant le chargement
  container.innerHTML = generateSkeletons(CONFIG.articlesPerPage);

  try {
    const { articles, pagination } = await getArticles({ ...filters, page });

    if (articles.length === 0) {
      showEmptyState(containerId, 'Aucun article trouvé.');
      return;
    }

    // Générer les cartes d'articles
    let html = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">';
    html += articles.map(article => generateArticleCard(article)).join('');
    html += '</div>';

    container.innerHTML = html;

  } catch (error) {
    showError(containerId, 'Impossible de charger les articles. Veuillez réessayer.');
  }
}

/**
 * Charge les articles d'une catégorie spécifique
 * @param {string} categorySlug - Slug de la catégorie
 * @param {string} containerId - ID du conteneur
 */
async function loadCategoryArticles(categorySlug, containerId = 'articles-grid') {
  await loadPage(1, containerId, { categorySlug });
}

/**
 * Charge les articles d'un tag spécifique
 * @param {string} tagSlug - Slug du tag
 * @param {string} containerId - ID du conteneur
 */
async function loadTagArticles(tagSlug, containerId = 'articles-grid') {
  await loadPage(1, containerId, { tagSlug });
}

/**
 * Charge une page d'article complet
 * @param {string} slug - Slug de l'article
 */
async function loadArticle(slug) {
  const titleEl = document.getElementById('article-title');
  const contentEl = document.getElementById('article-content');
  const metaEl = document.getElementById('article-meta');
  
  if (titleEl) titleEl.innerHTML = '<div class="skeleton skeleton-title"></div>';
  if (contentEl) contentEl.innerHTML = '<div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text"></div>';

  try {
    const article = await getArticleBySlug(slug);

    if (!article) {
      document.getElementById('article-title').innerHTML = '<h1>Article introuvable</h1>';
      showEmptyState('article-content', 'Cet article n\'existe pas ou a été supprimé.');
      return;
    }

    if (titleEl) {
      titleEl.innerHTML = `
        <h1 class="text-3xl md:text-4xl font-bold text-red-600 mb-4">${article.title}</h1>
        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span>📅 ${formatDate(article.date)}</span>
          ${article.author ? `<span>👤 ${article.author.name}</span>` : ''}
        </div>
      `;
    }

    if (contentEl) {
      contentEl.innerHTML = `
        <div class="article-content">
          ${article.content || '<p>Aucun contenu disponible.</p>'}
        </div>
      `;
    }

    if (metaEl) {
      let metaHtml = '';
      
      if (article.categories && article.categories.length > 0) {
        metaHtml += '<div class="mb-4"><strong>Catégories:</strong> ';
        metaHtml += article.categories.map(cat => 
          `<a href="./pages/category.html?slug=${cat.slug}" class="category-chip ml-2">${cat.name}</a>`
        ).join('');
        metaHtml += '</div>';
      }

      if (article.tags && article.tags.length > 0) {
        metaHtml += '<div><strong>Tags:</strong> ';
        metaHtml += article.tags.map(tag => 
          `<span class="tag ml-2">${tag.name}</span>`
        ).join('');
        metaHtml += '</div>';
      }

      metaEl.innerHTML = metaHtml;
    }

    // Mettre à jour le titre de la page
    document.title = `${article.title} - Guet Patrimoine Caduceen`;

  } catch (error) {
    showError('article-content', 'Impossible de charger cet article.');
  }
}

/**
 * Charge les catégories dans un conteneur
 * @param {string} containerId - ID du conteneur
 * @param {boolean} showCount - Afficher le nombre d'articles
 */
async function loadCategoriesList(containerId, showCount = true) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '<div class="skeleton skeleton-text"></div>';

  try {
    const categories = await getCategories();

    if (categories.length === 0) {
      container.innerHTML = '<p class="text-gray-500">Aucune catégorie</p>';
      return;
    }

    container.innerHTML = categories.map(cat => `
      <a href="./pages/category.html?slug=${cat.slug}" class="flex items-center justify-between p-3 rounded-lg hover:bg-amber-50 transition-smooth">
        <span class="font-medium">${cat.name}</span>
        ${showCount ? `<span class="text-sm text-gray-500">${cat.count || 0}</span>` : ''}
      </a>
    `).join('');

  } catch (error) {
    container.innerHTML = '<p class="text-red-500">Erreur de chargement</p>';
  }
}

/**
 * Charge les tags dans un conteneur
 * @param {string} containerId - ID du conteneur
 */
async function loadTagsList(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const tags = await getTags();

    if (tags.length === 0) {
      container.innerHTML = '<p class="text-gray-500">Aucun tag</p>';
      return;
    }

    container.innerHTML = tags.map(tag => `
      <a href="./pages/tag.html?slug=${tag.slug}" class="tag">${tag.name}</a>
    `).join('');

  } catch (error) {
    container.innerHTML = '<p class="text-red-500">Erreur de chargement</p>';
  }
}

/**
 * Charge le contenu d'une page statique
 * @param {string} slug - Slug de la page
 */
async function loadPageContent(slug) {
  try {
    const page = await getPageBySlug(slug);

    if (!page) {
      document.getElementById('page-content').innerHTML = `
        <div class="text-center py-12">
          <h1 class="text-2xl font-bold text-gray-800 mb-4">Page introuvable</h1>
          <p class="text-gray-600">Cette page n'existe pas ou a été supprimée.</p>
          <a href="/" class="mt-6 inline-block gradient-primary text-white px-6 py-2 rounded-lg">
            Retour à l'accueil
          </a>
        </div>
      `;
      return;
    }

    document.getElementById('page-title').textContent = page.title;
    document.getElementById('page-content').innerHTML = `
      <div class="article-content">
        ${page.content || '<p>Aucun contenu disponible.</p>'}
      </div>
    `;
    document.title = `${page.title} - Guet Patrimoine Caduceen`;

  } catch (error) {
    showError('page-content', 'Impossible de charger cette page.');
  }
}

// =============================================
// NAVIGATION & INTERACTIVITÉ
// =============================================

/**
 * Initialise le menu mobile
 */
function initMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const close = document.getElementById('mobile-menu-close');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => menu.classList.add('open'));
  close?.addEventListener('click', () => menu.classList.remove('open'));

  // Fermer en cliquant sur un lien
  menu.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });
}

/**
 * Initialise la modal d'image
 */
function initImageModal() {
  const modal = document.getElementById('imageModal');
  if (!modal) return;

  window.openModal = (imageSrc, caption = '') => {
    document.getElementById('modalImage').src = imageSrc;
    document.getElementById('modalCaption').textContent = caption;
    modal.classList.add('open');
  };

  window.closeModal = () => modal.classList.remove('open');

  document.getElementById('closeModal')?.addEventListener('click', window.closeModal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) window.closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeModal?.();
  });
}

/**
 * Initialise la navigation active
 */
function initActiveNavigation() {
  const currentPath = window.location.pathname;
  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href.split('#')[0])) {
      link.classList.add('text-red-600');
    }
  });
}

// =============================================
// INITIALISATION
// =============================================

/**
 * Point d'entrée principal
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialiser les composants UI
  initMobileMenu();
  initImageModal();
  initActiveNavigation();

  // Détecter le type de page et charger les données appropriées
  const pagePath = window.location.pathname;

  if (pagePath.includes('/pages/article.html')) {
    // Extraire le slug de l'URL
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    if (slug) {
      loadArticle(slug);
    }
  } else if (pagePath.includes('/pages/category.html')) {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    if (slug) {
      // Charger les infos de la catégorie
      getCategoryBySlug(slug).then(cat => {
        if (cat && document.getElementById('category-title')) {
          document.getElementById('category-title').textContent = cat.name;
          document.getElementById('category-description').textContent = cat.description || '';
        }
      });
      loadCategoryArticles(slug);
    }
  } else if (pagePath.includes('/pages/tag.html')) {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    if (slug) {
      if (document.getElementById('tag-title')) {
        document.getElementById('tag-title').textContent = `Tag: ${slug}`;
      }
      loadTagArticles(slug);
    }
  } else if (pagePath.includes('/pages/page.html')) {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    if (slug) {
      loadPageContent(slug);
    }
  } else if (pagePath === '/' || pagePath.endsWith('/index.html')) {
    // Page d'accueil - charger les articles
    if (document.getElementById('articles-grid')) {
      loadPage(1, 'articles-grid');
    }
    // Charger les catégories et tags dans la barre latérale
    if (document.getElementById('categories-list')) {
      loadCategoriesList('categories-list');
    }
    if (document.getElementById('tags-list')) {
      loadTagsList('tags-list');
    }
  }
});

// Exporter pour une utilisation externe
window.WPFrontend = {
  loadPage,
  loadArticle,
  loadCategoryArticles,
  loadTagArticles,
  loadCategoriesList,
  loadTagsList,
  getArticleBySlug,
  getCategoryBySlug,
  getPageBySlug,
  getArticles,
  getCategories,
  getTags,
};