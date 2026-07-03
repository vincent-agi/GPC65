/**
 * Composant pour afficher une carte d'article.
 * @module components/ArticleCard
 */
class ArticleCard {
  /**
   * Crée une carte d'article.
   * @param {Object} article - Données de l'article.
   * @param {string} article.title.rendered - Titre de l'article.
   * @param {string} article.slug - Slug de l'article.
   * @param {string} article.date - Date de publication.
   * @param {string} article._embedded['wp:featuredmedia'] - Image mise en avant.
   * @param {Array} article._embedded['wp:term'] - Catégories et tags.
   * @returns {HTMLElement} - Éléments DOM de la carte.
   */
  static create(article) {
    const card = document.createElement('article');
    card.className = 'article-card';

    // Image mise en avant (si disponible)
    const featuredMedia = article._embedded?.['wp:featuredmedia']?.[0];
    const imageUrl = featuredMedia?.source_url || '/assets/images/placeholder.jpg';

    // Catégories
    const categories = article._embedded?.['wp:term']?.[0] || [];
    const categoryNames = categories.map(cat => cat.name).join(', ');
    const categorySlugs = categories.map(cat => cat.slug);

    // Date formatée
    const formattedDate = Utils.formatDate(article.date);

    card.innerHTML = `
      <a href="${Utils.getArticleUrl(article.slug)}" class="article-link">
        <div class="article-image">
          <img src="${imageUrl}" alt="${article.title.rendered}" loading="lazy">
        </div>
        <div class="article-content">
          ${categoryNames ? `<span class="article-category">${categoryNames}</span>` : ''}
          <h3 class="article-title">${article.title.rendered}</h3>
          <time class="article-date" datetime="${article.date}">${formattedDate}</time>
          <p class="article-excerpt">${this.truncateExcerpt(article.excerpt.rendered)}</p>
        </div>
      </a>
    `;

    return card;
  }

  /**
   * Tronque l'extrait de l'article.
   * @param {string} excerpt - Extrait brut.
   * @returns {string} - Extrait tronqué.
   */
  static truncateExcerpt(excerpt) {
    if (!excerpt) return '';
    const div = document.createElement('div');
    div.innerHTML = excerpt;
    const text = div.textContent || div.innerText || '';
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  }
}
