"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { authenticatedRequest } from "@/lib/api";

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
    return (
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p>Loading orders...</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold">My Orders</h1>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {!error && orders.length === 0 && (
        <div className="mt-8 rounded-xl border p-8 text-center">
          <p className="text-gray-600">
            You haven&apos;t placed any orders yet.
          </p>

          <Link
            href="/products"
            className="mt-5 inline-block rounded-lg bg-black px-6 py-3 font-medium text-white"
          >
            Start Shopping
          </Link>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-xl border bg-white p-6"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div>
                <p className="text-sm text-gray-500">
                  Order #{order.id}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              <span className="w-fit rounded-full bg-gray-100 px-4 py-2 text-sm font-medium">
                {order.status}
              </span>
            </div>

            <div className="mt-5 flex flex-col justify-between gap-4 border-t pt-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm text-gray-500">
                  Total
                </p>

                <p className="text-xl font-bold">
                  ₹{Number(order.total_amount).toFixed(2)}
                </p>
              </div>

              <Link
                href={`/orders/${order.id}`}
                className="rounded-lg bg-black px-5 py-3 text-center font-medium text-white"
              >
                View Order
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}