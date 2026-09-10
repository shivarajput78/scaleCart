// "use client";

// import Link from "next/link";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// import { authenticatedRequest } from "@/lib/api";
// import { createSocket } from "@/lib/socket";

// const statusSteps = [
//   "PENDING",
//   "CONFIRMED",
//   "PACKED",
//   "SHIPPED",
//   "OUT_FOR_DELIVERY",
//   "DELIVERED",
// ];

// export default function OrderDetailsPage() {
//   const params = useParams();

//   const orderId = params.id;

//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [cancelling, setCancelling] = useState(false);
//   const [error, setError] = useState("");
//   const [liveStatus, setLiveStatus] = useState("");

//   // Load order
//   useEffect(() => {
//     async function fetchOrder() {
//       try {
//         const data = await authenticatedRequest(
//           `/orders/${orderId}`
//         );

//         const loadedOrder =
//           data.order ||
//           data.data?.order ||
//           data.data;

//         setOrder(loadedOrder);
//         setLiveStatus(loadedOrder.status);
//       } catch (error) {
//         console.error("Order details error:", error);

//         setError(
//           error.message || "Failed to load order"
//         );
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (orderId) {
//       fetchOrder();
//     }
//   }, [orderId]);

//   // Real-time order status
//   useEffect(() => {
//     if (!orderId) return;

//     const socket = createSocket();

//     socket.on("connect", () => {
//       console.log(
//         "Socket connected:",
//         socket.id
//       );

//       socket.emit("join-order", orderId);
//     });

//     socket.on(
//       "order-status-updated",
//       (data) => {
//         if (
//           Number(data.orderId) !==
//           Number(orderId)
//         ) {
//           return;
//         }

//         console.log(
//           "Order status updated:",
//           data.status
//         );

//         setLiveStatus(data.status);

//         setOrder((current) =>
//           current
//             ? {
//                 ...current,
//                 status: data.status,
//               }
//             : current
//         );
//       }
//     );

//     socket.on("disconnect", () => {
//       console.log("Socket disconnected");
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [orderId]);

//   async function handleCancel() {
//     const confirmed = window.confirm(
//       "Are you sure you want to cancel this order?"
//     );

//     if (!confirmed) return;

//     try {
//       setCancelling(true);
//       setError("");

//       const data = await authenticatedRequest(
//         `/orders/${orderId}/cancel`,
//         {
//           method: "PATCH",
//         }
//       );

//       const cancelledOrder =
//         data.order ||
//         data.data?.order ||
//         data.data;

//       setOrder(cancelledOrder);
//       setLiveStatus(cancelledOrder.status);
//     } catch (error) {
//       console.error(
//         "Cancel order error:",
//         error
//       );

//       setError(
//         error.message ||
//           "Failed to cancel order"
//       );
//     } finally {
//       setCancelling(false);
//     }
//   }

//   if (loading) {
//     return (
//       <section className="mx-auto max-w-5xl px-6 py-16">
//         <p>Loading order...</p>
//       </section>
//     );
//   }

//   if (error && !order) {
//     return (
//       <section className="mx-auto max-w-5xl px-6 py-16">
//         <div className="rounded-lg bg-red-50 p-4 text-red-700">
//           {error}
//         </div>

//         <Link
//           href="/orders"
//           className="mt-6 inline-block underline"
//         >
//           Back to Orders
//         </Link>
//       </section>
//     );
//   }

//   if (!order) return null;

//   const currentStatus =
//     liveStatus || order.status;

//   const currentStatusIndex =
//     statusSteps.indexOf(currentStatus);

//   const canCancel =
//     currentStatus === "PENDING" ||
//     currentStatus === "CONFIRMED";

//   return (
//     <section className="mx-auto max-w-5xl px-6 py-16">
//       <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//         <div>
//           <Link
//             href="/orders"
//             className="text-sm text-gray-500 hover:underline"
//           >
//             ← Back to Orders
//           </Link>

//           <h1 className="mt-3 text-3xl font-bold">
//             Order #{order.id}
//           </h1>

//           <p className="mt-1 text-sm text-gray-500">
//             {new Date(
//               order.created_at
//             ).toLocaleString()}
//           </p>
//         </div>

//         {/* Live Status */}
//         <div className="flex items-center gap-3">
//           <span className="w-fit rounded-full bg-gray-100 px-4 py-2 text-sm font-medium">
//             {currentStatus}
//           </span>

//           <span className="text-xs text-green-600">
//             ● Live
//           </span>
//         </div>
//       </div>

//       {error && (
//         <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
//           {error}
//         </div>
//       )}

//       {/* Status Timeline */}
//       {currentStatus !== "CANCELLED" && (
//         <div className="mt-10 rounded-xl border bg-white p-6">
//           <h2 className="text-xl font-bold">
//             Order Status
//           </h2>

//           <div className="mt-8 space-y-6">
//             {statusSteps.map(
//               (status, index) => {
//                 const completed =
//                   index <= currentStatusIndex;

//                 return (
//                   <div
//                     key={status}
//                     className="flex items-center gap-4"
//                   >
//                     <div
//                       className={`flex h-9 w-9 items-center justify-center rounded-full border ${
//                         completed
//                           ? "bg-black text-white"
//                           : "bg-white text-gray-400"
//                       }`}
//                     >
//                       {completed
//                         ? "✓"
//                         : index + 1}
//                     </div>

//                     <div>
//                       <p
//                         className={`font-medium ${
//                           completed
//                             ? "text-black"
//                             : "text-gray-400"
//                         }`}
//                       >
//                         {status.replaceAll(
//                           "_",
//                           " "
//                         )}
//                       </p>
//                     </div>
//                   </div>
//                 );
//               }
//             )}
//           </div>
//         </div>
//       )}

//       {/* Cancelled */}
//       {currentStatus === "CANCELLED" && (
//         <div className="mt-10 rounded-xl border border-red-200 bg-red-50 p-6">
//           <h2 className="font-bold text-red-700">
//             Order Cancelled
//           </h2>

//           <p className="mt-2 text-sm text-red-600">
//             This order has been cancelled.
//           </p>
//         </div>
//       )}

//       {/* Items */}
//       <div className="mt-8 rounded-xl border bg-white p-6">
//         <h2 className="text-xl font-bold">
//           Items
//         </h2>

//         <div className="mt-6 divide-y">
//           {(order.items || []).map(
//             (item) => (
//               <div
//                 key={item.id}
//                 className="flex justify-between gap-4 py-4"
//               >
//                 <div>
//                   <p className="font-medium">
//                     {item.product_name}
//                   </p>

//                   <p className="text-sm text-gray-500">
//                     ₹
//                     {Number(
//                       item.unit_price
//                     ).toFixed(2)}{" "}
//                     × {item.quantity}
//                   </p>
//                 </div>

//                 <p className="font-medium">
//                   ₹
//                   {Number(
//                     item.subtotal
//                   ).toFixed(2)}
//                 </p>
//               </div>
//             )
//           )}
//         </div>
//       </div>

//       {/* Address + Summary */}
//       <div className="mt-8 grid gap-8 md:grid-cols-2">
//         <div className="rounded-xl border bg-white p-6">
//           <h2 className="text-xl font-bold">
//             Delivery Address
//           </h2>

//           {order.address && (
//             <div className="mt-5 space-y-1 text-gray-600">
//               <p className="font-medium text-black">
//                 {order.address.full_name}
//               </p>

//               <p>{order.address.phone}</p>

//               <p>
//                 {order.address.address_line1}
//               </p>

//               {order.address.address_line2 && (
//                 <p>
//                   {order.address.address_line2}
//                 </p>
//               )}

//               <p>
//                 {order.address.city},{" "}
//                 {order.address.state}
//               </p>

//               <p>
//                 {order.address.postal_code}
//               </p>

//               <p>{order.address.country}</p>
//             </div>
//           )}
//         </div>

//         <div className="rounded-xl border bg-white p-6">
//           <h2 className="text-xl font-bold">
//             Order Summary
//           </h2>

//           <div className="mt-5 space-y-3">
//             <div className="flex justify-between">
//               <span className="text-gray-500">
//                 Subtotal
//               </span>

//               <span>
//                 ₹
//                 {Number(
//                   order.subtotal
//                 ).toFixed(2)}
//               </span>
//             </div>

//             <div className="flex justify-between">
//               <span className="text-gray-500">
//                 Shipping
//               </span>

//               <span>
//                 ₹
//                 {Number(
//                   order.shipping_fee
//                 ).toFixed(2)}
//               </span>
//             </div>

//             <div className="flex justify-between border-t pt-4 text-lg font-bold">
//               <span>Total</span>

//               <span>
//                 ₹
//                 {Number(
//                   order.total_amount
//                 ).toFixed(2)}
//               </span>
//             </div>
//           </div>

//           {canCancel && (
//             <button
//               type="button"
//               onClick={handleCancel}
//               disabled={cancelling}
//               className="mt-6 w-full rounded-lg border border-red-300 px-5 py-3 font-medium text-red-600 disabled:opacity-50"
//             >
//               {cancelling
//                 ? "Cancelling..."
//                 : "Cancel Order"}
//             </button>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }





"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { authenticatedRequest } from "@/lib/api";
import { createSocket } from "@/lib/socket";

const statusSteps = [
  "PENDING",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

function formatStatus(status) {
  return String(status || "").replaceAll("_", " ");
}

function getStatusTone(status) {
  if (status === "DELIVERED") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  }

  if (status === "CANCELLED") {
    return "border-red-400/20 bg-red-400/10 text-red-300";
  }

  return "border-violet-400/20 bg-violet-400/10 text-violet-300";
}

function OrderSkeleton() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="animate-pulse">
        <div className="h-4 w-28 rounded bg-white/10" />
        <div className="mt-4 h-9 w-52 rounded bg-white/10" />
        <div className="mt-3 h-4 w-44 rounded bg-white/5" />
      </div>

      <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-7">
        <div className="h-6 w-36 rounded bg-white/10" />

        <div className="mt-8 space-y-6">
          {statusSteps.map((status) => (
            <div key={status} className="flex items-center gap-4">
              <div className="h-9 w-9 rounded-full bg-white/10" />
              <div className="h-4 w-32 rounded bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function OrderDetailsPage() {
  const params = useParams();

  const orderId = params.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  const [liveStatus, setLiveStatus] = useState("");

  // Load order
  useEffect(() => {
    async function fetchOrder() {
      try {
        const data = await authenticatedRequest(
          `/orders/${orderId}`
        );

        const loadedOrder =
          data.order ||
          data.data?.order ||
          data.data;

        setOrder(loadedOrder);
        setLiveStatus(loadedOrder.status);
      } catch (error) {
        console.error(
          "Order details error:",
          error
        );

        setError(
          error.message || "Failed to load order"
        );
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // Real-time order status
  useEffect(() => {
    if (!orderId) return;

    const socket = createSocket();

    socket.on("connect", () => {
      console.log(
        "Socket connected:",
        socket.id
      );

      socket.emit("join-order", orderId);
    });

    socket.on(
      "order-status-updated",
      (data) => {
        if (
          Number(data.orderId) !==
          Number(orderId)
        ) {
          return;
        }

        console.log(
          "Order status updated:",
          data.status
        );

        setLiveStatus(data.status);

        setOrder((current) =>
          current
            ? {
                ...current,
                status: data.status,
              }
            : current
        );
      }
    );

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  async function handleCancel() {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancelling(true);
      setError("");

      const data = await authenticatedRequest(
        `/orders/${orderId}/cancel`,
        {
          method: "PATCH",
        }
      );

      const cancelledOrder =
        data.order ||
        data.data?.order ||
        data.data;

      setOrder(cancelledOrder);
      setLiveStatus(cancelledOrder.status);
    } catch (error) {
      console.error(
        "Cancel order error:",
        error
      );

      setError(
        error.message ||
          "Failed to cancel order"
      );
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return <OrderSkeleton />;
  }

  if (error && !order) {
    return (
      <main className="relative min-h-[calc(100vh-72px)] overflow-hidden">
        <section className="relative mx-auto max-w-5xl px-6 py-16">
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-300">
                !
              </span>

              <div>
                <h1 className="font-semibold text-red-200">
                  Unable to load order
                </h1>

                <p className="mt-1 text-sm text-red-300/70">
                  {error}
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/orders"
            className="mt-6 inline-flex rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-violet-400/30 hover:bg-violet-500/10"
          >
            ← Back to Orders
          </Link>
        </section>
      </main>
    );
  }

  if (!order) return null;

  const currentStatus =
    liveStatus || order.status;

  const currentStatusIndex =
    statusSteps.indexOf(currentStatus);

  const canCancel =
    currentStatus === "PENDING" ||
    currentStatus === "CONFIRMED";

  return (
    <main className="relative min-h-[calc(100vh-72px)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-5xl px-6 py-14 sm:py-16">

        {/* Header */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <Link
              href="/orders"
              className="text-sm text-white/40 transition hover:text-violet-300"
            >
              ← Back to Orders
            </Link>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Order #{order.id}
              </h1>

              <span
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusTone(
                  currentStatus
                )}`}
              >
                {formatStatus(currentStatus)}
              </span>
            </div>

            <p className="mt-2 text-sm text-white/35">
              {new Date(
                order.created_at
              ).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/5 px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
            <span className="text-xs font-medium text-emerald-300">
              Live status
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Status Timeline */}
        {currentStatus !== "CANCELLED" && (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                  Tracking
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Order Status
                </h2>
              </div>

              <span className="hidden text-xs text-white/30 sm:block">
                Real-time updates
              </span>
            </div>

            <div className="mt-9">
              {statusSteps.map(
                (status, index) => {
                  const completed =
                    index <= currentStatusIndex;

                  const isCurrent =
                    status === currentStatus;

                  return (
                    <div
                      key={status}
                      className="relative flex gap-4 pb-7 last:pb-0"
                    >
                      {index <
                        statusSteps.length - 1 && (
                        <div
                          className={`absolute left-[17px] top-9 h-[calc(100%-14px)] w-px ${
                            index <
                            currentStatusIndex
                              ? "bg-violet-500/50"
                              : "bg-white/10"
                          }`}
                        />
                      )}

                      <div
                        className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
                          completed
                            ? "border-violet-400/30 bg-violet-500/15 text-violet-300"
                            : "border-white/10 bg-white/5 text-white/30"
                        }`}
                      >
                        {completed
                          ? "✓"
                          : index + 1}
                      </div>

                      <div className="pt-1">
                        <p
                          className={`font-medium ${
                            completed
                              ? "text-white"
                              : "text-white/30"
                          }`}
                        >
                          {formatStatus(status)}
                        </p>

                        {isCurrent && (
                          <p className="mt-1 text-xs text-violet-300/70">
                            Current status
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* Cancelled */}
        {currentStatus === "CANCELLED" && (
          <div className="mt-10 rounded-3xl border border-red-500/20 bg-red-500/10 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-300">
                ×
              </div>

              <div>
                <h2 className="text-xl font-semibold text-red-200">
                  Order Cancelled
                </h2>

                <p className="mt-2 text-sm text-red-300/70">
                  This order has been cancelled.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Items */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/20 sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                Purchase
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-white">
                Items
              </h2>
            </div>

            <span className="text-xs text-white/30">
              {order.items?.length || 0} item
              {order.items?.length === 1
                ? ""
                : "s"}
            </span>
          </div>

          <div className="mt-7 divide-y divide-white/10">
            {(order.items || []).map(
              (item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm text-violet-300">
                      ×{item.quantity}
                    </div>

                    <div>
                      <p className="font-medium text-white">
                        {item.product_name}
                      </p>

                      <p className="mt-1 text-sm text-white/35">
                        ₹
                        {Number(
                          item.unit_price
                        ).toFixed(2)}{" "}
                        × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <p className="font-semibold text-white">
                    ₹
                    {Number(
                      item.subtotal
                    ).toFixed(2)}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Address + Summary */}
        <div className="mt-8 grid gap-8 md:grid-cols-2">

          {/* Address */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/20 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
              Shipping
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              Delivery Address
            </h2>

            {order.address && (
              <div className="mt-6 space-y-1.5 text-sm leading-6 text-white/45">
                <p className="font-medium text-white">
                  {order.address.full_name}
                </p>

                <p>{order.address.phone}</p>

                <p>
                  {order.address.address_line1}
                </p>

                {order.address.address_line2 && (
                  <p>
                    {order.address.address_line2}
                  </p>
                )}

                <p>
                  {order.address.city},{" "}
                  {order.address.state}
                </p>

                <p>
                  {order.address.postal_code}
                </p>

                <p>
                  {order.address.country}
                </p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/20 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
              Payment
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-white/40">
                  Subtotal
                </span>

                <span className="text-white">
                  ₹
                  {Number(
                    order.subtotal
                  ).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-white/40">
                  Shipping
                </span>

                <span className="text-white">
                  ₹
                  {Number(
                    order.shipping_fee
                  ).toFixed(2)}
                </span>
              </div>

              <div className="border-t border-white/10 pt-5">
                <div className="flex items-end justify-between gap-4">
                  <span className="font-medium text-white/60">
                    Total
                  </span>

                  <span className="text-2xl font-semibold tracking-tight text-white">
                    ₹
                    {Number(
                      order.total_amount
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {canCancel && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelling}
                className="mt-7 w-full rounded-xl border border-red-400/20 bg-red-500/5 px-5 py-3.5 text-sm font-medium text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancelling
                  ? "Cancelling..."
                  : "Cancel Order"}
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}