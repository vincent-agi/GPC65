/**
 * Logique principale de l'application
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialise les services
    const wp = new WordPressHeadlessService();
    const router = new Router();

    // Éléments DOM
    const articlesGrid = document.getElementById('articles-grid');
    const loadMoreButton = document.getElementById('load-more-articles');

    let currentPage = 1;
    let hasMoreArticles = true;

    /**
     * Charge les articles depuis WordPress
     * @param {number} page - Numéro de la page à charger
     */
    const loadArticles = async (page) => {
        try {
            const { articles, pagination } = await wp.getArticles({ perPage: 6, page });

            // Affiche les articles
            articles.forEach(article => {
                const articleElement = document.createElement('div');
                articleElement.className = 'bg-white border border-stone-200 rounded-lg overflow-hidden shadow-md card-hover';
                articleElement.innerHTML = `
                    ${article.featuredImage?.node?.sourceUrl ?
                        `<img src="${article.featuredImage.node.sourceUrl}"
                              alt="${article.featuredImage.node.altText || article.title}"
                              class="w-full h-48 object-cover img-vintage">` :
                        `<div class="w-full h-48 bg-stone-100 flex items-center justify-center">
                            <svg class="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                        </div>`
                    }
                    <div class="p-4">
                        ${article.categories?.nodes?.length > 0 ?
                            `<span class="inline-block bg-stone-100 text-stone-600 text-xs px-2 py-1 rounded-full mb-2">
                                ${article.categories.nodes[0].name}
                            </span>` : ''
                        }
                        <h3 class="font-serif text-lg font-bold text-stone-800 mb-2">${article.title}</h3>
                        <p class="text-gray-600 mb-4 line-clamp-3">${article.excerpt}</p>
                        <div class="flex justify-between items-center text-sm text-gray-500">
                            <span>${new Date(article.date).toLocaleDateString('fr-FR')}</span>
                            <a href="/articles/${article.slug}"
                               class="text-patrimoine-gold font-medium hover:underline article-link">
                                Lire la suite
                            </a>
                        </div>
                    </div>
                `;
                articlesGrid.appendChild(articleElement);
            });

            // Met à jour le bouton "Voir plus"
            if (page >= pagination.pages) {
                hasMoreArticles = false;
                loadMoreButton.style.display = 'none';
            } else {
                loadMoreButton.style.display = 'block';
            }

        } catch (error) {
            articlesGrid.innerHTML = `
                <div class="col-span-full text-center p-8">
                    <p class="text-red-500">Erreur lors du chargement des articles: ${error.message}</p>
                </div>
            `;
            loadMoreButton.style.display = 'none';
        }
    };

    /**
     * Affiche un article unique
     * @param {Object} params - Paramètres de la route (contient le slug)
     */
    const showArticle = async (params) => {
        try {
            const article = await wp.getArticleBySlug(params.slug);
            // Ici tu pourrais afficher l'article dans une modal ou une nouvelle vue
            console.log("Article chargé:", article);
            alert(`Article chargé: ${article.title}`); // À remplacer par ton affichage
        } catch (error) {
            console.error("Erreur:", error);
            alert("Article introuvable");
        }
    };

    /**
     * Gère les clics sur les liens d'articles
     */
    const handleArticleLinks = (e) => {
        if (e.target.classList.contains('article-link')) {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            router.navigateTo(href);
        }
    };

    // Charge les premiers articles
    loadArticles(currentPage);

    // Gère le bouton "Voir plus"
    loadMoreButton.addEventListener('click', async () => {
        if (hasMoreArticles) {
            currentPage++;
            await loadArticles(currentPage);
        }
    });

    // Gère les clics sur les liens d'articles
    document.addEventListener('click', handleArticleLinks);

    // Configure le router
    router.addRoute('/articles/:slug', showArticle);
    router.addRoute('*', () => {
        // Retour à la liste des articles
        articlesGrid.innerHTML = '';
        currentPage = 1;
        loadArticles(currentPage);
    });
});
