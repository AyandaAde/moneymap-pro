import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import QueryProvider from "@/components/query-provider";
import { Toaster } from "sonner";

const chillax = localFont({
  src: "../public/fonts/Chillax-Variable.ttf",
  variable: "--font-chillax",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-poppins",
  preload: true,
});

export const metadata: Metadata = {
  title: "MoneyMap Pro",
  description: "Track your expenses like a pro with MoneyMap Pro.",
  openGraph: {
    title: "MoneyMap Pro",
    description: "Track your expenses like a pro with MoneyMap Pro.",
    url: "https://moneymap-pro.vercel.app",
    siteName: "MoneyMap Pro",
    images: [
      {
        url: "https://moneymap-pro.vercel.app/images/og.png",
        width: 1920,
        height: 1080,
        alt: "MoneyMap Pro",
      },
    ],
    locale: "en-US",
    type: "website",
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
  twitter: {
    title: "MoneyMap Pro",
    description: "Track your expenses like a pro with MoneyMap Pro.",
    card: "summary_large_image",
    images: "",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#7d26c9",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${poppins.className} ${chillax.variable}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              {children}
              <Toaster richColors />
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
