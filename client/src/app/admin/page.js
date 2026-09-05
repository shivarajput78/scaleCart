"use client";

import Link from "next/link";

export default function AdminDashboard() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div>
        <p className="text-sm font-medium text-gray-500">
          ScaleCart Admin
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Manage products, inventory and customer orders.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/products"
          className="rounded-xl border bg-white p-6 transition hover:shadow-md"
        >
          <p className="text-sm text-gray-500">
            Catalog
          </p>

          <h2 className="mt-2 text-xl font-bold">
            Products
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Create, update and manage products.
          </p>
        </Link>

        <Link
          href="/admin/inventory"
          className="rounded-xl border bg-white p-6 transition hover:shadow-md"
        >
          <p className="text-sm text-gray-500">
            Stock
          </p>

          <h2 className="mt-2 text-xl font-bold">
            Inventory
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Monitor and update product stock.
          </p>
        </Link>

        <Link
          href="/admin/orders"
          className="rounded-xl border bg-white p-6 transition hover:shadow-md"
        >
          <p className="text-sm text-gray-500">
            Fulfillment
          </p>

          <h2 className="mt-2 text-xl font-bold">
            Orders
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Manage order status and fulfillment.
          </p>
        </Link>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">
            Analytics
          </p>

          <h2 className="mt-2 text-xl font-bold">
            Coming Soon
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Sales and operational metrics.
          </p>
        </div>
      </div>
    </section>
  );
}