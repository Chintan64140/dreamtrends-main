export default function OrderSummary({
  cart = [],
  pricing,
  paymentMethod,
  onPaymentChange,
  onSubmit,
  submitting = false,
  disabled = false,
  submitLabel = "Place order",
}) {
  return (
    <aside className="checkout-card summary-card">
      <div className="checkout-card-header">
        <div>
          <p className="checkout-eyebrow">Review</p>
          <h2>Order summary</h2>
        </div>
      </div>

      <div className="summary-items">
        {cart.map((item) => (
          <div key={item.cartItemId || item._id} className="summary-item">
            <div>
              <p>{item.name}</p>
              <small>
                Qty {item.quantity} x Rs. {item.price}
              </small>
              <small>Size: {(item.selectedSize || "FREESIZE").toUpperCase()}</small>
              <small>
                {item.accessoriesOption === "with" ? "With ACCESSORIES" : "Without ACCESSORIES"}
              </small>
            </div>
            <strong>Rs. {item.quantity * item.price}</strong>
          </div>
        ))}
      </div>

      <div className="payment-box">
        <p className="section-label">Payment method</p>
        <label className={`payment-option ${paymentMethod === "cod" ? "active" : ""}`}>
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={(event) => onPaymentChange(event.target.value)}
          />
          <span>Cash on delivery</span>
        </label>
        <label className={`payment-option ${paymentMethod === "card" ? "active" : ""}`}>
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === "card"}
            onChange={(event) => onPaymentChange(event.target.value)}
          />
          <span>Card payment on delivery handoff</span>
        </label>
      </div>

      <div className="summary-totals">
        <div>
          <span>Subtotal</span>
          <strong>Rs. {pricing.subtotal}</strong>
        </div>
        <div>
          <span>Discount</span>
          <strong>- Rs. {pricing.discount}</strong>
        </div>
        <div>
          <span>Shipping</span>
          <strong>{pricing.shipping === 0 ? "Free" : `Rs. ${pricing.shipping}`}</strong>
        </div>
        <div className="grand-total">
          <span>Total</span>
          <strong>Rs. {pricing.total}</strong>
        </div>
      </div>

      <button className="checkout-submit" onClick={onSubmit} disabled={disabled || submitting}>
        {submitting ? "Placing order..." : submitLabel}
      </button>
    </aside>
  );
}
