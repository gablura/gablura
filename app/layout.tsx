import type { Metadata } from "next";
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

const siteUrl = "https://gablura-org.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Gablura — Open source infrastructure for developers",
    template: "%s — Gablura",
  },
  description:
    "Open source infrastructure for developers — packages, SDKs, tools, and projects built for modern full-stack development.",
  keywords: [
    "open source",
    "developer tools",
    "npm packages",
    "SDKs",
    "TypeScript",
    "full-stack",
    "web development",
    "Gablura",
  ],
  authors: [{ name: "Gablura" }],
  creator: "Gablura",
  publisher: "Gablura",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Gablura",
    title: "Gablura — Open source infrastructure for developers",
    description:
      "Open source infrastructure for developers — packages, SDKs, tools, and projects built for modern full-stack development.",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Gablura — Open source infrastructure for developers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gablura — Open source infrastructure for developers",
    description:
      "Open source infrastructure for developers — packages, SDKs, tools, and projects built for modern full-stack development.",
    images: [`${siteUrl}/opengraph-image`],
    creator: "@gablura",
  },
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/logo.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/logo.png",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
