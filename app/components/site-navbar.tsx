import { cookies } from "next/headers";
import { getNavLinks } from "./nav-links";
import NavbarShell from "./navbar-shell";
import { verifyAuthToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

type SiteNavbarProps = {
  title?: string;
};

export default async function SiteNavbar({ title = "QuickRead" }: SiteNavbarProps) {
  const token = (await cookies()).get("auth_token")?.value;
  let isAuthenticated = false;
  let isAdmin = false;

  if (token) {
    try {
      const payload = await verifyAuthToken(token);
      isAuthenticated = true;
      await connectToDatabase();
      const user = await User.findById(payload.sub).lean();
      isAdmin = user?.role === "admin";
    } catch {
      isAuthenticated = false;
      isAdmin = false;
    }
  }

  const navLinks = getNavLinks({ isAuthenticated, isAdmin });

  return <NavbarShell title={title} navLinks={navLinks} />;
}
