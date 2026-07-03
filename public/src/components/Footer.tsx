/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link } from "../router";
import { Landmark, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer id="site-footer" className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Logo & Mission */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2 group focus:outline-none">
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md transition-transform duration-300 group-hover:scale-105">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <span className="font-display font-black text-lg text-white tracking-tight leading-none block">
                  GPC65
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 leading-none mt-1 block">
                  Guêt Patrimoine Caducéen
                </span>
              </div>
            </Link>
            
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">
              Explorer
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  A propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <span>Mairie de Cadéac, Grand Rue, 65240 Cadéac, France</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-blue-500 shrink-0" />
                <a href="mailto:contact@gpc65.org" className="hover:text-white transition-colors">
                  contact@gpc65.org
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-blue-500 shrink-0" />
                <a href="tel:+33562986500" className="hover:text-white transition-colors">
                  +33 5 62 98 65 00
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Social media & newsletter */}
          <div>
            <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">
              Rester avec nous
            </h3>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Restez informé de nos recherches archéologiques saisonnières et de nos ateliers de préservation.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-400 transition-colors"
                aria-label="Facebook page"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800 hover:bg-sky-500 hover:text-white text-slate-400 transition-colors"
                aria-label="Twitter account"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800 hover:bg-pink-600 hover:text-white text-slate-400 transition-colors"
                aria-label="Instagram account"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 transition-colors"
                aria-label="YouTube channel"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Guêt Patrimoine Caducéen. Tous droits réservés</p>
          <div className="flex gap-4">
            <span className="text-slate-600">|</span>
            <span className="font-mono text-[10px]">Cadéac, Pyrenees, France</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
