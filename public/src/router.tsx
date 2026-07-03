/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";

interface RouterContextType {
  currentPath: string;
  navigate: (path: string, options?: { replace?: boolean }) => void;
  routePattern: string;
  params: Record<string, string>;
  searchParams: URLSearchParams;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

const routeDefs = [
  { pattern: "/blog/page/:page", regex: /^\/blog\/page\/([^/]+)$/ },
  { pattern: "/article/:slug", regex: /^\/article\/([^/]+)$/ },
  { pattern: "/category/:slug", regex: /^\/category\/([^/]+)$/ },
  { pattern: "/tag/:slug", regex: /^\/tag\/([^/]+)$/ },
  { pattern: "/about", regex: /^\/about$/ },
  { pattern: "/contact", regex: /^\/contact$/ },
  { pattern: "/search", regex: /^\/search$/ },
  { pattern: "/blog", regex: /^\/blog$/ },
  { pattern: "/", regex: /^\/$/ },
];

function matchRoute(path: string) {
  for (const route of routeDefs) {
    const match = path.match(route.regex);
    if (match) {
      const keys: string[] = [];
      const parts = route.pattern.split("/");
      parts.forEach((part) => {
        if (part.startsWith(":")) {
          keys.push(part.substring(1));
        }
      });
      
      const params: Record<string, string> = {};
      keys.forEach((key, index) => {
        params[key] = decodeURIComponent(match[index + 1]);
      });

      return {
        pattern: route.pattern,
        params,
      };
    }
  }

  return {
    pattern: "/404",
    params: {},
  };
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSearchParams(new URLSearchParams(window.location.search));
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("popstate", handlePopState);
    
    // Custom event for programmatic navigation in SPA
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      setSearchParams(new URLSearchParams(window.location.search));
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("navchange", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("navchange", handleLocationChange);
    };
  }, []);

  const navigate = (path: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      window.history.replaceState(null, "", path);
    } else {
      window.history.pushState(null, "", path);
    }
    const navEvent = new CustomEvent("navchange");
    window.dispatchEvent(navEvent);
  };

  const { pattern, params } = matchRoute(currentPath);

  return (
    <RouterContext.Provider
      value={{
        currentPath,
        navigate,
        routePattern: pattern,
        params,
        searchParams,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return context;
};

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
}

export const Link: React.FC<LinkProps> = ({ to, replace, children, onClick, ...props }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);

    // Let the browser handle standard modifier keys (Ctrl+Click, etc.)
    if (
      !e.defaultPrevented &&
      e.button === 0 && // Left click only
      (!props.target || props.target === "_self") && // No external target
      !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) // No modifiers
    ) {
      e.preventDefault();
      navigate(to, { replace });
    }
  };

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};
