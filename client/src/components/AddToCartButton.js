"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authenticatedRequest } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

export default function AddToCartButton({
  productId,
  stockQuantity,
}) {
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const numericProductId = Number(productId);
  const stock = Number(stockQuantity);

  async function handleAddToCart() {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const token = getAccessToken();

      if (!token) {
        router.push("/login");
        return;
      }

      if (!Number.isInteger(numericProductId) || numericProductId <= 0) {
        setError("Invalid product ID");
        return;
      }

      if (quantity < 1 || quantity > stock) {
        setError("Invalid quantity");
        return;
      }

      console.log("Adding to cart:", {
        productId: numericProductId,
        quantity,
      });

      await authenticatedRequest("/cart/items", {
        method: "POST",
        body: JSON.stringify({
          productId: numericProductId,
          quantity,
        }),
      });

      setMessage("Product added to cart");

      setTimeout(() => {
        router.push("/cart");
      }, 700);
    } catch (error) {
      console.error("Add to cart error:", error);

      setError(
        error.message || "Failed to add product to cart"
      );
    } finally {
      setLoading(false);
    }
  }

  if (stock <= 0) {
    return (
      <div className="mt-8">
        <button
          type="button"
          disabled
          className="rounded-lg bg-gray-300 px-6 py-3 font-medium text-gray-600"
        >
          Out of Stock
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={quantity <= 1 || loading}
          onClick={() =>
            setQuantity((current) => current - 1)
          }
          className="h-10 w-10 rounded-lg border disabled:cursor-not-allowed disabled:opacity-40"
        >
          -
        </button>

        <span className="w-8 text-center font-medium">
          {quantity}
        </span>

        <button
          type="button"
          disabled={quantity >= stock || loading}
          onClick={() =>
            setQuantity((current) => current + 1)
          }
          className="h-10 w-10 rounded-lg border disabled:cursor-not-allowed disabled:opacity-40"
        >
          +
        </button>
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={handleAddToCart}
        className="mt-4 rounded-lg bg-black px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>

      {message && (
        <p className="mt-3 text-sm font-medium">
          {message}
        </p>
      )}

      {error && (
        <p className="mt-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}