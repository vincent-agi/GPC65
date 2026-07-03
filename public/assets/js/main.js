/**
 * Point d'entrée principal de l'application.
 * @module main
 */

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const categories = await API.getCategories();
    const tags = await API.getTags();
    console.log('Catégories:', categories);
    console.log('Tags:', tags);
    // Ici, tu peux injecter les données dans le DOM
    } catch (error) {
      console.error('Erreur au chargement:', error);
    }

  // Initialiser les filtres sur la page blog
  initFilters(categories, tags);

  // Configurer le router
  setupRouter();

  // Charger le contenu en fonction de l'URL actuelle
  handleInitialRoute();
});

/**
 * Initialise les filtres de catégorie et tag sur la page blog.
 * @param {Array} categories - Liste des catégories.
 * @param {Array} tags - Liste des tags.
 */
function initFilters(categories, tags) {
  const categoryFilter = document.getElementById('category-filter');
  const tagFilter = document.getElementById('tag-filter');

  if (categoryFilter) {
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      categoryFilter.appendChild(option);
    });

    categoryFilter.addEventListener('change', () => loadBlogPosts());
  }

  if (tagFilter) {
    tags.forEach(tag => {
      const option = document.createElement('option');
      option.value = tag.id;
      option.textContent = tag.name;
      tagFilter.appendChild(option);
    });

    tagFilter.addEventListener('change', () => loadBlogPosts());
  }
}

/**
 * Configure le router avec toutes les routes de l'application.
 */
function setupRouter() {
  // Route pour la page d'accueil
  router.addRoute('/', async () => {
    await loadHomePage();
  });

  // Route pour la page blog
  router.addRoute('/blog', async () => {
    await loadBlogPage();
  });

  // Route pour un article
  router.addRoute('/article/:slug', async (params) => {
    await loadArticlePage(params.slug);
  });

  // Route pour une catégorie
  router.addRoute('/category/:slug', async (params) => {
    await loadCategoryPage(params.slug);
  });

  // Route pour un tag
  router.addRoute('/tag/:slug', async (params) => {
    await loadTagPage(params.slug);
  });
}

/**
 * Gère le routage initial au chargement de la page.
 */
function handleInitialRoute() {
  const path = window.location.pathname;
  if (path.startsWith('/article/')) {
    const slug = path.split('/').pop();
    router.navigate(`/article/${slug}`, false);
  } else if (path.startsWith('/category/')) {
    const slug = path.split('/').pop();
    router.navigate(`/category/${slug}`, false);
  } else if (path.startsWith('/tag/')) {
    const slug = path.split('/').pop();
    router.navigate(`/tag/${slug}`, false);
  } else if (path === '/blog' || path === '/') {
    router.navigate(path, false);
  } else {
    router.navigate('/404', false);
  }
}

/**
 * Charge la page d'accueil avec les derniers articles.
 */
async function loadHomePage() {
  const container = document.getElementById('articles-container');
  if (!container) return;

  container.innerHTML = '<div class="loader">Chargement...</div>';

  try {
    const { posts } = await API.getPosts({ perPage: 3 });
    container.innerHTML = '';

    if (posts.length === 0) {
      container.innerHTML = '<p>Aucun article trouvé.</p>';
      return;
    }

    posts.forEach(article => {
      const card = ArticleCard.create(article);
      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = '<p>Erreur lors du chargement des articles.</p>';
    console.error(error);
  }
}

/**
 * Charge la page blog avec tous les articles.
 */
async function loadBlogPage() {
  const container = document.getElementById('articles-container');
  const pagination = document.getElementById('pagination');
  if (!container) return;

  container.innerHTML = '<div class="loader">Chargement...</div>';
  if (pagination) pagination.innerHTML = '';

  try {
    const categoryFilter = document.getElementById('category-filter');
    const tagFilter = document.getElementById('tag-filter');

    const options = {
      perPage: 10,
      category: categoryFilter?.value || null,
      tag: tagFilter?.value || null
    };

    const { posts, totalPages } = await API.getPosts(options);
    container.innerHTML = '';

    if (posts.length === 0) {
      container.innerHTML = '<p>Aucun article trouvé.</p>';
      return;
    }

    posts.forEach(article => {
      const card = ArticleCard.create(article);
      container.appendChild(card);
    });

    // Ajouter la pagination
    if (pagination && totalPages > 1) {
      pagination.innerHTML = `
        <div class="pagination-controls">
          ${options.page > 1 ? `<button class="btn" id="prev-page">Précédent</button>` : ''}
          <span>Page ${options.page || 1} / ${totalPages}</span>
          ${options.page < totalPages ? `<button class="btn" id="next-page">Suivant</button>` : ''}
        </div>
      `;

      document.getElementById('prev-page')?.addEventListener('click', () => {
        options.page = (options.page || 1) - 1;
        loadBlogPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      document.getElementById('next-page')?.addEventListener('click', () => {
        options.page = (options.page || 1) + 1;
        loadBlogPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  } catch (error) {
    container.innerHTML = '<p>Erreur lors du chargement des articles.</p>';
    console.error(error);
  }
}

/**
 * Charge une page d'article unique.
 * @param {string} slug - Slug de l'article.
 */
async function loadArticlePage(slug) {
  const container = document.getElementById('article-content');
  if (!container) return;

  container.innerHTML = '<div class="loader">Chargement...</div>';

  try {
    const article = await API.getPostBySlug(slug);
    if (!article) {
      container.innerHTML = '<p>Article non trouvé.</p>';
      return;
    }

    // Mise à jour des balises meta pour le SEO
    const featuredMedia = article._embedded?.['wp:featuredmedia']?.[0];
    const imageUrl = featuredMedia?.source_url || 'http://gpc65-website.web.app/assets/images/og-image.jpg';

    Utils.updateMetaTags({
      title: `${article.title.rendered} | GPC65`,
      description: article.excerpt.rendered.replace(/<[^>]*>/g, ''),
      image: imageUrl
    });

    // Contenu de l'article
    const categories = article._embedded?.['wp:term']?.[0] || [];
    const categoryNames = categories.map(cat => cat.name).join(', ');
    const categoryLinks = categories.map(cat => `
      <a href="/category/${cat.slug}" class="article-category-link">${cat.name}</a>
    `).join(', ');

    const tags = article._embedded?.['wp:term']?.[1] || [];
    const tagLinks = tags.map(tag => `
      <a href="/tag/${tag.slug}" class="article-tag-link">#${tag.name}</a>
    `).join(' ');

    container.innerHTML = `
      <header class="article-header">
        <h1>${article.title.rendered}</h1>
        <div class="article-meta">
          <time datetime="${article.date}">Publié le ${Utils.formatDate(article.date)}</time>
          ${categoryNames ? `<div class="article-categories">Dans : ${categoryLinks}</div>` : ''}
          ${tags.length > 0 ? `<div class="article-tags">${tagLinks}</div>` : ''}
        </div>
        ${featuredMedia ? `
          <figure class="article-featured-image">
            <img src="${featuredMedia.source_url}" alt="${article.title.rendered}" loading="lazy">
            ${featuredMedia.caption?.rendered ? `
              <figcaption>${featuredMedia.caption.rendered}</figcaption>
            ` : ''}
          </figure>
        ` : ''}
      </header>
      <div class="article-body">
        ${article.content.rendered}
      </div>
      <footer class="article-footer">
        <a href="/blog" class="btn">Retour au blog</a>
      </footer>
    `;

    // Structured Data pour le SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title.rendered,
      "description": article.excerpt.rendered.replace(/<[^>]*>/g, ''),
      "datePublished": article.date,
      "dateModified": article.modified || article.date,
      "author": {
        "@type": "Organization",
        "name": "GPC65"
      },
      "publisher": {
        "@type": "Organization",
        "name": "GPC65",
        "logo": {
          "@type": "ImageObject",
          "url": "http://gpc65-website.web.app/assets/images/logo.png"
        }
      },
      "image": imageUrl,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `http://gpc65-website.web.app/article/${slug}`
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

  } catch (error) {
    container.innerHTML = '<p>Erreur lors du chargement de l\'article.</p>';
    console.error(error);
  }
}

/**
 * Charge une page de catégorie.
 * @param {string} slug - Slug de la catégorie.
 */
async function loadCategoryPage(slug) {
  const container = document.getElementById('articles-container');
  if (!container) return;

  container.innerHTML = '<div class="loader">Chargement...</div>';

  try {
    // Récupérer l'ID de la catégorie depuis le slug
    const categories = await API.getCategories();
    const category = categories.find(cat => cat.slug === slug);
    if (!category) {
      container.innerHTML = '<p>Catégorie non trouvée.</p>';
      return;
    }

    // Mise à jour du titre et des meta
    document.title = `${category.name} | GPC65`;
    Utils.updateMetaTags({
      title: `${category.name} | GPC65`,
      description: `Articles dans la catégorie ${category.name}`
    });

    // Charger les articles de la catégorie
    const { posts, totalPages } = await API.getPosts({
      category: category.id,
      perPage: 10
    });

    container.innerHTML = `
      <h1>Catégorie : ${category.name}</h1>
      <p>${category.description || ''}</p>
      <div class="grid" id="category-articles"></div>
    `;

    const articlesContainer = document.getElementById('category-articles');
    if (posts.length === 0) {
      articlesContainer.innerHTML = '<p>Aucun article dans cette catégorie.</p>';
      return;
    }

    posts.forEach(article => {
      const card = ArticleCard.create(article);
      articlesContainer.appendChild(card);
    });

  } catch (error) {
    container.innerHTML = '<p>Erreur lors du chargement de la catégorie.</p>';
    console.error(error);
  }
}

/**
 * Charge une page de tag.
 * @param {string} slug - Slug du tag.
 */
async function loadTagPage(slug) {
  const container = document.getElementById('articles-container');
  if (!container) return;

  container.innerHTML = '<div class="loader">Chargement...</div>';

  try {
    // Récupérer l'ID du tag depuis le slug
    const tags = await API.getTags();
    const tag = tags.find(t => t.slug === slug);
    if (!tag) {
      container.innerHTML = '<p>Tag non trouvé.</p>';
      return;
    }

    // Mise à jour du titre et des meta
    document.title = `Tag : ${tag.name} | GPC65`;
    Utils.updateMetaTags({
      title: `Tag : ${tag.name} | GPC65`,
      description: `Articles avec le tag ${tag.name}`
    });

    // Charger les articles avec ce tag
    const { posts, totalPages } = await API.getPosts({
      tag: tag.id,
      perPage: 10
    });

    container.innerHTML = `
      <h1>Tag : ${tag.name}</h1>
      <div class="grid" id="tag-articles"></div>
    `;

    const articlesContainer = document.getElementById('tag-articles');
    if (posts.length === 0) {
      articlesContainer.innerHTML = '<p>Aucun article avec ce tag.</p>';
      return;
    }

    posts.forEach(article => {
      const card = ArticleCard.create(article);
      articlesContainer.appendChild(card);
    });

  } catch (error) {
    container.innerHTML = '<p>Erreur lors du chargement du tag.</p>';
    console.error(error);
  }
}
