import type { Metadata } from "next";
import { Inter, Bungee_Shade } from "next/font/google";
import "./globals.css";
import 'mapbox-gl/dist/mapbox-gl.css';

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const bungeeShade = Bungee_Shade({ weight: "400", subsets: ["latin"], variable: '--font-bungee' });

export const metadata: Metadata = {
  title: "DeskBrew - Explore Remote Work Cafes",
  description: "Curated workspaces for digital nomads with real-time availability, wifi speeds, and nomad scores.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${bungeeShade.variable} font-sans antialiased bg-background text-on-background overflow-hidden overscroll-none`}>
        {children}
      </body>
    </html>
  );
}
