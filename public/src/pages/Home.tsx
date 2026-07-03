/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Link } from "../router";
import { getPosts } from "../api";
import { WPPost } from "../types";
import { PostCard } from "../components/PostCard";
import { Landmark, ArrowRight, BookOpen, Sparkles, Map, History } from "lucide-react";
import { motion } from "motion/react";

export const Home: React.FC = () => {
  const [featuredPosts, setFeaturedPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadFeatured = async () => {
      try {
        const posts = await getPosts();
        if (active) {
          // Take the latest 3 posts
          setFeaturedPosts(posts.slice(0, 3));
        }
      } catch (e) {
        console.error("Could not load featured posts", e);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadFeatured();
    return () => { active = false; };
  }, []);

  return (
    <div id="home-page" className="w-full">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-24 sm:py-32 overflow-hidden">
        {/* Background Image overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80"
            alt="High Pyrenees mountain landscape"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/80 to-slate-900" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold font-display uppercase tracking-wider mb-6"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>GPC 65 préserve notre histoire depuis 1985</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none"
          >
            Voyager hors du temps à <span className="text-blue-400">Cadéac</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mt-6 leading-relaxed"
          >
            L'association du patrimoine culturel GPC65 recherche, documente et préserve les sites anciens, les monuments romans et les cultures orales des Pyrénées.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <Link
              to="/blog"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-display font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group focus:outline-none"
            >
              <span>Explorer notre Blog</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-display font-bold text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-white transition-all flex items-center justify-center gap-2 focus:outline-none"
            >
              <span>Notre parcours</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Core Activities / Grid Section */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Nos piliers fondamentaux de la conservation
            </h2>
            <p className="text-slate-500 mt-4 leading-relaxed">
              Nous nous concentrons sur des campagnes de préservation active, la cartographie historique et la sensibilisation communautaire afin de faire vivre les récits de nos ancêtres montagnards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-start hover:shadow-md transition-shadow">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-700 mb-6">
                <History className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-3">
                Recherches historiques
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                L'analyse de siècles d'archives paroissiales, d'anciens registres de commerce et de documents architecturaux pour compiler une histoire complète de la vie à Cadéac.
              </p>
              <Link to="/about" className="text-sm font-bold font-display text-blue-600 hover:text-blue-700 flex items-center gap-1.5 mt-auto">
                <span>Découvrez nos méthodes</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-start hover:shadow-md transition-shadow">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700 mb-6">
                <Landmark className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-3">
                Conservation de la pierre
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Le maintien actif des tours de guet romanes, des systèmes traditionnels de murs en pierres sèches et des maisons historiques en utilisant de l'ardoise brute de montagne et de la chaux.
              </p>
              <Link to="/blog" className="text-sm font-bold font-display text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 mt-auto">
                <span>Consultez les dernières mises à jour du projet</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-start hover:shadow-md transition-shadow">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-700 mb-6">
                <Map className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-3">
                Intégration communautaire
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Organisation de symposiums saisonniers, animation d'ateliers de cartographie et enseignement des arts traditionnels pyrénéens tels que le tissage sur métier à tisser et la construction en pierre sèche.
              </p>
              <Link to="/contact" className="text-sm font-bold font-display text-amber-600 hover:text-amber-700 flex items-center gap-1.5 mt-auto">
                <span>Rejoignez notre prochaine campagne</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 sm:mb-16 gap-4">
            <div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                Derniers bulletins de conservation
              </h2>
              <p className="text-slate-500 mt-2 leading-relaxed max-w-2xl">
                Lisez les rapports de terrain et les articles rédigés directement par nos historiens, archéologues et chefs de projet.
              </p>
            </div>
            <Link
              to="/blog"
              className="px-5 py-2.5 rounded-xl font-display font-bold text-sm bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-all flex items-center gap-2 group shrink-0 focus:outline-none"
            >
              <span>Voir toutes les publications</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-slate-50 animate-pulse rounded-2xl h-96 border border-slate-100" />
              ))}
            </div>
          ) : featuredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">Aucun journal chargé pour le moment. Revenez bientôt !</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA / Membership Section */}
      <section className="py-16 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            Devenez un gardien de l'histoire pyrénéenne
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            L'association GPC65 fonctionne grâce à la passion du public. Que vous résidiez dans la vallée d'Aure ou que vous appréciez la préservation historique à distance, votre implication fait une différence tangible.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl font-display font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 transition-all focus:outline-none"
            >
              Devenez bénévole
            </Link>
            <Link
              to="/about"
              className="px-6 py-3 rounded-xl font-display font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 transition-all focus:outline-none"
            >
              Consultez notre charte
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
