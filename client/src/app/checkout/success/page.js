// "use client";

// import Link from "next/link";
// import { useSearchParams } from "next/navigation";

// export default function CheckoutSuccessPage() {
//   const searchParams = useSearchParams();

//   const orderId = searchParams.get("orderId");

//   return (
//     <section className="mx-auto max-w-2xl px-6 py-20">
//       <div className="rounded-xl border bg-white p-10 text-center">
//         <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl">
//           ✓
//         </div>

//         <h1 className="mt-6 text-3xl font-bold">
//           Payment Successful
//         </h1>

//         <p className="mt-3 text-gray-600">
//           Your order has been confirmed successfully.
//         </p>

//         {orderId && (
//           <p className="mt-3 text-sm text-gray-500">
//             Order #{orderId}
//           </p>
//         )}

//         <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
//           <Link
//             href="/products"
//             className="rounded-lg border px-6 py-3 font-medium"
//           >
//             Continue Shopping
//           </Link>

//           <Link
//             href="/orders"
//             className="rounded-lg bg-black px-6 py-3 font-medium text-white"
//           >
//             My Orders
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }




// "use client";

// import Link from "next/link";
// import { Suspense } from "react";
// import { useSearchParams } from "next/navigation";

// function CheckoutSuccessContent() {
//   const searchParams = useSearchParams();
//   const orderId = searchParams.get("orderId");

//   return (
//     <section className="mx-auto max-w-2xl px-6 py-20">
//       <div className="rounded-xl border bg-white p-10 text-center">
//         <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl">
//           ✓
//         </div>

//         <h1 className="mt-6 text-3xl font-bold">
//           Payment Successful
//         </h1>

//         <p className="mt-3 text-gray-600">
//           Your order has been confirmed successfully.
//         </p>

//         {orderId && (
//           <p className="mt-3 text-sm text-gray-500">
//             Order #{orderId}
//           </p>
//         )}

//         <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
//           <Link
//             href="/products"
//             className="rounded-lg border px-6 py-3 font-medium"
//           >
//             Continue Shopping
//           </Link>

//           <Link
//             href="/orders"
//             className="rounded-lg bg-black px-6 py-3 font-medium text-white"
//           >
//             My Orders
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }

// function CheckoutSuccessFallback() {
//   return (
//     <section className="mx-auto max-w-2xl px-6 py-20">
//       <div className="rounded-xl border bg-white p-10 text-center">
//         <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-gray-200" />

//         <div className="mx-auto mt-6 h-8 w-64 animate-pulse rounded bg-gray-200" />

//         <div className="mx-auto mt-4 h-5 w-80 max-w-full animate-pulse rounded bg-gray-200" />
//       </div>
//     </section>
//   );
// }

// export default function CheckoutSuccessPage() {
//   return (
//     <Suspense fallback={<CheckoutSuccessFallback />}>
//       <CheckoutSuccessContent />
//     </Suspense>
//   );

// }





"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/4 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-violet-500/[0.06] blur-3xl" />
      </div>

      <div className="w-full max-w-2xl">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-center shadow-2xl shadow-black/30 sm:p-12">
          {/* Success Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/10 shadow-[0_0_50px_rgba(52,211,153,0.12)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400 text-2xl font-bold text-black">
              ✓
            </div>
          </div>

          {/* Heading */}
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
            Order confirmed
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Payment Successful
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-white/50 sm:text-base">
            Your payment has been successfully processed
            and your order is now confirmed.
          </p>

          {/* Order ID */}
          {orderId && (
            <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-white/[0.08] bg-black/20 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                Order number
              </p>

              <p className="mt-2 text-2xl font-bold tracking-tight text-white">
                #{orderId}
              </p>
            </div>
          )}

          {/* Status */}
          <div className="mx-auto mt-6 flex max-w-sm items-center justify-center gap-3 rounded-2xl border border-emerald-400/10 bg-emerald-500/[0.05] px-5 py-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/10 text-sm text-emerald-300">
              ✓
            </span>

            <div className="text-left">
              <p className="text-sm font-semibold text-emerald-200">
                Payment verified
              </p>

              <p className="mt-0.5 text-xs text-emerald-200/50">
                Your order is being processed.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/orders"
              className="inline-flex items-center justify-center rounded-xl bg-violet-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-400 hover:shadow-violet-500/30"
            >
              View My Orders
              <span className="ml-2">→</span>
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Footer Note */}
          <div className="mt-9 border-t border-white/[0.07] pt-6">
            <p className="text-xs leading-5 text-white/30">
              Thank you for shopping with{" "}
              <span className="font-semibold text-white/50">
                ScaleCart
              </span>
              . You can track your order anytime from
              your Orders page.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckoutSuccessFallback() {
  return (
    <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-center shadow-2xl shadow-black/20 sm:p-12">
        <div className="mx-auto h-20 w-20 animate-pulse rounded-full bg-white/[0.06]" />

        <div className="mx-auto mt-8 h-3 w-32 animate-pulse rounded bg-white/[0.05]" />

        <div className="mx-auto mt-4 h-10 w-72 max-w-full animate-pulse rounded-xl bg-white/[0.06]" />

        <div className="mx-auto mt-4 h-5 w-96 max-w-full animate-pulse rounded bg-white/[0.04]" />

        <div className="mx-auto mt-8 h-20 max-w-sm animate-pulse rounded-2xl bg-white/[0.03]" />

        <div className="mx-auto mt-8 h-12 max-w-sm animate-pulse rounded-xl bg-white/[0.05]" />
      </div>
    </section>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<CheckoutSuccessFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}