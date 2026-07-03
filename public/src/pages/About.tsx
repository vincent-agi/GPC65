/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link } from "../router";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Award, Shield, Users, Heart } from "lucide-react";
import { motion } from "motion/react";

export const About: React.FC = () => {
  const team = [
    {
      name: "Jean-Pierre Sere",
      role: "Président et architecte historique",
      bio: "Avec plus de 30 ans d'expérience dans la restauration de maçonnerie, Jean-Pierre dirige nos projets de préservation architecturale et nos ateliers de rejointoiement en pierre sèche dans la vallée d'Aure.",
      initials: "JS"
    },
    {
      name: "Dr. Clara Montagne",
      role: "Archéologue principale et chercheuse",
      bio: "Le Dr Montagne a supervisé des fouilles majeures dans les Pyrénées, se concentrant sur les systèmes de bains thermaux gallo-romains et les carrefours commerciaux médiévaux.",
      initials: "CM"
    },
    {
      name: "Marie-Amélie Larrouy",
      role: "Directrice du rayonnement culturel",
      bio: "Originaire de Cadéac, Marie-Amélie dirige nos entretiens d'histoire orale avec les personnes âgées et enseigne les techniques de tissage pyrénéen sur métier à tisser.",
      initials: "ML"
    }
  ];

  const milestones = [
    { year: "1985", title: "Fondation", desc: "Une poignée de bénévoles locaux a créé GPC65 pour empêcher la démolition de l'ancien moulin à farine municipal." },
    { year: "1998", title: "L'inventaire roman", desc: "Notre équipe de recherche a terminé le premier inventaire numérique et architectural des chapelles romanes de la vallée." },
    { year: "2012", title: "Lancement des archives orales", desc: "Début de l'enregistrement audio systématique des bergers âgés, préservant ainsi des mémoires linguistiques et agricoles pyrénéennes inestimables." },
    { year: "2026", title: "Campagne de la tour de guet médiévale", desc: "Lancement de notre plus grande campagne structurelle pour sécuriser et rejointoyer la tour du XIIe siècle de Cadéac." }
  ];

  return (
    <div id="about-association-page" className="w-full bg-white">
      <Breadcrumbs items={[{ label: "A propos" }]} />

      {/* Hero Banner Section */}
      <section className="relative bg-slate-900 text-white py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=1200&q=80"
            alt="Old stone French village streets"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold font-display uppercase tracking-widest text-blue-400 block mb-3">
            QUI SOMMES-NOUS ET QUE PROTÉGEONS-NOUS
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
            Préserver l'âme des vallées pyrénéennes
          </h1>
          <p className="text-slate-300 mt-4 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            L'association du patrimoine culturel GPC65 est un groupe à but non lucratif composé de chercheurs, de résidents locaux et de passionnés d'artisanat travaillant à Cadéac pour défendre l'histoire régionale.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mb-6">
              Notre mission
            </h2>
            <div className="space-y-6 text-sm sm:text-base text-slate-600 leading-relaxed">
              <p>
                Fondée en 1985 dans le pittoresque village de montagne de Cadéac, l'association GPC65 est née d'un besoin critique de sauvegarder des chapelles romanes en décrépitude, des tours de guet d'altitude et des sentiers agricoles. Nous croyons que les structures physiques et les traditions orales sont les deux piliers de l'identité culturelle.
              </p>
              <p>
                En travaillant en étroite collaboration avec les conseils municipaux, les historiens de l'architecture et des bénévoles passionnés, nous menons des recherches scientifiques, organisons des campagnes de pointage physique et maintenons une archive numérique moderne de l'histoire de la vallée.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="flex gap-2.5 items-start">
                <Shield className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Honnêteté</h4>
                  <p className="text-xs text-slate-500 mt-1">Approvisionnement local en matériaux et utilisation de techniques ancestrales.</p>
                </div>
              </div>
              <div className="flex gap-2.5 items-start">
                <Users className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Communauté ouverte</h4>
                  <p className="text-xs text-slate-500 mt-1">Inviter le public à participer à chaque phase de recherche et de maçonnerie.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1599827551410-b9dfba366fb5?auto=format&fit=crop&w=800&q=80"
                alt="Preservation masonry work"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white rounded-2xl p-6 shadow-xl hidden sm:block max-w-[240px]">
              <Award className="h-8 w-8 text-blue-200 mb-2" />
              <h4 className="font-display font-bold text-base">Prix du patrimoine national</h4>
              <p className="text-xs text-blue-100 mt-1">Décerné en 2024 pour la préservation architecturale en Occitanie.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Notre parcours de préservation
            </h2>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Quarante années de campagnes de cartographie historique et de conservation menées par des bénévoles.
            </p>
          </div>

          <div className="relative border-l-2 border-slate-200 max-w-3xl mx-auto pl-6 sm:pl-8 space-y-10">
            {milestones.map((m, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1 h-5 w-5 rounded-full border-4 border-white bg-blue-600 shadow-sm" />
                <span className="font-display font-black text-xl text-blue-600 leading-none">
                  {m.year}
                </span>
                <h3 className="font-display font-bold text-base text-slate-900 mt-1 mb-2">
                  {m.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Board Grid */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Nos responsables de recherche et de projets
          </h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Conduite d'études de terrain, diagnostics architecturaux et cours communautaires.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {team.map((t, index) => (
            <div key={index} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 text-white font-display font-black text-xl flex items-center justify-center shadow-inner mb-4">
                {t.initials}
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 mb-1">
                {t.name}
              </h3>
              <span className="text-xs font-bold font-display text-blue-600 uppercase tracking-wide block mb-3">
                {t.role}
              </span>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Support Us Banner */}
      <section className="bg-slate-950 text-white py-16 relative overflow-hidden border-t border-slate-800">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-10 w-10 text-rose-500 mx-auto mb-4 animate-pulse" />
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Soutenez nos efforts de préservation
          </h2>
          <p className="text-slate-400 mt-3 text-sm leading-relaxed max-w-xl mx-auto">
            Vos généreuses contributions financent directement les approvisionnements en chaux régionale, les échafaudages de sécurité, les publications de recherche et les archives publiques gratuites.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/contact"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-display font-bold text-sm rounded-xl transition-all shadow-md focus:outline-none"
            >
              Contactez-nous pour nous rejoindre
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
