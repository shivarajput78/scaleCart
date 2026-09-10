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


// "use client";

// import { Suspense, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";

// import { authenticatedRequest } from "@/lib/api";
// import { getAccessToken } from "@/lib/auth";

// function PaymentContent() {
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

//       if (!orderId) {
//         throw new Error("Order ID is missing");
//       }

//       const token = getAccessToken();

//       if (!token) {
//         router.push("/login");
//         return;
//       }

//       const scriptLoaded = await loadRazorpayScript();

//       if (!scriptLoaded) {
//         throw new Error(
//           "Failed to load Razorpay checkout"
//         );
//       }

//       const data = await authenticatedRequest(
//         "/payments",
//         {
//           method: "POST",
//           body: JSON.stringify({
//             orderId: Number(orderId),
//           }),
//         }
//       );

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

// function PaymentFallback() {
//   return (
//     <section className="mx-auto max-w-3xl px-6 py-16">
//       <div className="rounded-xl border bg-white p-8">
//         <div className="h-9 w-64 animate-pulse rounded bg-gray-200" />

//         <div className="mt-3 h-5 w-32 animate-pulse rounded bg-gray-200" />

//         <div className="mt-8 h-24 animate-pulse rounded-lg bg-gray-100" />

//         <div className="mt-8 h-14 animate-pulse rounded-lg bg-gray-200" />
//       </div>
//     </section>
//   );
// }

// export default function PaymentPage() {
//   return (
//     <Suspense fallback={<PaymentFallback />}>
//       <PaymentContent />
//     </Suspense>
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
          color: "#7c3aed",
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
    <section className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-4xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.12),transparent_65%)]" />

      <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/30">
        {/* Header */}
        <div className="border-b border-white/[0.07] px-6 py-7 sm:px-8 sm:py-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-500/10 text-xl">
              🔒
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                Secure checkout
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Complete Payment
              </h1>

              {orderId ? (
                <p className="mt-2 text-sm text-white/40">
                  Order{" "}
                  <span className="font-medium text-white/70">
                    #{orderId}
                  </span>
                </p>
              ) : (
                <p className="mt-2 text-sm text-red-300">
                  Order ID is missing
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* Error */}
          {error && (
            <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-5">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-sm text-red-300">
                  !
                </div>

                <div>
                  <p className="text-sm font-semibold text-red-200">
                    Payment could not be completed
                  </p>

                  <p className="mt-1 text-sm leading-6 text-red-200/60">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div className="rounded-2xl border border-violet-400/10 bg-gradient-to-br from-violet-500/[0.09] via-white/[0.02] to-fuchsia-500/[0.05] p-6 sm:p-7">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  Secure payment
                </p>

                <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
                  You&apos;ll continue to Razorpay&apos;s
                  secure checkout to complete your
                  ScaleCart order.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />

                <span className="text-xs font-medium text-white/60">
                  Secure checkout
                </span>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/10 text-sm font-bold text-violet-300">
                1
              </div>

              <p className="mt-3 text-sm font-semibold text-white/80">
                Start payment
              </p>

              <p className="mt-1 text-xs leading-5 text-white/35">
                Open secure checkout
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/10 text-sm font-bold text-violet-300">
                2
              </div>

              <p className="mt-3 text-sm font-semibold text-white/80">
                Complete payment
              </p>

              <p className="mt-1 text-xs leading-5 text-white/35">
                Finish through Razorpay
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-sm font-bold text-emerald-300">
                ✓
              </div>

              <p className="mt-3 text-sm font-semibold text-white/80">
                Verify order
              </p>

              <p className="mt-1 text-xs leading-5 text-white/35">
                Payment is securely verified
              </p>
            </div>
          </div>

          {/* CTA */}
          <button
            type="button"
            disabled={paying || !orderId}
            onClick={handlePayment}
            className="mt-8 w-full rounded-2xl bg-violet-500 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-violet-500/20 transition duration-300 hover:bg-violet-400 hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {paying
              ? "Processing Payment..."
              : "Pay Now →"}
          </button>

          {/* Test Mode Notice */}
          <div className="mt-5 flex items-start justify-center gap-2 text-center">
            <span className="mt-0.5 text-xs text-amber-300/70">
              ◉
            </span>

            <p className="text-xs leading-5 text-white/35">
              This project uses Razorpay Test Mode.
              No real money will be charged.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PaymentFallback() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-4xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 animate-pulse rounded-2xl bg-white/[0.06]" />

          <div className="flex-1">
            <div className="h-4 w-32 animate-pulse rounded bg-white/[0.06]" />

            <div className="mt-3 h-8 w-64 animate-pulse rounded-lg bg-white/[0.06]" />

            <div className="mt-2 h-4 w-28 animate-pulse rounded bg-white/[0.04]" />
          </div>
        </div>

        <div className="mt-8 h-32 animate-pulse rounded-2xl bg-white/[0.04]" />

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="h-28 animate-pulse rounded-2xl bg-white/[0.03]" />
          <div className="h-28 animate-pulse rounded-2xl bg-white/[0.03]" />
          <div className="h-28 animate-pulse rounded-2xl bg-white/[0.03]" />
        </div>

        <div className="mt-8 h-14 animate-pulse rounded-2xl bg-white/[0.06]" />
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