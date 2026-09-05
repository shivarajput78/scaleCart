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
        console.error("Order details error:", error);

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
    return (
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p>Loading order...</p>
      </section>
    );
  }

  if (error && !order) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>

        <Link
          href="/orders"
          className="mt-6 inline-block underline"
        >
          Back to Orders
        </Link>
      </section>
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
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/orders"
            className="text-sm text-gray-500 hover:underline"
          >
            ← Back to Orders
          </Link>

          <h1 className="mt-3 text-3xl font-bold">
            Order #{order.id}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {new Date(
              order.created_at
            ).toLocaleString()}
          </p>
        </div>

        {/* Live Status */}
        <div className="flex items-center gap-3">
          <span className="w-fit rounded-full bg-gray-100 px-4 py-2 text-sm font-medium">
            {currentStatus}
          </span>

          <span className="text-xs text-green-600">
            ● Live
          </span>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Status Timeline */}
      {currentStatus !== "CANCELLED" && (
        <div className="mt-10 rounded-xl border bg-white p-6">
          <h2 className="text-xl font-bold">
            Order Status
          </h2>

          <div className="mt-8 space-y-6">
            {statusSteps.map(
              (status, index) => {
                const completed =
                  index <= currentStatusIndex;

                return (
                  <div
                    key={status}
                    className="flex items-center gap-4"
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                        completed
                          ? "bg-black text-white"
                          : "bg-white text-gray-400"
                      }`}
                    >
                      {completed
                        ? "✓"
                        : index + 1}
                    </div>

                    <div>
                      <p
                        className={`font-medium ${
                          completed
                            ? "text-black"
                            : "text-gray-400"
                        }`}
                      >
                        {status.replaceAll(
                          "_",
                          " "
                        )}
                      </p>
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
        <div className="mt-10 rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-bold text-red-700">
            Order Cancelled
          </h2>

          <p className="mt-2 text-sm text-red-600">
            This order has been cancelled.
          </p>
        </div>
      )}

      {/* Items */}
      <div className="mt-8 rounded-xl border bg-white p-6">
        <h2 className="text-xl font-bold">
          Items
        </h2>

        <div className="mt-6 divide-y">
          {(order.items || []).map(
            (item) => (
              <div
                key={item.id}
                className="flex justify-between gap-4 py-4"
              >
                <div>
                  <p className="font-medium">
                    {item.product_name}
                  </p>

                  <p className="text-sm text-gray-500">
                    ₹
                    {Number(
                      item.unit_price
                    ).toFixed(2)}{" "}
                    × {item.quantity}
                  </p>
                </div>

                <p className="font-medium">
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
        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-xl font-bold">
            Delivery Address
          </h2>

          {order.address && (
            <div className="mt-5 space-y-1 text-gray-600">
              <p className="font-medium text-black">
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

              <p>{order.address.country}</p>
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-xl font-bold">
            Order Summary
          </h2>

          <div className="mt-5 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">
                Subtotal
              </span>

              <span>
                ₹
                {Number(
                  order.subtotal
                ).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Shipping
              </span>

              <span>
                ₹
                {Number(
                  order.shipping_fee
                ).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between border-t pt-4 text-lg font-bold">
              <span>Total</span>

              <span>
                ₹
                {Number(
                  order.total_amount
                ).toFixed(2)}
              </span>
            </div>
          </div>

          {canCancel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              className="mt-6 w-full rounded-lg border border-red-300 px-5 py-3 font-medium text-red-600 disabled:opacity-50"
            >
              {cancelling
                ? "Cancelling..."
                : "Cancel Order"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}