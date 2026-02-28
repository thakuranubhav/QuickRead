"use client";

import { useEffect, useState } from "react";
import { getNavLinks } from "./nav-links";
import NavbarShell from "./navbar-shell";

type SiteNavbarProps = {
  title?: string;
};

export default function SiteNavbarClient({ title = "QuickRead" }: SiteNavbarProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (!isMounted) return;
        setIsAuthenticated(Boolean(data?.authenticated));
        setIsAdmin(data?.role === "admin");
      } catch {
        if (!isMounted) return;
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };
    loadSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const navLinks = getNavLinks({ isAuthenticated, isAdmin });

  return <NavbarShell title={title} navLinks={navLinks} />;
}
