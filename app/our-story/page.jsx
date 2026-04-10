import ContentPage from "@/components/layout/ContentPage";

export default function OurStoryPage() {
  return (
    <ContentPage
      eyebrow="About dreamtrends"
      title="Built for everyday style and meaningful gifting."
      intro="dreamtrends brings together trend-led fashion, lifestyle, and gifting products in one easy storefront. We focus on clean discovery, honest pricing, and an experience that feels dependable from browse to delivery."
      sections={[
        {
          title: "What we curate",
          body: "Our catalog is shaped around products people actually shop for: fashion accessories, gifting picks, lifestyle staples, and standout trend pieces that still feel approachable."
        },
        {
          title: "What we care about",
          items: [
            "Clear product information and transparent pricing",
            "Fast checkout and a secure buying experience",
            "Collections that balance trend, utility, and giftability"
          ]
        },
        {
          title: "Why shoppers return",
          body: "Customers come back for a simple reason: they can discover something stylish quickly, place an order with confidence, and track everything without friction."
        }
      ]}
    />
  );
}
