import ContentPage from "@/components/layout/ContentPage";

export default function ContactUsPage() {
  return (
    <ContentPage
      eyebrow="Need Help?"
      title="Reach out when you need help before or after an order."
      intro="If you have a question about a product, shipping, account access, or an existing order, contact our support team during working hours and we will guide you from there."
      sections={[
        {
          title: "Contact details",
          items: [
            "Phone: +91 9586006414",
            "Email: trendy6414@gmail.com"
          ]
        },
        {
          title: "Support hours",
          items: [
            "Monday to Saturday",
            "10:00 AM to 7:00 PM",
            "Response times may be longer during launches and sale periods"
          ]
        },
        {
          title: "Best reasons to contact us",
          items: [
            "Order status and delivery concerns",
            "Product details before buying",
            "Account, wishlist, or checkout issues"
          ]
        },
        {
          title: "What to keep ready",
          body: "For faster support, keep your order ID, registered email, and a short description of the issue ready before contacting the team."
        }
      ]}
    />
  );
}
