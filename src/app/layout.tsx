import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';

export const metadata: Metadata = {
  title: 'Crust & Ember | Artisanal Wood-Fired Pizzeria',
  description:
    'Wood-fired Neapolitan pizza fermented for 72 hours and blistered at 900°F over white oak embers. Custom craft pizza builder, live order tracking, and seasonal sides.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-charcoal-950 text-cream-100 antialiased selection:bg-ember-600 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <CartDrawer />
        <Footer />
      </body>
    </html>
  );
}
