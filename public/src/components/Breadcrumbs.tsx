/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link } from "../router";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumbs" className="py-3 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-100 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex items-center flex-wrap gap-1.5 text-slate-500 font-medium">
        <Link
          to="/"
          className="flex items-center gap-1 text-slate-600 hover:text-blue-700 transition-colors focus:outline-none"
        >
          <Home className="h-3.5 w-3.5" />
          <span className="sr-only">Accueil</span>
        </Link>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />
              {isLast || !item.path ? (
                <span className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-[300px]" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-slate-600 hover:text-blue-700 transition-colors focus:outline-none"
                >
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
