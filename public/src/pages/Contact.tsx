/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Mail, Phone, MapPin, CheckCircle, AlertCircle, Send, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Votre nom est obligatoire";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Entrer une adresse email valide";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message cannot be empty.";
    } else if (formData.message.trim().length < 15) {
      newErrors.message = "Votre message doit faire au moins 15 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    // Simulate API database delivery
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    }, 1200);
  };

  return (
    <div id="contact-page" className="w-full bg-white">
      <Breadcrumbs items={[{ label: "Nous contacter" }]} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
          
          {/* Column 1: Contact Details & Info (5 columns) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                Entrez en contact avec nous
              </h1>
              <p className="text-sm text-slate-500 mt-4 leading-relaxed">
                Vous avez des questions sur les monuments historiques de Cadéac ? Vous souhaitez partager de vieilles photos de famille ou devenir bénévole pour nos prochains chantiers de rejointoiement en pierre sèche ? Nous serions ravis d'échanger avec vous.
              </p>
            </div>

            {/* Quick Details List */}
            <ul className="space-y-6">
              <li className="flex gap-4 items-start">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shadow-sm shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-sm">Siège</h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                    Mairie de Cadéac, Grand Rue, 65240 Cadéac, France
                  </p>
                </div>
              </li>

              <li className="flex gap-4 items-start">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shadow-sm shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-sm">Adresse email</h4>
                  <a href="mailto:contact@gpc65.org" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-semibold mt-1 block">
                    contact@gpc65.org
                  </a>
                </div>
              </li>

              <li className="flex gap-4 items-start">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shadow-sm shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-sm">Téléphone</h4>
                  <a href="tel:+33562986500" className="text-xs sm:text-sm text-slate-700 hover:text-blue-600 font-semibold mt-1 block">
                    +33 5 62 98 65 00
                  </a>
                </div>
              </li>

              <li className="flex gap-4 items-start">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shadow-sm shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-sm">Ouverture</h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Lundi – Vendredi: 9:00 – 19:00
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 2: Interactive Form (7 columns) */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 tracking-tight mb-6">
              Envoyer une demande
            </h2>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center"
                >
                  <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="font-display font-bold text-lg text-slate-900"> Message envoyé !</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed max-w-md mx-auto">
                    Merci de contacter l'Association du Patrimoine GPC65 ! L'un de nos responsables historiques ou administrateurs répondra à votre demande par e-mail sous peu.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-xs rounded-xl transition-all shadow-sm focus:outline-none"
                  >
                    Envoyer un autre message
                  </button>
                </motion.div>
              ) : (
                <motion.form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* Name field */}
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                      Votre nom et prénom
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Jean Larrouy"
                      className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                        errors.name ? "border-rose-400 bg-rose-50/20" : "border-slate-200 bg-white"
                      }`}
                    />
                    {errors.name && (
                      <span className="flex items-center gap-1 text-xs text-rose-600 font-medium mt-1.5">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.name}</span>
                      </span>
                    )}
                  </div>

                  {/* Email field */}
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                      Adresse email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. jean@example.com"
                      className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                        errors.email ? "border-rose-400 bg-rose-50/20" : "border-slate-200 bg-white"
                      }`}
                    />
                    {errors.email && (
                      <span className="flex items-center gap-1 text-xs text-rose-600 font-medium mt-1.5">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </span>
                    )}
                  </div>

                  {/* Message field */}
                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Entrer votre message ..."
                      className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                        errors.message ? "border-rose-400 bg-rose-50/20" : "border-slate-200 bg-white"
                      }`}
                    />
                    {errors.message && (
                      <span className="flex items-center gap-1 text-xs text-rose-600 font-medium mt-1.5">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.message}</span>
                      </span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-display font-bold text-sm rounded-xl shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none focus:outline-none"
                  >
                    {submitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Envoi en cours ...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Envoyer votre Message</span>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Google Maps Section */}
        <section className="mt-16 sm:mt-24">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="font-display font-bold text-xl text-slate-900">Où nous trouver</h3>
            <p className="text-sm text-slate-500 mt-2">
              Visitez nos bureaux dans l'hôtel de ville historique de Cadéac, dans les Hautes-Pyrénées.
            </p>
          </div>
          <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden border border-slate-150 shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2925.326880313437!2d0.301540375990234!3d42.85542847115132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a81878d6ee5c69%3A0x406f69c2f3ecc00!2s65240%20Cad%C3%A9ac%2C%20France!5e0!3m2!1sen!2sus!4v1720042456000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="GPC65 Headquarters location in Cadéac, France"
              id="google-maps-frame"
            />
          </div>
        </section>
      </main>
    </div>
  );
};
