"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { apiRequest, authenticatedRequest } from "@/lib/api";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    categoryId: "",
    name: "",
    slug: "",
    description: "",
    price: "",
    status: "active",
  });

  useEffect(() => {
    async function loadProduct() {
      try {
        const [productData, categoryData] =
          await Promise.all([
            apiRequest(`/products/${params.id}`),
            apiRequest("/categories"),
          ]);

        const product =
          productData.product ||
          productData.data;

        const categoriesResult =
          categoryData.categories ||
          categoryData.data?.categories ||
          categoryData.data ||
          [];

        setCategories(categoriesResult);

        if (!product) {
          throw new Error("Product not found");
        }

        setForm({
          categoryId: String(product.category_id || ""),
          name: product.name || "",
          slug: product.slug || "",
          description: product.description || "",
          price: String(product.price ?? ""),
          status: product.status || "active",
        });
      } catch (error) {
        console.error(error);

        setError(
          error.message || "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [params.id]);

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
      setSaving(true);
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

      await authenticatedRequest(
        `/products/${params.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            categoryId: Number(form.categoryId),
            name: form.name.trim(),
            slug: form.slug.trim().toLowerCase(),
            description: form.description.trim(),
            price: Number(form.price),
            status: form.status,
          }),
        }
      );

      router.push("/admin/products");
    } catch (error) {
      console.error("Update product error:", error);

      setError(
        error.message || "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-12">
        <p>Loading product...</p>
      </section>
    );
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
        Edit Product
      </h1>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6 rounded-xl border bg-white p-8"
      >
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
            className="w-full rounded-lg border px-4 py-3"
          >
            <option value="">
              Select category
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
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>

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
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>

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
            rows={5}
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>

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
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium"
          >
            Status
          </label>

          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-3"
          >
            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>
        </div>

        <div className="flex gap-3 border-t pt-6">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-black px-6 py-3 font-medium text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <Link
            href="/admin/products"
            className="rounded-lg border px-6 py-3 font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}