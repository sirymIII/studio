
'use client';

import Link from 'next/link';
import { LogOut, User as UserIcon, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Logo } from './icons';
import { useAuth, useUser } from '@/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';
import { useRouter } from 'next/navigation';

const ADMIN_EMAIL = 'mukhtar6369@bazeuniversity.edu.ng';

export function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/');
  };
  
  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-bold">TourNaija</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link
            href="/destinations"
            className="transition-colors hover:text-primary"
          >
            Destinations
          </Link>
          <Link
            href="/hotels"
            className="transition-colors hover:text-primary"
          >
            Hotels
          </Link>
           <Link
            href="/itinerary"
            className="transition-colors hover:text-primary"
          >
            Itinerary Planner
          </Link>
          <Link
            href="/transport"
            className="transition-colors hover:text-primary"
          >
            Transport
          </Link>
          <Link
            href="/recommendations"
            className="transition-colors hover:text-primary"
          >
            Recommendations
          </Link>
          <Link href="/about" className="transition-colors hover:text-primary">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {isUserLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.photoURL || undefined}
                      alt={user.displayName || 'User'}
                    />
                    <AvatarFallback>
                      <UserIcon className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {isAdmin ? 'Admin' : (user.displayName || 'My Account')}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
