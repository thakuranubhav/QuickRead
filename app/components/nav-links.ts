export type NavLink = {
  href: string;
  label: string;
};

export function getNavLinks({
  isAuthenticated,
  isAdmin,
}: {
  isAuthenticated: boolean;
  isAdmin: boolean;
}): NavLink[] {
  const baseLinks: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/news", label: "News" },
    { href: "/blogs", label: "Blogs" },
    { href: "/aqi", label: "Check AQI" },
    { href: "/contact", label: "Contact Us" },
  ];

  if (!isAuthenticated) {
    return [...baseLinks, { href: "/login", label: "Login" }];
  }

  if (isAdmin) {
    return [
      ...baseLinks,
      { href: "/upload-blog", label: "Upload Blog" },
      { href: "/admin", label: "Admin" },
      { href: "/logout", label: "Logout" },
    ];
  }

  return [...baseLinks, { href: "/logout", label: "Logout" }];
}
