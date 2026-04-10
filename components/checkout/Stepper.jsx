export default function CheckoutStepper({ steps = [], currentStep = 0 }) {
  return (
    <div className="checkout-stepper" aria-label="Checkout progress">
      {steps.map((step, index) => {
        const status =
          index < currentStep ? "done" : index === currentStep ? "current" : "upcoming";

        return (
          <div key={step} className={`step-chip ${status}`}>
            <span>{index + 1}</span>
            <strong>{step}</strong>
          </div>
        );
      })}
    </div>
  );
}
