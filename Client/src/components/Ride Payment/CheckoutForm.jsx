import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";

export default function CheckoutForm(props) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
    
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occured.");
    }

    setIsProcessing(false);
  };

  return (
    <form  onSubmit={handleSubmit}>
      <PaymentElement  />
      <button  disabled={isProcessing || !stripe || !elements} >
        <span >
          {isProcessing ? "Processing ... " : "Pay now"}
        </span>
      </button>
      <button onClick={(e)=>{ e.preventDefault(); props.onCancel(); }}>Cancel</button>

      {/* Show any error or success messages */}
      {message && <div >{message}</div>}
    </form>
  );
}