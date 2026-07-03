/**
 * Module pour interagir avec l'API WordPress Headless.
 * @module api
 */
const API = (() => {
  // URL de base de l'API WordPress (à adapter)
  const BASE_URL = 'https://gpc65.serenypets.fr/wp-json/wp/v2';

  /**
   * Récupère tous les articles avec pagination.
   * @param {Object} options - Options de requête.
   * @param {number} [options.page=1] - Numéro de page.
   * @param {number} [options.perPage=10] - Nombre d'articles par page.
   * @param {number} [options.category] - ID de la catégorie (optionnel).
   * @param {number} [options.tag] - ID du tag (optionnel).
   * @returns {Promise<Array>} - Liste des articles.
   */
  const getPosts = async (options = {}) => {
    const {
      page = 1,
      perPage = 10,
      category = null,
      tag = null,
      search = null
    } = options;

    let url = `${BASE_URL}/posts?page=${page}&per_page=${perPage}&_embed`;

    if (category) url += `&categories=${category}`;
    if (tag) url += `&tags=${tag}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
      const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
      const data = await response.json();
      return { posts: data, totalPages };
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      return { posts: [], totalPages: 1 };
    }
  };

  /**
   * Récupère un article par son slug.
   * @param {string} slug - Slug de l'article.
   * @returns {Promise<Object|null>} - Article ou null.
   */
  const getPostBySlug = async (slug) => {
    try {
      const response = await fetch(`${BASE_URL}/posts?slug=${slug}&_embed`);
      if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
      const data = await response.json();
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'article:', error);
      return null;
    }
  };

  /**
   * Récupère toutes les catégories.
   * @returns {Promise<Array>} - Liste des catégories.
   */
  const getCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/categories?per_page=100`);
      if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      return [];
    }
  };

  /**
   * Récupère tous les tags.
   * @returns {Promise<Array>} - Liste des tags.
   */
  const getTags = async () => {
    try {
      const response = await fetch(`${BASE_URL}/tags?per_page=100`);
      if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des tags:', error);
      return [];
    }
  };

  return {
    getPosts,
    getPostBySlug,
    getCategories,
    getTags
  };
})();
