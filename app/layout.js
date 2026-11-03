import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: { default: "MovieHawk", template: "%s · MovieHawk" },
  description: "Movies and series from HDHub4u, 4KHDHub, Vegamovies and RogMovies, down to their downloads.",
};

// Dark only: posters read best on it. The light tokens stay in globals.css for a toggle later.
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b">
          <div className="mx-auto flex h-14 w-full max-w-7xl items-center px-4">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Movie<span className="text-primary">Hawk</span>
            </Link>
          </div>
        </header>
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
