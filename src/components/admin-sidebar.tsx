'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MapPin, Bed, Users } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Logo } from './icons';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/destinations', label: 'Destinations', icon: MapPin },
    { href: '/admin/hotels', label: 'Hotels', icon: Bed },
    { href: '/admin/users', label: 'Users', icon: Users },
  ];

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="flex items-center gap-2 p-4">
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-bold group-data-[collapsible=icon]:hidden">
            TourNaija
          </span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Link href="/" passHref legacyBehavior>
            <SidebarMenuButton>
              <Home />
              <span>Back to site</span>
            </SidebarMenuButton>
          </Link>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
