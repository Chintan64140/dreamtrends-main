const FIELD_CONFIG = [
  { name: "name", label: "Full Name", type: "text", autoComplete: "name" },
  { name: "phone", label: "Phone Number", type: "tel", autoComplete: "tel" },
  { name: "line1", label: "Address Line 1", type: "text", autoComplete: "address-line1" },
  { name: "line2", label: "Address Line 2", type: "text", autoComplete: "address-line2", optional: true },
  { name: "city", label: "City", type: "text", autoComplete: "address-level2" },
  { name: "state", label: "State", type: "text", autoComplete: "address-level1" },
  { name: "pincode", label: "Pincode", type: "text", autoComplete: "postal-code" },
];

export default function AddressForm({ value, errors = {}, onChange }) {
  return (
    <section className="checkout-card">
      <div className="checkout-card-header">
        <div>
          <p className="checkout-eyebrow">Delivery details</p>
          <h2>Shipping address</h2>
        </div>
        <p className="checkout-note">We will use this address for dispatch and delivery updates.</p>
      </div>

      <div className="address-grid">
        {FIELD_CONFIG.map((field) => (
          <label
            key={field.name}
            className={field.name === "line1" || field.name === "line2" ? "field full-width" : "field"}
          >
            <span>
              {field.label}
              {field.optional ? " (optional)" : ""}
            </span>
            <input
              type={field.type}
              name={field.name}
              value={value[field.name] || ""}
              onChange={(event) => onChange(field.name, event.target.value)}
              autoComplete={field.autoComplete}
            />
            {errors[field.name] ? <small className="field-error">{errors[field.name]}</small> : null}
          </label>
        ))}
      </div>
    </section>
  );
}
