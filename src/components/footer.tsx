import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Logo } from './icons';

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground py-10">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-6 md:grid-cols-4">
        {/* Brand / Mission */}
        <div>
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground font-headline">TourNaija</span>
          </div>
          <p className="mt-3 text-sm leading-6">
            Your AI-powered guide to the unforgettable landscapes, cultures, and
            adventures across Nigeria.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <Link href="/destinations" className="hover:text-primary">
                Destinations
              </Link>
            </li>
            <li>
              <Link href="/hotels" className="hover:text-primary">
                Hotels
              </Link>
            </li>
            <li>
              <Link href="/transport" className="hover:text-primary">
                Transport
              </Link>
            </li>
             <li>
              <Link href="/recommendations" className="hover:text-primary">
                AI Recommendations
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Resources
          </h3>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="hover:text-primary">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary">
                Contact
              </Link>
            </li>
             <li>
              <Link href="#" className="hover:text-primary">
                Blog (soon)
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary">
                FAQs (soon)
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Social */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-foreground">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/privacy" className="hover:text-primary">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-primary">
                Terms & Conditions
              </Link>
            </li>
          </ul>

          {/* Social Icons */}
          <div className="mt-6 flex space-x-4">
            <Link href="#" className="hover:text-primary">
              <Facebook />
            </Link>
            <Link href="#" className="hover:text-primary">
              <Twitter />
            </Link>
            <Link href="#" className="hover:text-primary">
              <Instagram />
            </Link>
            <Link href="#" className="hover:text-primary">
              <Linkedin />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container mx-auto mt-8 border-t border-border pt-6 text-center text-sm">
        &copy; {new Date().getFullYear()} TourNaija. All rights reserved.
      </div>
    </footer>
  );
}
