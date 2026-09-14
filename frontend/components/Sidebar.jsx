"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const USER_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/blogs", label: "My Blogs" },
  { href: "/dashboard/blogs/create", label: "Create Blog" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/change-password", label: "Change Password" },
];

const ADMIN_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/blogs", label: "All Blogs" },
  { href: "/dashboard/blogs/create", label: "Create Blog" },
  { href: "/admin/users", label: "Users" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/change-password", label: "Change Password" },
];

// Picks the single most specific link for the current path — e.g. on
// /dashboard/blogs/create, "Create Blog" (longer href) wins over
// "My Blogs" even though both hrefs are prefixes of the path.
function findActiveHref(links, pathname) {
  let best = null;
  for (const link of links) {
    const matches = pathname === link.href || pathname.startsWith(`${link.href}/`);
    if (matches && (!best || link.href.length > best.length)) {
      best = link.href;
    }
  }
  return best;
}

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  const { role, logout } = useAuth();
  const links = role === "admin" ? ADMIN_LINKS : USER_LINKS;
  const activeHref = findActiveHref(links, pathname);

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 transform border-r border-gray-200 bg-white pt-14 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex h-full flex-col gap-1 overflow-y-auto p-4">
          {links.map((link) => {
            const active = link.href === activeHref;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`rounded px-3 py-2 text-sm font-medium ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <button
            onClick={logout}
            className="mt-auto rounded px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
