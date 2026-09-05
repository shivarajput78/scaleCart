"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { authenticatedRequest } from "@/lib/api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await authenticatedRequest(
          "/products?limit=50"
        );

        setProducts(
          data.products ||
            data.data?.products ||
            data.data ||
            []
        );
      } catch (error) {
        console.error(error);
        setError(
          error.message || "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  async function handleDelete(productId) {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this product?"
    );

    if (!confirmed) return;

    try {
      await authenticatedRequest(
        `/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      setProducts((current) =>
        current.map((product) =>
          Number(product.id) === Number(productId)
            ? {
                ...product,
                status: "inactive",
              }
            : product
        )
      );
    } catch (error) {
      setError(
        error.message || "Failed to deactivate product"
      );
    }
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <p>Loading products...</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:underline"
          >
            ← Dashboard
          </Link>

          <h1 className="mt-3 text-3xl font-bold">
            Products
          </h1>
        </div>

        <Link
            href="/admin/products/new"
            className="rounded-lg bg-black px-5 py-3 font-medium text-white"
        >
            Add Product
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
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
                Category
              </th>

              <th className="px-6 py-4 text-left text-sm">
                Price
              </th>

              <th className="px-6 py-4 text-left text-sm">
                Stock
              </th>

              <th className="px-6 py-4 text-left text-sm">
                Status
              </th>

              <th className="px-6 py-4 text-left text-sm">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 font-medium">
                  {product.name}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {product.category_name || "-"}
                </td>

                <td className="px-6 py-4">
                  ₹{Number(product.price).toFixed(2)}
                </td>

                <td className="px-6 py-4">
                  {Number(product.stock_quantity ?? 0)}
                </td>

                <td className="px-6 py-4">
                  {product.status}
                </td>

                <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/admin/products/${product.id}`}
                            className="text-sm font-medium underline"
                        >
                            Edit
                        </Link>

                        <button
                            type="button"
                            disabled={product.status === "inactive"}
                            onClick={() =>
                            handleDelete(product.id)
                            }
                            className="text-sm font-medium text-red-600 disabled:text-gray-400"
                        >
                            Deactivate
                        </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}