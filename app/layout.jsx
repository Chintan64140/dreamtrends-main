import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "dreamtrends",
  description: "dreamtrends storefront built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ShopProvider>
          {children}
          <Footer />
        </ShopProvider>
      </body>
    </html>
  );
}
