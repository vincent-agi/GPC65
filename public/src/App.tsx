/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { RouterProvider, useRouter } from "./router";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

// Pages
import { Home } from "./pages/Home";
import { Blog } from "./pages/Blog";
import { Article } from "./pages/Article";
import { Category } from "./pages/Category";
import { Tag } from "./pages/Tag";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Search } from "./pages/Search";
import { NotFound } from "./pages/NotFound";

const RouteResolver: React.FC = () => {
  const { routePattern } = useRouter();

  // Route routing mapping
  const renderPage = () => {
    switch (routePattern) {
      case "/":
        return <Home />;
      case "/blog":
      case "/blog/page/:page":
        return <Blog />;
      case "/article/:slug":
        return <Article />;
      case "/category/:slug":
        return <Category />;
      case "/tag/:slug":
        return <Tag />;
      case "/about":
        return <About />;
      case "/contact":
        return <Contact />;
      case "/search":
        return <Search />;
      default:
        return <NotFound />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      <Header />
      <div id="main-content-wrapper" className="flex-grow">
        {renderPage()}
      </div>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <RouteResolver />
    </RouterProvider>
  );
}
