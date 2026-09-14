"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";

export default function AppLayout({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <Loader label="Loading..." />;
  }

  return (
    <div>
      <Suspense fallback={null}>
        <Navbar onMenuClick={() => setSidebarOpen((v) => !v)} />
      </Suspense>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="pt-14 lg:pl-60">
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}
