"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authenticatedRequest } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Initial cart loading
  useEffect(() => {
    let cancelled = false;

    async function fetchCart() {
      try {
        const token = getAccessToken();

        if (!token) {
          router.push("/login");
          return;
        }

        const data = await authenticatedRequest("/cart");

        if (cancelled) {
          return;
        }

        const cartData = data.cart || data;

        setCart(cartData);
        setItems(cartData.items || []);
        setError("");
        setLoading(false);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Cart error:", error);

        setError(
          error.message || "Failed to load cart"
        );

        setLoading(false);
      }
    }

    fetchCart();

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function refreshCart() {
    try {
      const data = await authenticatedRequest("/cart");

      const cartData = data.cart || data;

      setCart(cartData);
      setItems(cartData.items || []);
      setError("");
    } catch (error) {
      console.error("Refresh cart error:", error);

      setError(
        error.message || "Failed to refresh cart"
      );
    }
  }

  async function updateQuantity(productId, quantity) {
    if (quantity < 1) {
      return;
    }

    try {
      setError("");

      await authenticatedRequest(
        `/cart/items/${productId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            quantity,
          }),
        }
      );

      await refreshCart();
    } catch (error) {
      console.error("Update quantity error:", error);

      setError(
        error.message || "Failed to update quantity"
      );
    }
  }

  async function removeItem(productId) {
    try {
      setError("");

      await authenticatedRequest(
        `/cart/items/${productId}`,
        {
          method: "DELETE",
        }
      );

      await refreshCart();
    } catch (error) {
      console.error("Remove item error:", error);

      setError(
        error.message || "Failed to remove item"
      );
    }
  }

  function calculateSubtotal() {
    return items.reduce((total, item) => {
      return (
        total +
        Number(item.price) * Number(item.quantity)
      );
    }, 0);
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="text-gray-500">
          Loading cart...
        </p>
      </section>
    );
  }

  if (error && items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-lg bg-red-50 p-5 text-red-700">
          {error}
        </div>

        <Link
          href="/products"
          className="mt-5 inline-block rounded-lg bg-black px-5 py-3 text-white"
        >
          Back to Products
        </Link>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold">
          Your Cart is Empty
        </h1>

        <p className="mt-3 text-gray-500">
          Add some products to your cart.
        </p>

        <Link
          href="/products"
          className="mt-6 inline-block rounded-lg bg-black px-6 py-3 font-medium text-white"
        >
          Browse Products
        </Link>
      </section>
    );
  }

  const subtotal = calculateSubtotal();

  const shippingFee =
    subtotal >= 500 ? 0 : 50;

  const total = subtotal + shippingFee;

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Your Cart
        </h1>

        <p className="mt-2 text-gray-500">
          Review your items before checkout.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}

        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => {
            const price = Number(item.price);
            const quantity = Number(item.quantity);
            const stock = Number(item.stock_quantity);

            const itemTotal = price * quantity;

            return (
              <div
                key={item.product_id}
                className="rounded-xl border bg-white p-5"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  {/* Product Info */}

                  <div>
                    <h2 className="text-lg font-semibold">
                      {item.name}
                    </h2>

                    <p className="mt-2 text-gray-600">
                      ₹{price.toFixed(2)}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Available stock: {stock}
                    </p>
                  </div>

                  {/* Quantity */}

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() =>
                        updateQuantity(
                          item.product_id,
                          quantity - 1
                        )
                      }
                      className="h-9 w-9 rounded-lg border disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      -
                    </button>

                    <span className="w-8 text-center font-medium">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      disabled={quantity >= stock}
                      onClick={() =>
                        updateQuantity(
                          item.product_id,
                          quantity + 1
                        )
                      }
                      className="h-9 w-9 rounded-lg border disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Item Total */}

                <div className="mt-5 flex items-center justify-between border-t pt-4">
                  <p className="font-semibold">
                    ₹{itemTotal.toFixed(2)}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      removeItem(item.product_id)
                    }
                    className="text-sm font-medium text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}

        <div className="h-fit rounded-xl border bg-white p-6">
          <h2 className="text-xl font-bold">
            Order Summary
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">
                Subtotal
              </span>

              <span className="font-medium">
                ₹{subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Shipping
              </span>

              <span className="font-medium">
                {shippingFee === 0
                  ? "FREE"
                  : `₹${shippingFee.toFixed(2)}`}
              </span>
            </div>
          </div>

          <div className="mt-6 border-t pt-5">
            <div className="flex justify-between">
              <span className="font-bold">
                Total
              </span>

              <span className="text-xl font-bold">
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="mt-6 block rounded-lg bg-black px-6 py-3 text-center font-medium text-white"
          >
            Proceed to Checkout
          </Link>

          <Link
            href="/products"
            className="mt-3 block text-center text-sm text-gray-600 hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}