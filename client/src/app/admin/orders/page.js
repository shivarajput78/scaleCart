// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";

// import { authenticatedRequest } from "@/lib/api";

// const allowedTransitions = {
//   PENDING: ["CONFIRMED", "CANCELLED"],
//   CONFIRMED: ["PACKED", "CANCELLED"],
//   PACKED: ["SHIPPED"],
//   SHIPPED: ["OUT_FOR_DELIVERY"],
//   OUT_FOR_DELIVERY: ["DELIVERED"],
//   DELIVERED: [],
//   CANCELLED: [],
// };

// export default function AdminOrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [updatingId, setUpdatingId] = useState(null);

//   useEffect(() => {
//     async function fetchOrders() {
//       try {
//         const data = await authenticatedRequest(
//           "/orders/admin/all"
//         );

//         setOrders(
//           data.orders ||
//             data.data?.orders ||
//             data.data ||
//             []
//         );
//       } catch (error) {
//         console.error(error);
//         setError(
//           error.message || "Failed to load orders"
//         );
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchOrders();
//   }, []);

//   async function handleStatusChange(orderId, status) {
//     if (!status) return;

//     try {
//       setUpdatingId(orderId);

//       const data = await authenticatedRequest(
//         `/orders/admin/${orderId}/status`,
//         {
//           method: "PATCH",
//           body: JSON.stringify({
//             status,
//           }),
//         }
//       );

//       const updatedOrder =
//         data.order ||
//         data.data?.order ||
//         data.data;

//       setOrders((current) =>
//         current.map((order) =>
//           Number(order.id) === Number(orderId)
//             ? updatedOrder || {
//                 ...order,
//                 status,
//               }
//             : order
//         )
//       );
//     } catch (error) {
//       console.error(error);
//       setError(
//         error.message || "Failed to update order status"
//       );
//     } finally {
//       setUpdatingId(null);
//     }
//   }

//   if (loading) {
//     return (
//       <section className="mx-auto max-w-7xl px-6 py-12">
//         <p>Loading orders...</p>
//       </section>
//     );
//   }

//   return (
//     <section className="mx-auto max-w-7xl px-6 py-12">
//       <div>
//         <Link
//           href="/admin"
//           className="text-sm text-gray-500 hover:underline"
//         >
//           ← Dashboard
//         </Link>

//         <h1 className="mt-3 text-3xl font-bold">
//           Orders
//         </h1>
//       </div>

//       {error && (
//         <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
//           {error}
//         </div>
//       )}

//       {orders.length === 0 ? (
//         <div className="mt-8 rounded-xl border bg-white p-8 text-center">
//           <p className="text-gray-600">
//             No orders found.
//           </p>
//         </div>
//       ) : (
//         <div className="mt-8 overflow-x-auto rounded-xl border bg-white">
//           <table className="w-full min-w-[900px]">
//             <thead className="border-b bg-gray-50">
//               <tr>
//                 <th className="px-6 py-4 text-left text-sm">
//                   Order
//                 </th>

//                 <th className="px-6 py-4 text-left text-sm">
//                   Customer
//                 </th>

//                 <th className="px-6 py-4 text-left text-sm">
//                   Status
//                 </th>

//                 <th className="px-6 py-4 text-left text-sm">
//                   Total
//                 </th>

//                 <th className="px-6 py-4 text-left text-sm">
//                   Date
//                 </th>

//                 <th className="px-6 py-4 text-left text-sm">
//                   Update
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="divide-y">
//               {orders.map((order) => {
//                 const transitions =
//                   allowedTransitions[order.status] || [];

//                 return (
//                   <tr key={order.id}>
//                     <td className="px-6 py-4 font-medium">
//                       #{order.id}
//                     </td>

//                     <td className="px-6 py-4">
//                       <div>
//                         <p className="font-medium">
//                           {order.user_name || order.name || "-"}
//                         </p>

//                         <p className="text-sm text-gray-500">
//                           {order.user_email ||
//                             order.email ||
//                             "-"}
//                         </p>
//                       </div>
//                     </td>

//                     <td className="px-6 py-4">
//                       <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
//                         {order.status}
//                       </span>
//                     </td>

//                     <td className="px-6 py-4">
//                       ₹
//                       {Number(
//                         order.total_amount || 0
//                       ).toFixed(2)}
//                     </td>

//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       {order.created_at
//                         ? new Date(
//                             order.created_at
//                           ).toLocaleDateString()
//                         : "-"}
//                     </td>

//                     <td className="px-6 py-4">
//                       {transitions.length === 0 ? (
//                         <span className="text-sm text-gray-400">
//                           No changes
//                         </span>
//                       ) : (
//                         <select
//                           disabled={
//                             updatingId === order.id
//                           }
//                           defaultValue=""
//                           onChange={(event) =>
//                             handleStatusChange(
//                               order.id,
//                               event.target.value
//                             )
//                           }
//                           className="rounded-lg border px-3 py-2 text-sm"
//                         >
//                           <option value="">
//                             Change status
//                           </option>

//                           {transitions.map((status) => (
//                             <option
//                               key={status}
//                               value={status}
//                             >
//                               {status}
//                             </option>
//                           ))}
//                         </select>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </section>
//   );
// }



"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { authenticatedRequest } from "@/lib/api";

const allowedTransitions = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PACKED", "CANCELLED"],
  PACKED: ["SHIPPED"],
  SHIPPED: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

function getStatusStyle(status) {
  switch (status) {
    case "PENDING":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";

    case "CONFIRMED":
      return "border-blue-500/20 bg-blue-500/10 text-blue-300";

    case "PACKED":
      return "border-violet-500/20 bg-violet-500/10 text-violet-300";

    case "SHIPPED":
      return "border-cyan-500/20 bg-cyan-500/10 text-cyan-300";

    case "OUT_FOR_DELIVERY":
      return "border-indigo-500/20 bg-indigo-500/10 text-indigo-300";

    case "DELIVERED":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";

    case "CANCELLED":
      return "border-red-500/20 bg-red-500/10 text-red-300";

    default:
      return "border-white/10 bg-white/[0.05] text-white/60";
  }
}

function formatStatus(status) {
  return status
    ? status.replaceAll("_", " ")
    : "-";
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await authenticatedRequest(
          "/orders/admin/all"
        );

        setOrders(
          data.orders ||
            data.data?.orders ||
            data.data ||
            []
        );
      } catch (error) {
        console.error(error);

        setError(
          error.message || "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  async function handleStatusChange(orderId, status) {
    if (!status) return;

    try {
      setUpdatingId(orderId);
      setError("");

      const data = await authenticatedRequest(
        `/orders/admin/${orderId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status,
          }),
        }
      );

      const updatedOrder =
        data.order ||
        data.data?.order ||
        data.data;

      setOrders((current) =>
        current.map((order) =>
          Number(order.id) === Number(orderId)
            ? updatedOrder || {
                ...order,
                status,
              }
            : order
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="animate-pulse">
          <div className="h-4 w-28 rounded bg-white/10" />

          <div className="mt-6 h-9 w-48 rounded bg-white/10" />

          <div className="mt-3 h-5 w-80 max-w-full rounded bg-white/10" />

          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="h-14 border-b border-white/10 bg-white/[0.02]" />

            <div className="space-y-0">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="grid grid-cols-5 gap-6 border-b border-white/5 px-6 py-5 last:border-0"
                >
                  <div className="h-5 rounded bg-white/10" />
                  <div className="h-5 rounded bg-white/10" />
                  <div className="h-6 rounded-full bg-white/10" />
                  <div className="h-5 rounded bg-white/10" />
                  <div className="h-10 rounded bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const pendingCount = orders.filter(
    (order) => order.status === "PENDING"
  ).length;

  const activeCount = orders.filter(
    (order) =>
      !["DELIVERED", "CANCELLED"].includes(
        order.status
      )
  ).length;

  const deliveredCount = orders.filter(
    (order) => order.status === "DELIVERED"
  ).length;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition hover:text-white"
      >
        <span>←</span>
        Dashboard
      </Link>

      <div className="mt-7">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
          Order Management
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Orders
        </h1>

        <p className="mt-2 text-sm text-white/50">
          Monitor orders and move them through their allowed status stages.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="sc-card p-5">
          <p className="text-sm text-white/45">
            Total Orders
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {orders.length}
          </p>
        </div>

        <div className="sc-card p-5">
          <p className="text-sm text-white/45">
            Pending
          </p>

          <p className="mt-2 text-3xl font-bold text-amber-300">
            {pendingCount}
          </p>

          <p className="mt-1 text-xs text-white/35">
            Awaiting confirmation
          </p>
        </div>

        <div className="sc-card p-5">
          <p className="text-sm text-white/45">
            Active / Delivered
          </p>

          <div className="mt-2 flex items-end gap-3">
            <p className="text-3xl font-bold text-violet-300">
              {activeCount}
            </p>

            <span className="mb-1 text-sm text-white/35">
              / {deliveredCount} delivered
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
          <div className="flex items-start gap-3">
            <span className="mt-0.5">!</span>
            <p>{error}</p>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05] text-2xl">
            🧾
          </div>

          <h2 className="mt-5 text-lg font-semibold text-white">
            No orders found
          </h2>

          <p className="mt-2 text-sm text-white/45">
            Orders will appear here once customers place them.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="mt-8 hidden overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/20 md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="border-b border-white/10 bg-white/[0.025]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/40">
                      Order
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/40">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/40">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/40">
                      Total
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/40">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/40">
                      Update
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {orders.map((order) => {
                    const transitions =
                      allowedTransitions[
                        order.status
                      ] || [];

                    return (
                      <tr
                        key={order.id}
                        className="transition hover:bg-white/[0.025]"
                      >
                        <td className="px-6 py-5">
                          <p className="font-semibold text-white">
                            #{order.id}
                          </p>

                          <Link
                            href={`/orders/${order.id}`}
                            className="mt-1 inline-block text-xs text-violet-400 transition hover:text-violet-300"
                          >
                            View order
                          </Link>
                        </td>

                        <td className="px-6 py-5">
                          <div>
                            <p className="font-medium text-white">
                              {order.user_name ||
                                order.name ||
                                "-"}
                            </p>

                            <p className="mt-1 text-sm text-white/40">
                              {order.user_email ||
                                order.email ||
                                "-"}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            {formatStatus(
                              order.status
                            )}
                          </span>
                        </td>

                        <td className="px-6 py-5 font-semibold text-white">
                          ₹
                          {Number(
                            order.total_amount || 0
                          ).toFixed(2)}
                        </td>

                        <td className="px-6 py-5 text-sm text-white/50">
                          {order.created_at
                            ? new Date(
                                order.created_at
                              ).toLocaleDateString()
                            : "-"}
                        </td>

                        <td className="px-6 py-5">
                          {transitions.length === 0 ? (
                            <span className="text-sm text-white/25">
                              No changes
                            </span>
                          ) : (
                            <select
                              disabled={
                                updatingId ===
                                order.id
                              }
                              defaultValue=""
                              onChange={(event) =>
                                handleStatusChange(
                                  order.id,
                                  event.target.value
                                )
                              }
                              className="sc-input w-48 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="">
                                Change status
                              </option>

                              {transitions.map(
                                (status) => (
                                  <option
                                    key={status}
                                    value={status}
                                  >
                                    {formatStatus(
                                      status
                                    )}
                                  </option>
                                )
                              )}
                            </select>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile */}
          <div className="mt-8 space-y-4 md:hidden">
            {orders.map((order) => {
              const transitions =
                allowedTransitions[
                  order.status
                ] || [];

              return (
                <div
                  key={order.id}
                  className="sc-card p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-bold text-white">
                        Order #{order.id}
                      </p>

                      <p className="mt-1 text-xs text-white/35">
                        {order.created_at
                          ? new Date(
                              order.created_at
                            ).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {formatStatus(
                        order.status
                      )}
                    </span>
                  </div>

                  <div className="mt-5 rounded-xl border border-white/5 bg-black/20 p-4">
                    <p className="text-sm font-medium text-white">
                      {order.user_name ||
                        order.name ||
                        "-"}
                    </p>

                    <p className="mt-1 break-all text-xs text-white/40">
                      {order.user_email ||
                        order.email ||
                        "-"}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                      <span className="text-xs text-white/40">
                        Order Total
                      </span>

                      <span className="font-bold text-white">
                        ₹
                        {Number(
                          order.total_amount || 0
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/orders/${order.id}`}
                    className="mt-4 inline-flex text-sm font-medium text-violet-400 transition hover:text-violet-300"
                  >
                    View order details →
                  </Link>

                  {transitions.length === 0 ? (
                    <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm text-white/30">
                      No further status changes available.
                    </div>
                  ) : (
                    <div className="mt-5">
                      <label
                        htmlFor={`status-${order.id}`}
                        className="mb-2 block text-sm font-medium text-white/70"
                      >
                        Update Status
                      </label>

                      <select
                        id={`status-${order.id}`}
                        disabled={
                          updatingId === order.id
                        }
                        defaultValue=""
                        onChange={(event) =>
                          handleStatusChange(
                            order.id,
                            event.target.value
                          )
                        }
                        className="sc-input w-full disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">
                          Change status
                        </option>

                        {transitions.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {formatStatus(
                                status
                              )}
                            </option>
                          )
                        )}
                      </select>

                      {updatingId === order.id && (
                        <p className="mt-2 text-xs text-white/35">
                          Updating order status...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}