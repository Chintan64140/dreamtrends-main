import ContentPage from "@/components/layout/ContentPage";

export default function SecureCheckoutPage() {
  return (
    <ContentPage
      eyebrow="Checkout Confidence"
      title="A secure checkout flow designed to feel trustworthy."
      intro="We built the storefront to make account access, cart handling, checkout, and order confirmation flow together cleanly. The goal is simple: less confusion, more confidence while you pay."
      sections={[
        {
          title: "What makes checkout safer",
          items: [
            "Authenticated customer sessions for account-based actions",
            "Server-side order validation before confirmation",
            "Clear order summaries before payment or cash-on-delivery selection"
          ]
        },
        {
          title: "What you should review",
          items: [
            "Product quantity and final total",
            "Shipping address and contact details",
            "Selected payment method before placing the order"
          ]
        },
        {
          title: "After payment",
          body: "Once the order is confirmed, you can review it from your account and use the confirmation flow to track what was placed. This keeps your purchase record easy to access after checkout."
        }
      ]}
    />
  );
}
