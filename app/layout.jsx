import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";
import ProgressBarProvider from "@/components/layout/ProgressbarProvider";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";

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
    <head>
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '984237730626945');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <noscript>
  <img
    height="1"
    width="1"
    style={{ display: "none" }}
    src="https://www.facebook.com/tr?id=984237730626945&ev=PageView&noscript=1"
  />
</noscript>
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
