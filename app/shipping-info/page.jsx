import ContentPage from "@/components/layout/ContentPage";

export default function ShippingInfoPage() {
  return (
    <ContentPage
      eyebrow="Delivery Details"
      title="Shipping information that keeps expectations clear."
      intro="We aim to keep checkout simple and delivery predictable. Timelines can vary by location and availability, but we always try to make dispatch and updates easy to follow."
      sections={[
        {
          title: "Processing timeline",
          items: [
            "Orders are usually prepared within 1-2 business days",
            "High-demand launches can take a little longer to dispatch",
            "Tracking details are shared once the shipment is packed"
          ]
        },
        {
          title: "Delivery coverage",
          body: "We support pan-India delivery for most serviceable pin codes. Final availability depends on courier support in your area and stock readiness for the selected product."
        },
        {
          title: "Before you place an order",
          items: [
            "Double-check your shipping address and phone number",
            "Use an active email for order and delivery updates",
            "Review product availability during checkout"
          ]
        }
      ]}
    />
  );
}
