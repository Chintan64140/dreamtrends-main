import ContentPage from "@/components/layout/ContentPage";

export default function PrivacyPolicyPage() {
  return (
    <ContentPage
      eyebrow="Privacy Policy"
      title="How customer information is used in the storefront."
      intro="We only collect the information needed to help customers browse, log in, place orders, and manage their account activity. This page explains the general purpose behind that information flow."
      sections={[
        {
          title: "Information we use",
          items: [
            "Account details such as name, email, and phone number",
            "Shipping details needed to process orders",
            "Cart, wishlist, and order history tied to your account"
          ]
        },
        {
          title: "Why we use it",
          items: [
            "To support login and profile access",
            "To process and display orders accurately",
            "To improve storefront continuity across sessions"
          ]
        },
        {
          title: "Customer expectation",
          body: "We aim to keep data usage practical and limited to core ecommerce actions such as authentication, checkout, order handling, and support continuity."
        }
      ]}
    />
  );
}
