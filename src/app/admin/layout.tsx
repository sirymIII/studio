'use client';
import { AdminSidebar } from '@/components/admin-sidebar';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const ADMIN_EMAIL = 'mukhtar6369@bazeuniversity.edu.ng';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If auth state is done loading and there's no user, or the user is not the admin, redirect.
    if (!isUserLoading && (!user || user.email !== ADMIN_EMAIL)) {
      router.replace('/signin');
    }
  }, [user, isUserLoading, router]);

  // While checking the user's auth state, show a loader.
  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If the user is the admin, render the layout.
  // This check prevents a brief flash of the admin content for non-admin users.
  if (user && user.email === ADMIN_EMAIL) {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <AdminSidebar />
        <div className="flex flex-col">
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // This will be shown to non-admins before the redirect kicks in,
  // or if the redirect somehow fails.
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
