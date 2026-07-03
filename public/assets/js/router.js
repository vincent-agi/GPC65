/**
 * Router client-side pour une SPA
 * Gère les routes : /, /blog, /article/:slug, /category/:slug, /tag/:slug
 */
class Router {
  constructor() {
    this.routes = {
      '/': this.loadHome,
      '/blog': this.loadBlog,
      '/article/:slug': this.loadArticle,
      '/category/:slug': this.loadCategory,
      '/tag/:slug': this.loadTag,
    };
    this.currentRoute = null;
    this.init();
  }

  /**
   * Initialise le router (écoute les changements d'URL)
   */
  init() {
    window.addEventListener('popstate', () => this.handleRouting());
    window.addEventListener('DOMContentLoaded', () => this.handleRouting());

    // Intercepte les clics sur les liens internes
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="/"]')) {
        e.preventDefault();
        const path = e.target.getAttribute('href');
        this.navigateTo(path);
      }
    });
  }

  /**
   * Gère le routage en fonction de l'URL actuelle
   */
  handleRouting() {
    const path = window.location.pathname;
    this.currentRoute = path;

    // Vérifie si une route correspond
    for (const [routePattern, handler] of Object.entries(this.routes)) {
      const regex = this._routeToRegex(routePattern);
      if (regex.test(path)) {
        const params = this._extractParams(path, regex);
        handler(params);
        return;
      }
    }

    // Route non trouvée → 404
    this.load404();
  }

  /**
   * Navigue vers une nouvelle route (sans recharger la page)
   * @param {string} path - Chemin de la route (ex: "/blog")
   */
  navigateTo(path) {
    window.history.pushState({}, '', path);
    this.handleRouting();
  }

  /**
   * Charge la page d'accueil
   */
  loadHome() {
    console.log('Chargement de la page d\'accueil');
    this._loadContent('home');
  }

  /**
   * Charge la page du blog
   */
  loadBlog() {
    console.log('Chargement de la page blog');
    this._loadContent('blog');
  }

  /**
   * Charge un article
   * @param {Object} params - Paramètres de la route (ex: { slug: "hello-world" })
   */
  loadArticle(params) {
    console.log('Chargement de l\'article:', params.slug);
    this._loadContent('article', params);
  }

  /**
   * Charge une catégorie
   * @param {Object} params - Paramètres de la route
   */
  loadCategory(params) {
    console.log('Chargement de la catégorie:', params.slug);
    this._loadContent('category', params);
  }

  /**
   * Charge un tag
   * @param {Object} params - Paramètres de la route
   */
  loadTag(params) {
    console.log('Chargement du tag:', params.slug);
    this._loadContent('tag', params);
  }

  /**
   * Charge la page 404
   */
  load404() {
    console.log('Page non trouvée (404)');
    this._loadContent('404');
  }

  /**
   * Charge le contenu dynamique dans #app
   * @param {string} template - Nom du template à charger
   * @param {Object} params - Paramètres à passer au template
   */
  _loadContent(template, params = {}) {
    // Exemple : Remplace le contenu de #app par le template correspondant
    const app = document.getElementById('app');
    if (!app) return;

    // Ici, tu peux :
    // 1. Charger un template HTML via fetch()
    // 2. Ou utiliser un système de templates (ex: Handlebars, LitHTML)
    // 3. Ou simplement afficher un message (pour le test)
    app.innerHTML = `<h1>Template: ${template}</h1><pre>${JSON.stringify(params, null, 2)}</pre>`;

    // Exemple pour charger un article depuis l'API WordPress :
    if (template === 'article' && params.slug) {
      API.getPostBySlug(params.slug)
        .then(post => {
          app.innerHTML = `<article>${post.content.rendered}</article>`;
        })
        .catch(error => {
          console.error('Erreur:', error);
          app.innerHTML = '<p>Article introuvable.</p>';
        });
    }
  }

  /**
   * Convertit une route en regex (ex: "/article/:slug" → /^\/article\/([^\/]+)$/)
   * @param {string} route - Route à convertir (ex: "/article/:slug")
   * @returns {RegExp}
   */
  _routeToRegex(route) {
    return new RegExp(
      `^${route.replace(/\/:([^\/]+)/g, '/([^\/]+)')}$`
    );
  }

  /**
   * Extrait les paramètres d'une URL (ex: "/article/hello-world" → { slug: "hello-world" })
   * @param {string} path - URL actuelle
   * @param {RegExp} regex - Regex de la route
   * @returns {Object}
   */
  _extractParams(path, regex) {
    const match = path.match(regex);
    if (!match) return {};

    const keys = [...path.matchAll(/\/:([^\/]+)/g)].map(m => m[1]);
    const params = {};
    keys.forEach((key, i) => {
      params[key] = match[i + 1];
    });
    return params;
  }
}

// Exporte le router pour l'utiliser dans main.js
const router = new Router();
