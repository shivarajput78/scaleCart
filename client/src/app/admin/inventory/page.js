"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  apiRequest,
  authenticatedRequest,
} from "@/lib/api";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await apiRequest(
          "/products?limit=50"
        );

        const productList =
          data.products ||
          data.data?.products ||
          data.data ||
          [];

        setProducts(productList);

        const initialQuantities = {};

        productList.forEach((product) => {
          initialQuantities[product.id] =
            Number(product.stock_quantity ?? 0);
        });

        setQuantities(initialQuantities);
      } catch (error) {
        console.error(error);

        setError(
          error.message || "Failed to load inventory"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  function handleQuantityChange(productId, value) {
    setQuantities((current) => ({
      ...current,
      [productId]: value,
    }));
  }

  async function updateInventory(productId) {
    try {
      setSavingId(productId);
      setError("");
      setMessage("");

      const quantity = Number(
        quantities[productId]
      );

      if (
        !Number.isInteger(quantity) ||
        quantity < 0
      ) {
        throw new Error(
          "Inventory quantity must be a non-negative integer"
        );
      }

      await authenticatedRequest(
        `/products/${productId}/inventory`,
        {
          method: "PUT",
          body: JSON.stringify({
            quantity,
          }),
        }
      );

      setProducts((current) =>
        current.map((product) =>
          Number(product.id) === Number(productId)
            ? {
                ...product,
                stock_quantity: quantity,
              }
            : product
        )
      );

      setMessage(
        `Inventory updated for product #${productId}`
      );
    } catch (error) {
      console.error(error);

      setError(
        error.message || "Failed to update inventory"
      );
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <p>Loading inventory...</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <Link
        href="/admin"
        className="text-sm text-gray-500 hover:underline"
      >
        ← Dashboard
      </Link>

      <h1 className="mt-4 text-3xl font-bold">
        Inventory
      </h1>

      <p className="mt-2 text-gray-600">
        Monitor and update product stock.
      </p>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="mt-6 rounded-lg bg-green-50 p-4 text-green-700">
          {message}
        </div>
      )}

      <div className="mt-8 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[700px]">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm">
                Product
              </th>

              <th className="px-6 py-4 text-left text-sm">
                Current Stock
              </th>

              <th className="px-6 py-4 text-left text-sm">
                New Stock
              </th>

              <th className="px-6 py-4 text-left text-sm">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {products.map((product) => {
              const stock = Number(
                product.stock_quantity ?? 0
              );

              const isLowStock =
                stock > 0 && stock <= 5;

              const isOutOfStock = stock === 0;

              return (
                <tr key={product.id}>
                  <td className="px-6 py-4 font-medium">
                    {product.name}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={
                        isOutOfStock
                          ? "font-medium text-red-600"
                          : isLowStock
                          ? "font-medium text-orange-600"
                          : ""
                      }
                    >
                      {stock}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={
                        quantities[product.id] ?? stock
                      }
                      onChange={(event) =>
                        handleQuantityChange(
                          product.id,
                          event.target.value
                        )
                      }
                      className="w-32 rounded-lg border px-3 py-2"
                    />
                  </td>

                  <td className="px-6 py-4">
                    <button
                      type="button"
                      disabled={
                        savingId === product.id
                      }
                      onClick={() =>
                        updateInventory(product.id)
                      }
                      className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                      {savingId === product.id
                        ? "Saving..."
                        : "Update"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}