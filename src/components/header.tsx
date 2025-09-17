import Link from 'next/link';
import { Map } from 'lucide-react';
import { Button } from './ui/button';
import { Logo } from './icons';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-bold">TourNaija</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link
            href="#destinations"
            className="transition-colors hover:text-primary"
          >
            Destinations
          </Link>
          <Link
            href="#recommendations"
            className="transition-colors hover:text-primary"
          >
            Recommendations
          </Link>
          <Link href="#features" className="transition-colors hover:text-primary">
            Features
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost">Sign In</Button>
          <Button>Sign Up</Button>
        </div>
      </div>
    </header>
  );
}
