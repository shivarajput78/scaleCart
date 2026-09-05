"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load categories
  useEffect(() => {
    let cancelled = false;

    async function fetchCategories() {
      try {
        const data = await apiRequest("/categories");

        if (!cancelled) {
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Categories error:", error);
      }
    }

    fetchCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load products
  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        setError("");

        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (category) {
          params.set("category", category);
        }

        if (minPrice) {
          params.set("minPrice", minPrice);
        }

        if (maxPrice) {
          params.set("maxPrice", maxPrice);
        }

        if (sort) {
          params.set("sort", sort);
        }

        params.set("page", page);
        params.set("limit", 10);

        const data = await apiRequest(
          `/products?${params.toString()}`
        );

        if (!cancelled) {
          setProducts(data.products || []);
          setPagination(data.pagination || null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Products error:", error);

        if (!cancelled) {
          setError(
            error.message || "Failed to load products"
          );
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [
    search,
    category,
    minPrice,
    maxPrice,
    sort,
    page,
  ]);

  function resetFilters() {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setPage(1);
  }

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setPage(1);
  }

  function handleCategoryChange(event) {
    setCategory(event.target.value);
    setPage(1);
  }

  function handleMinPriceChange(event) {
    setMinPrice(event.target.value);
    setPage(1);
  }

  function handleMaxPriceChange(event) {
    setMaxPrice(event.target.value);
    setPage(1);
  }

  function handleSortChange(event) {
    setSort(event.target.value);
    setPage(1);
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Products
        </h1>

        <p className="mt-2 text-gray-600">
          Find the products you are looking for.
        </p>
      </div>

      {/* Filters */}

      <div className="mb-10 rounded-xl border bg-white p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Search */}

          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="rounded-lg border px-4 py-3 outline-none focus:ring-2"
          />

          {/* Category */}

          <select
            value={category}
            onChange={handleCategoryChange}
            className="rounded-lg border px-4 py-3 outline-none"
          >
            <option value="">
              All Categories
            </option>

            {categories.map((item) => (
              <option
                key={item.id}
                value={item.slug}
              >
                {item.name}
              </option>
            ))}
          </select>

          {/* Min Price */}

          <input
            type="number"
            value={minPrice}
            onChange={handleMinPriceChange}
            placeholder="Min price"
            min="0"
            className="rounded-lg border px-4 py-3 outline-none focus:ring-2"
          />

          {/* Max Price */}

          <input
            type="number"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            placeholder="Max price"
            min="0"
            className="rounded-lg border px-4 py-3 outline-none focus:ring-2"
          />

          {/* Sort */}

          <select
            value={sort}
            onChange={handleSortChange}
            className="rounded-lg border px-4 py-3 outline-none"
          >
            <option value="newest">
              Newest
            </option>

            <option value="price_asc">
              Price: Low to High
            </option>

            <option value="price_desc">
              Price: High to Low
            </option>

            <option value="name_asc">
              Name: A-Z
            </option>
          </select>
        </div>

        <button
          type="button"
          onClick={resetFilters}
          className="mt-4 rounded-lg border px-5 py-2"
        >
          Reset Filters
        </button>
      </div>

      {/* Results count */}

      {!loading && pagination && (
        <div className="mb-5 text-sm text-gray-600">
          Showing page {pagination.page} of{" "}
          {pagination.totalPages} —{" "}
          {pagination.totalProducts} products
        </div>
      )}

      {/* Loading */}

      {loading && (
        <div className="py-20 text-center">
          <p className="text-gray-500">
            Loading products...
          </p>
        </div>
      )}

      {/* Error */}

      {!loading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      )}

      {/* Empty */}

      {!loading && !error && products.length === 0 && (
        <div className="py-20 text-center">
          <h2 className="text-xl font-semibold">
            No products found
          </h2>

          <p className="mt-2 text-gray-500">
            Try changing your search or filters.
          </p>
        </div>
      )}

      {/* Products */}

      {!loading && !error && products.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="overflow-hidden rounded-xl border bg-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-48 items-center justify-center bg-gray-100">
                <span className="text-gray-400">
                  Product Image
                </span>
              </div>

              <div className="p-5">
                <p className="text-sm text-gray-500">
                  {product.category_name}
                </p>

                <h2 className="mt-1 line-clamp-2 font-semibold">
                  {product.name}
                </h2>

                <p className="mt-3 text-xl font-bold">
                  ₹{product.price}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Stock: {product.stock_quantity}
                </p>

                {Number(product.stock_quantity) > 0 ? (
                  <p className="mt-3 text-sm font-medium">
                    In Stock
                  </p>
                ) : (
                  <p className="mt-3 text-sm font-medium">
                    Out of Stock
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}

      {!loading &&
        !error &&
        pagination &&
        pagination.totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              disabled={!pagination.hasPreviousPage}
              onClick={() =>
                setPage((current) => current - 1)
              }
              className="rounded-lg border px-5 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="font-medium">
              Page {pagination.page}
            </span>

            <button
              type="button"
              disabled={!pagination.hasNextPage}
              onClick={() =>
                setPage((current) => current + 1)
              }
              className="rounded-lg border px-5 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
    </section>
  );
}