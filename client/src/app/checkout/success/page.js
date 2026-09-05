"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");

  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <div className="rounded-xl border bg-white p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl">
          ✓
        </div>

        <h1 className="mt-6 text-3xl font-bold">
          Payment Successful
        </h1>

        <p className="mt-3 text-gray-600">
          Your order has been confirmed successfully.
        </p>

        {orderId && (
          <p className="mt-3 text-sm text-gray-500">
            Order #{orderId}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/products"
            className="rounded-lg border px-6 py-3 font-medium"
          >
            Continue Shopping
          </Link>

          <Link
            href="/orders"
            className="rounded-lg bg-black px-6 py-3 font-medium text-white"
          >
            My Orders
          </Link>
        </div>
      </div>
    </section>
  );
}