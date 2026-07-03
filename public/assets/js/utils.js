/**
 * Module de fonctions utilitaires.
 * @module utils
 */
const Utils = {
  /**
   * Formate une date au format "DD/MM/YYYY".
   * @param {string} dateString - Date au format ISO (ex: "2026-06-26T10:00:00").
   * @returns {string} - Date formatée.
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  },

  /**
   * Extrait le slug d'une URL.
   * @param {string} url - URL complète.
   * @returns {string} - Slug extrait.
   */
  extractSlug(url) {
    const parts = url.split('/');
    return parts[parts.length - 1] || '';
  },

  /**
   * Génère une URL pour un article.
   * @param {string} slug - Slug de l'article.
   * @returns {string} - URL complète.
   */
  getArticleUrl(slug) {
    return `/article/${slug}`;
  },

  /**
   * Génère une URL pour une catégorie.
   * @param {string} slug - Slug de la catégorie.
   * @returns {string} - URL complète.
   */
  getCategoryUrl(slug) {
    return `/category/${slug}`;
  },

  /**
   * Génère une URL pour un tag.
   * @param {string} slug - Slug du tag.
   * @returns {string} - URL complète.
   */
  getTagUrl(slug) {
    return `/tag/${slug}`;
  },

  /**
   * Sanitize le HTML pour éviter les XSS.
   * @param {string} html - HTML à sanitizer.
   * @returns {string} - HTML sanitizé.
   */
  sanitizeHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  },

  /**
   * Met à jour les balises meta pour le SEO.
   * @param {Object} meta - Objet contenant les métadonnées.
   * @param {string} meta.title - Titre de la page.
   * @param {string} meta.description - Description de la page.
   * @param {string} meta.image - URL de l'image pour les réseaux sociaux.
   */
  updateMetaTags({ title, description, image }) {
    // Titre
    document.title = title;
    const titleTag = document.querySelector('meta[property="og:title"]');
    if (titleTag) titleTag.setAttribute('content', title);

    // Description
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) descTag.setAttribute('content', description);
    const ogDescTag = document.querySelector('meta[property="og:description"]');
    if (ogDescTag) ogDescTag.setAttribute('content', description);

    // Image
    if (image) {
      const ogImageTag = document.querySelector('meta[property="og:image"]');
      if (ogImageTag) ogImageTag.setAttribute('content', image);
    }
  }
};
