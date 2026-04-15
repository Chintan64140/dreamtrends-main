import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";
import ProgressBarProvider from "@/components/layout/ProgressbarProvider";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"]
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"]
});

export const metadata = {
  title: "dreamtrends",
  description: "dreamtrends storefront built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <Suspense>
          <ProgressBarProvider>
            <ShopProvider>
              {children}
              <Footer />
            </ShopProvider>
          </ProgressBarProvider>
        </Suspense>
      </body>
    </html>
  );
}
