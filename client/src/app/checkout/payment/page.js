// "use client";

// import { useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";

// import { authenticatedRequest } from "@/lib/api";
// import { getAccessToken } from "@/lib/auth";

// export default function PaymentPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const orderId = searchParams.get("orderId");

//   const [payment, setPayment] = useState(null);
//   const [paying, setPaying] = useState(false);
//   const [error, setError] = useState("");

//   function loadRazorpayScript() {
//     return new Promise((resolve) => {
//       if (window.Razorpay) {
//         resolve(true);
//         return;
//       }

//       const script = document.createElement("script");

//       script.src =
//         "https://checkout.razorpay.com/v1/checkout.js";

//       script.onload = () => {
//         resolve(true);
//       };

//       script.onerror = () => {
//         resolve(false);
//       };

//       document.body.appendChild(script);
//     });
//   }

//   async function handlePayment() {
//     try {
//       setPaying(true);
//       setError("");

//       // Check order ID
//       if (!orderId) {
//         throw new Error("Order ID is missing");
//       }

//       // Check login
//       const token = getAccessToken();

//       if (!token) {
//         router.push("/login");
//         return;
//       }

//       // Load Razorpay
//       const scriptLoaded =
//         await loadRazorpayScript();

//       if (!scriptLoaded) {
//         throw new Error(
//           "Failed to load Razorpay checkout"
//         );
//       }

//       // Create Razorpay order
//       const data =
//         await authenticatedRequest(
//           "/payments",
//           {
//             method: "POST",
//             body: JSON.stringify({
//               orderId: Number(orderId),
//             }),
//           }
//         );

//       const paymentData =
//         data.payment || data.data;

//       if (!paymentData) {
//         throw new Error(
//           "Payment information not received"
//         );
//       }

//       setPayment(paymentData);

//       const options = {
//         key: paymentData.keyId,

//         amount: Math.round(
//           Number(paymentData.amount) * 100
//         ),

//         currency:
//           paymentData.currency || "INR",

//         name: "ScaleCart",

//         description:
//           "ScaleCart Order Payment",

//         order_id:
//           paymentData.razorpayOrderId,

//         handler: async function (response) {
//           try {
//             setPaying(true);
//             setError("");

//             const verifyData =
//               await authenticatedRequest(
//                 "/payments/verify",
//                 {
//                   method: "POST",

//                   body: JSON.stringify({
//                     razorpay_order_id:
//                       response.razorpay_order_id,

//                     razorpay_payment_id:
//                       response.razorpay_payment_id,

//                     razorpay_signature:
//                       response.razorpay_signature,
//                   }),
//                 }
//               );

//             if (!verifyData.success) {
//               throw new Error(
//                 verifyData.message ||
//                   "Payment verification failed"
//               );
//             }

//             router.push(
//               `/checkout/success?orderId=${orderId}`
//             );
//           } catch (error) {
//             console.error(
//               "Payment verification error:",
//               error
//             );

//             setError(
//               error.message ||
//                 "Payment verification failed"
//             );

//             setPaying(false);
//           }
//         },

//         modal: {
//           ondismiss: function () {
//             setPaying(false);
//           },
//         },

//         theme: {
//           color: "#000000",
//         },
//       };

//       const razorpay =
//         new window.Razorpay(options);

//       razorpay.on(
//         "payment.failed",
//         function (response) {
//           console.error(
//             "Payment failed:",
//             response
//           );

//           setError(
//             response.error?.description ||
//               "Payment failed"
//           );

//           setPaying(false);
//         }
//       );

//       razorpay.open();
//     } catch (error) {
//       console.error(
//         "Payment error:",
//         error
//       );

//       setError(
//         error.message ||
//           "Failed to start payment"
//       );

//       setPaying(false);
//     }
//   }

//   return (
//     <section className="mx-auto max-w-3xl px-6 py-16">
//       <div className="rounded-xl border bg-white p-8">
//         <h1 className="text-3xl font-bold">
//           Complete Payment
//         </h1>

//         {orderId ? (
//           <p className="mt-2 text-gray-500">
//             Order #{orderId}
//           </p>
//         ) : (
//           <p className="mt-2 text-red-600">
//             Order ID is missing
//           </p>
//         )}

//         {error && (
//           <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
//             {error}
//           </div>
//         )}

//         <div className="mt-8 rounded-lg bg-gray-50 p-6">
//           <p className="text-sm text-gray-500">
//             Secure payment
//           </p>

//           <p className="mt-2 text-gray-700">
//             You will be redirected to Razorpay&apos;s
//             secure checkout.
//           </p>
//         </div>

//         <button
//           type="button"
//           disabled={paying || !orderId}
//           onClick={handlePayment}
//           className="mt-8 w-full rounded-lg bg-black px-6 py-4 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           {paying
//             ? "Processing..."
//             : "Pay Now"}
//         </button>

//         <p className="mt-4 text-center text-xs text-gray-500">
//           This project uses Razorpay Test Mode.
//           No real money will be charged.
//         </p>
//       </div>
//     </section>
//   );
// }


"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { authenticatedRequest } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");

  const [payment, setPayment] = useState(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  function loadRazorpayScript() {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  }

  async function handlePayment() {
    try {
      setPaying(true);
      setError("");

      if (!orderId) {
        throw new Error("Order ID is missing");
      }

      const token = getAccessToken();

      if (!token) {
        router.push("/login");
        return;
      }

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error(
          "Failed to load Razorpay checkout"
        );
      }

      const data = await authenticatedRequest(
        "/payments",
        {
          method: "POST",
          body: JSON.stringify({
            orderId: Number(orderId),
          }),
        }
      );

      const paymentData =
        data.payment || data.data;

      if (!paymentData) {
        throw new Error(
          "Payment information not received"
        );
      }

      setPayment(paymentData);

      const options = {
        key: paymentData.keyId,

        amount: Math.round(
          Number(paymentData.amount) * 100
        ),

        currency:
          paymentData.currency || "INR",

        name: "ScaleCart",

        description:
          "ScaleCart Order Payment",

        order_id:
          paymentData.razorpayOrderId,

        handler: async function (response) {
          try {
            setPaying(true);
            setError("");

            const verifyData =
              await authenticatedRequest(
                "/payments/verify",
                {
                  method: "POST",

                  body: JSON.stringify({
                    razorpay_order_id:
                      response.razorpay_order_id,

                    razorpay_payment_id:
                      response.razorpay_payment_id,

                    razorpay_signature:
                      response.razorpay_signature,
                  }),
                }
              );

            if (!verifyData.success) {
              throw new Error(
                verifyData.message ||
                  "Payment verification failed"
              );
            }

            router.push(
              `/checkout/success?orderId=${orderId}`
            );
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            setError(
              error.message ||
                "Payment verification failed"
            );

            setPaying(false);
          }
        },

        modal: {
          ondismiss: function () {
            setPaying(false);
          },
        },

        theme: {
          color: "#000000",
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Payment failed:",
            response
          );

          setError(
            response.error?.description ||
              "Payment failed"
          );

          setPaying(false);
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Payment error:",
        error
      );

      setError(
        error.message ||
          "Failed to start payment"
      );

      setPaying(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-xl border bg-white p-8">
        <h1 className="text-3xl font-bold">
          Complete Payment
        </h1>

        {orderId ? (
          <p className="mt-2 text-gray-500">
            Order #{orderId}
          </p>
        ) : (
          <p className="mt-2 text-red-600">
            Order ID is missing
          </p>
        )}

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 rounded-lg bg-gray-50 p-6">
          <p className="text-sm text-gray-500">
            Secure payment
          </p>

          <p className="mt-2 text-gray-700">
            You will be redirected to Razorpay&apos;s
            secure checkout.
          </p>
        </div>

        <button
          type="button"
          disabled={paying || !orderId}
          onClick={handlePayment}
          className="mt-8 w-full rounded-lg bg-black px-6 py-4 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {paying
            ? "Processing..."
            : "Pay Now"}
        </button>

        <p className="mt-4 text-center text-xs text-gray-500">
          This project uses Razorpay Test Mode.
          No real money will be charged.
        </p>
      </div>
    </section>
  );
}

function PaymentFallback() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-xl border bg-white p-8">
        <div className="h-9 w-64 animate-pulse rounded bg-gray-200" />

        <div className="mt-3 h-5 w-32 animate-pulse rounded bg-gray-200" />

        <div className="mt-8 h-24 animate-pulse rounded-lg bg-gray-100" />

        <div className="mt-8 h-14 animate-pulse rounded-lg bg-gray-200" />
      </div>
    </section>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentFallback />}>
      <PaymentContent />
    </Suspense>
  );
}