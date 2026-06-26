/**
 * Gestionnaire de routage côté client (sans boucle infinie)
 * @class Router
 */
class Router {
    constructor() {
        this.routes = [];
        this.currentPath = null; // Pour éviter les boucles
        this.init();
    }

    /**
     * Ajoute une nouvelle route
     * @param {string} path - Chemin de la route (ex: "/", "/articles/:slug")
     * @param {Function} callback - Fonction à exécuter
     */
    addRoute(path, callback) {
        this.routes.push({ path, callback });
    }

    /**
     * Initialise le router
     */
    init() {
        window.addEventListener('popstate', () => this.handleRouting());
        this.handleRouting();
    }

    /**
     * Gère le routage sans boucle infinie
     */
    handleRouting() {
        const path = window.location.pathname;

        // Évite les boucles si on est déjà sur cette page
        if (path === this.currentPath) return;
        this.currentPath = path;

        for (const route of this.routes) {
            const regexPattern = route.path
                .replace(/:\w+/g, '([^/]+)')
                .replace(/\//g, '\\/');
            const regex = new RegExp(`^${regexPattern}$`);

            const match = path.match(regex);
            if (match) {
                const params = {};
                const keys = route.path.match(/:\w+/g) || [];
                keys.forEach((key, i) => {
                    params[key.replace(':', '')] = match[i + 1];
                });
                route.callback(params);
                return;
            }
        }

        // Route 404 (ne fait PAS de navigation pour éviter les boucles)
        const defaultRoute = this.routes.find(r => r.path === '*');
        if (defaultRoute) {
            defaultRoute.callback();
        }
    }

    /**
     * Navigue vers une URL (avec protection contre les boucles)
     * @param {string} path - Chemin vers lequel naviguer
     */
    navigateTo(path) {
        if (window.location.pathname === path) return; // Évite les boucles
        history.pushState({}, '', path);
        this.handleRouting();
    }
}

// Exporte pour les autres modules
window.Router = Router;
