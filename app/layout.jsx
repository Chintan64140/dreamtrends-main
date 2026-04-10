import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";
import ProgressBarProvider from "@/components/layout/ProgressbarProvider";

export const metadata = {
  title: "dreamtrends",
  description: "dreamtrends storefront built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
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
