// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";

// import { authenticatedRequest } from "@/lib/api";

// export default function OrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function fetchOrders() {
//       try {
//         const data = await authenticatedRequest("/orders");

//         setOrders(data.orders || data.data || []);
//       } catch (error) {
//         console.error("Orders error:", error);
//         setError(error.message || "Failed to load orders");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchOrders();
//   }, []);

//   if (loading) {
//     return (
//       <section className="mx-auto max-w-6xl px-6 py-16">
//         <p>Loading orders...</p>
//       </section>
//     );
//   }

//   return (
//     <section className="mx-auto max-w-6xl px-6 py-16">
//       <h1 className="text-3xl font-bold">My Orders</h1>

//       {error && (
//         <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
//           {error}
//         </div>
//       )}

//       {!error && orders.length === 0 && (
//         <div className="mt-8 rounded-xl border p-8 text-center">
//           <p className="text-gray-600">
//             You haven&apos;t placed any orders yet.
//           </p>

//           <Link
//             href="/products"
//             className="mt-5 inline-block rounded-lg bg-black px-6 py-3 font-medium text-white"
//           >
//             Start Shopping
//           </Link>
//         </div>
//       )}

//       <div className="mt-8 space-y-4">
//         {orders.map((order) => (
//           <div
//             key={order.id}
//             className="rounded-xl border bg-white p-6"
//           >
//             <div className="flex flex-col justify-between gap-4 sm:flex-row">
//               <div>
//                 <p className="text-sm text-gray-500">
//                   Order #{order.id}
//                 </p>

//                 <p className="mt-1 text-sm text-gray-500">
//                   {new Date(order.created_at).toLocaleString()}
//                 </p>
//               </div>

//               <span className="w-fit rounded-full bg-gray-100 px-4 py-2 text-sm font-medium">
//                 {order.status}
//               </span>
//             </div>

//             <div className="mt-5 flex flex-col justify-between gap-4 border-t pt-5 sm:flex-row sm:items-center">
//               <div>
//                 <p className="text-sm text-gray-500">
//                   Total
//                 </p>

//                 <p className="text-xl font-bold">
//                   ₹{Number(order.total_amount).toFixed(2)}
//                 </p>
//               </div>

//               <Link
//                 href={`/orders/${order.id}`}
//                 className="rounded-lg bg-black px-5 py-3 text-center font-medium text-white"
//               >
//                 View Order
//               </Link>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }





"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { authenticatedRequest } from "@/lib/api";

function getStatusStyle(status) {
  const normalized = String(status || "").toLowerCase();

  if (
    normalized.includes("deliver") ||
    normalized.includes("complete") ||
    normalized.includes("success")
  ) {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  }

  if (
    normalized.includes("cancel") ||
    normalized.includes("fail")
  ) {
    return "border-red-400/20 bg-red-400/10 text-red-300";
  }

  if (
    normalized.includes("pending") ||
    normalized.includes("process")
  ) {
    return "border-amber-400/20 bg-amber-400/10 text-amber-300";
  }

  return "border-white/10 bg-white/5 text-white/60";
}

function OrdersSkeleton() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="animate-pulse">
        <div className="h-4 w-24 rounded bg-white/10" />
        <div className="mt-3 h-10 w-48 rounded bg-white/10" />
        <div className="mt-3 h-5 w-80 max-w-full rounded bg-white/5" />
      </div>

      <div className="mt-10 space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-3">
                <div className="h-4 w-28 rounded bg-white/10" />
                <div className="h-4 w-44 rounded bg-white/5" />
              </div>

              <div className="h-8 w-24 rounded-full bg-white/10" />
            </div>

            <div className="mt-6 border-t border-white/10 pt-6">
              <div className="h-4 w-16 rounded bg-white/5" />
              <div className="mt-2 h-7 w-28 rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await authenticatedRequest("/orders");
        setOrders(data.orders || data.data || []);
      } catch (error) {
        console.error("Orders error:", error);
        setError(error.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return <OrdersSkeleton />;
  }

  return (
    <main className="relative min-h-[calc(100vh-72px)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-6xl px-6 py-14 sm:py-16">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
              Account
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              My Orders
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
              Keep track of your purchases, order status and payment
              totals in one place.
            </p>
          </div>

          {orders.length > 0 && (
            <Link
              href="/products"
              className="inline-flex w-fit items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-violet-400/30 hover:bg-violet-500/10"
            >
              Continue Shopping
            </Link>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-300">
                !
              </span>

              <div>
                <p className="font-medium text-red-200">
                  Unable to load orders
                </p>

                <p className="mt-1 text-sm text-red-300/70">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty */}
        {!error && orders.length === 0 && (
          <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center shadow-2xl shadow-black/20 sm:p-14">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl">
              📦
            </div>

            <h2 className="mt-6 text-2xl font-semibold text-white">
              No orders yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/45">
              You haven&apos;t placed any orders yet. Explore our
              products and find something you love.
            </p>

            <Link
              href="/products"
              className="sc-button-primary mt-7 inline-flex px-6 py-3"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* Orders */}
        {!error && orders.length > 0 && (
          <div className="mt-10 space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-0.5 hover:border-violet-400/20 hover:bg-white/[0.045]"
              >
                <div className="p-6 sm:p-7">
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-sm font-semibold text-violet-300">
                          #
                        </span>

                        <div>
                          <p className="text-xs uppercase tracking-wider text-white/30">
                            Order
                          </p>

                          <p className="font-semibold text-white">
                            #{order.id}
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 text-sm text-white/35">
                        {new Date(
                          order.created_at
                        ).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full border px-4 py-2 text-xs font-semibold capitalize ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-6 flex flex-col justify-between gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/30">
                        Total
                      </p>

                      <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
                        ₹{Number(order.total_amount).toFixed(2)}
                      </p>
                    </div>

                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-violet-400/30 hover:bg-violet-500/10"
                    >
                      View Order
                      <span className="transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}