"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authenticatedRequest, apiRequest } from "@/lib/api";

export default function NewProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    categoryId: "",
    name: "",
    slug: "",
    description: "",
    price: "",
    quantity: "",
  });

  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await apiRequest("/categories");

        setCategories(
          data.categories ||
            data.data?.categories ||
            data.data ||
            []
        );
      } catch (error) {
        console.error(error);
        setError(
          error.message || "Failed to load categories"
        );
      } finally {
        setCategoriesLoading(false);
      }
    }

    fetchCategories();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (!form.categoryId) {
        throw new Error("Please select a category");
      }

      if (!form.name.trim()) {
        throw new Error("Product name is required");
      }

      if (!form.slug.trim()) {
        throw new Error("Product slug is required");
      }

      if (
        form.price === "" ||
        Number(form.price) < 0
      ) {
        throw new Error("Enter a valid price");
      }

      if (
        form.quantity === "" ||
        !Number.isInteger(Number(form.quantity)) ||
        Number(form.quantity) < 0
      ) {
        throw new Error("Enter a valid inventory quantity");
      }

      await authenticatedRequest("/products", {
        method: "POST",
        body: JSON.stringify({
          categoryId: Number(form.categoryId),
          name: form.name.trim(),
          slug: form.slug.trim().toLowerCase(),
          description: form.description.trim(),
          price: Number(form.price),
          quantity: Number(form.quantity),
        }),
      });

      router.push("/admin/products");
    } catch (error) {
      console.error("Create product error:", error);

      setError(
        error.message || "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/admin/products"
        className="text-sm text-gray-500 hover:underline"
      >
        ← Back to Products
      </Link>

      <h1 className="mt-4 text-3xl font-bold">
        Add Product
      </h1>

      <p className="mt-2 text-gray-600">
        Create a new product and initialize its inventory.
      </p>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6 rounded-xl border bg-white p-8"
      >
        {/* Category */}
        <div>
          <label
            htmlFor="categoryId"
            className="mb-2 block text-sm font-medium"
          >
            Category
          </label>

          <select
            id="categoryId"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            disabled={categoriesLoading}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
          >
            <option value="">
              {categoriesLoading
                ? "Loading categories..."
                : "Select category"}
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium"
          >
            Product Name
          </label>

          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Example: Wireless Headphones"
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
          />
        </div>

        {/* Slug */}
        <div>
          <label
            htmlFor="slug"
            className="mb-2 block text-sm font-medium"
          >
            Slug
          </label>

          <input
            id="slug"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="wireless-headphones"
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
          />

          <p className="mt-1 text-xs text-gray-500">
            Slug must be unique.
          </p>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            placeholder="Describe the product..."
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
          />
        </div>

        {/* Price + Quantity */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-medium"
            >
              Price
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              placeholder="999.00"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
            />
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="mb-2 block text-sm font-medium"
            >
              Initial Stock
            </label>

            <input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              step="1"
              value={form.quantity}
              onChange={handleChange}
              placeholder="100"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-black px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Creating..."
              : "Create Product"}
          </button>

          <Link
            href="/admin/products"
            className="rounded-lg border px-6 py-3 text-center font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}