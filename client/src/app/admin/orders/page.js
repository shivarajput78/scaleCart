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
        error.message || "Failed to update order status"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <p>Loading orders...</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div>
        <Link
          href="/admin"
          className="text-sm text-gray-500 hover:underline"
        >
          ← Dashboard
        </Link>

        <h1 className="mt-3 text-3xl font-bold">
          Orders
        </h1>
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="mt-8 rounded-xl border bg-white p-8 text-center">
          <p className="text-gray-600">
            No orders found.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border bg-white">
          <table className="w-full min-w-[900px]">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm">
                  Order
                </th>

                <th className="px-6 py-4 text-left text-sm">
                  Customer
                </th>

                <th className="px-6 py-4 text-left text-sm">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-sm">
                  Total
                </th>

                <th className="px-6 py-4 text-left text-sm">
                  Date
                </th>

                <th className="px-6 py-4 text-left text-sm">
                  Update
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {orders.map((order) => {
                const transitions =
                  allowedTransitions[order.status] || [];

                return (
                  <tr key={order.id}>
                    <td className="px-6 py-4 font-medium">
                      #{order.id}
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">
                          {order.user_name || order.name || "-"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {order.user_email ||
                            order.email ||
                            "-"}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                        {order.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      ₹
                      {Number(
                        order.total_amount || 0
                      ).toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.created_at
                        ? new Date(
                            order.created_at
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="px-6 py-4">
                      {transitions.length === 0 ? (
                        <span className="text-sm text-gray-400">
                          No changes
                        </span>
                      ) : (
                        <select
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
                          className="rounded-lg border px-3 py-2 text-sm"
                        >
                          <option value="">
                            Change status
                          </option>

                          {transitions.map((status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}