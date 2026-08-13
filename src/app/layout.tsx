import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aether OS — Cloud IDE & Edge OS',
  description: 'Web-Based Cloud IDE & Edge Operating System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* crossOrigin attribute hata diya hai taaki CORS block na ho */}
        <Script
          src="https://copy.sh/v86/build/libv86.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="antialiased bg-black text-white">
        {children}
      </body>
    </html>
  );
}