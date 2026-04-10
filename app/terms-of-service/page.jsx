import ContentPage from "@/components/layout/ContentPage";

export default function TermsOfServicePage() {
  return (
    <ContentPage
      eyebrow="Terms of Service"
      title="A simple overview of how the storefront should be used."
      intro="These terms describe the general expectations for browsing, purchasing, and managing an account through dreamtrends. They are meant to keep the shopping experience clear for both the customer and the store."
      sections={[
        {
          title: "Using the storefront",
          items: [
            "Provide accurate account and shipping details",
            "Review order information before confirming checkout",
            "Use the site only for legitimate browsing and purchases"
          ]
        },
        {
          title: "Orders and availability",
          body: "Products, pricing, stock, and promotions may change over time. Final order handling depends on availability, successful checkout completion, and operational review where needed."
        },
        {
          title: "Support and resolution",
          body: "If something goes wrong with login, checkout, or order visibility, customers should contact support with the relevant order or account details so the issue can be reviewed quickly."
        }
      ]}
    />
  );
}
