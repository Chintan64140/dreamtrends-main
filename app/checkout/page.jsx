"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import AddressForm from "@/components/checkout/AddressForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import CheckoutStepper from "@/components/checkout/Stepper";
import { useShop } from "@/context/ShopContext";

const SHIPPING_CHARGE = 0;
const CHECKOUT_STEPS = ["Cart", "Address", "Payment", "Confirm"];

const emptyAddress = {
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
};

function getCheckoutImage(item) {
  if (item?.image) return item.image;
  if (item?.images?.[0]?.url) return item.images[0].url;
  return "";
}

function validateAddress(address) {
  const nextErrors = {};

  if (!address.name.trim())
    nextErrors.name = "Please enter the recipient name.";
  if (!/^\d{10}$/.test(address.phone.trim()))
    nextErrors.phone = "Enter a valid 10-digit phone number.";
  if (!address.line1.trim()) nextErrors.line1 = "Address line 1 is required.";
  if (!address.city.trim()) nextErrors.city = "City is required.";
  if (!address.state.trim()) nextErrors.state = "State is required.";
  if (!/^\d{6}$/.test(address.pincode.trim()))
    nextErrors.pincode = "Enter a valid 6-digit pincode.";

  return nextErrors;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartCount, cartTotal, user, clearCart, authLoading, isReady } =
    useShop();
  const [address, setAddress] = useState({
    ...emptyAddress,
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setAddress((prev) => ({
      ...prev,
      name: prev.name || user?.name || "",
      phone: prev.phone || user?.phone || "",
    }));
  }, [user?.name, user?.phone]);

  const pricing = useMemo(() => {
    const subtotal = cartTotal;
    const discount = 0;
    const shipping = subtotal > 0 ? SHIPPING_CHARGE : 0;
    const total = Math.max(subtotal + shipping, 0);

    return { subtotal, discount, shipping, total };
  }, [cartTotal]);

  const handleFieldChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async () => {
    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }

    if (!cart.length) {
      setSubmitError("Your cart is empty. Add a product before checkout.");
      return;
    }

    const nextErrors = validateAddress(address);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setSubmitError(
        "Please correct the highlighted fields before placing the order.",
      );
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      const payload = {
        items: cart.map((item) => ({
          product: item._id,
          name: item.name,
          image: getCheckoutImage(item),
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          accessoriesOption: item.accessoriesOption,
        })),
        shippingAddress: {
          name: address.name.trim(),
          phone: address.phone.trim(),
          line1: address.line1.trim(),
          line2: address.line2.trim(),
          city: address.city.trim(),
          state: address.state.trim(),
          pincode: address.pincode.trim(),
        },
        pricing,
        payment: {
          method: paymentMethod,
          status: paymentMethod === "cod" ? "pending" : "paid",
        },
        notes: `Checkout placed from storefront with ${cartCount} item(s).`,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login?redirect=/checkout");
          return;
        }
        throw new Error(data.error || "Unable to place order.");
      }

      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "PlaceOrder", {
          content_ids: cart.map((item) => item._id || item.id).filter(Boolean),
          content_type: "product",
          value: pricing.total,
          currency: "INR",
        });
      }

      await clearCart();
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("lastOrderId", data.order.orderId);
      }

      const message = `Hello
I have placed Order
Here is OrderId - ${data.order.orderId}`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappLink = `https://wa.me/919586006414?text=${encodedMessage}`;
      window.open(whatsappLink, "_blank");
      router.push(`/order-confirmed/${data.order.orderId}`);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="checkout-shell">
        <div className="checkout-hero">
          <p className="checkout-eyebrow">Secure checkout</p>
          <h1>Finish your order in one clean flow.</h1>
          <p>
            Review your delivery details, confirm payment mode, and place the
            order from the same screen.
          </p>
        </div>

        <CheckoutStepper
          steps={CHECKOUT_STEPS}
          currentStep={cart.length ? 3 : 0}
        />

        {!isReady || authLoading ? (
          <section className="checkout-card">
            <h2>Preparing checkout</h2>
            <p>Loading your cart and account details...</p>
          </section>
        ) : null}

        {isReady && !user ? (
          <section className="checkout-card">
            <h2>Login required</h2>
            <p>Please login before continuing to checkout.</p>
            <button
              className="checkout-submit"
              onClick={() => router.push("/login?redirect=/checkout")}
            >
              Go to login
            </button>
          </section>
        ) : null}

        {isReady && user && !cart.length ? (
          <section className="checkout-card">
            <h2>Your cart is empty</h2>
            <p>Add at least one product to continue with checkout.</p>
            <button
              className="checkout-submit"
              onClick={() => router.push("/products")}
            >
              Browse products
            </button>
          </section>
        ) : null}

        {isReady && user && cart.length ? (
          <div className="checkout-grid">
            <div className="checkout-main">
              <AddressForm
                value={address}
                errors={errors}
                onChange={handleFieldChange}
              />
              {submitError ? (
                <p className="admin-error checkout-error">{submitError}</p>
              ) : null}
            </div>

            <OrderSummary
              cart={cart}
              pricing={pricing}
              paymentMethod={paymentMethod}
              onPaymentChange={setPaymentMethod}
              onSubmit={handleSubmit}
              submitting={submitting}
              disabled={!cart.length}
              submitLabel="Place order"
            />
          </div>
        ) : null}
      </main>
    </>
  );
}
