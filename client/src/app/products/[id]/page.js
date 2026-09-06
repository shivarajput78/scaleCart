import Link from "next/link";

import AddToCartButton from "@/components/AddToCartButton";


// async function getProduct(id) {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
//     {
//       cache: "no-store",
//     }
//   );

//   if (!response.ok) {
//     return null;
//   }

//   return response.json();
// }


async function getProduct(id) {
  const API_URL =
    process.env.NODE_ENV === "production"
      ? "http://server:5000/api"
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const response = await fetch(
    `${API_URL}/products/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;

  const data = await getProduct(id);

  if (!data || !data.product) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-3xl font-bold">
          Product not found
        </h1>

        <Link
          href="/products"
          className="mt-4 inline-block underline"
        >
          Back to Products
        </Link>
      </section>
    );
  }

  const product = data.product;

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <Link
        href="/products"
        className="mb-8 inline-block text-sm underline"
      >
        ← Back to Products
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="flex min-h-[400px] items-center justify-center rounded-xl bg-gray-100">
          <span className="text-gray-400">
            Product Image
          </span>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            {product.category_name}
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            {product.name}
          </h1>

          <p className="mt-6 text-3xl font-bold">
            ₹{product.price}
          </p>

          <p className="mt-6 leading-7 text-gray-600">
            {product.description || "No description available."}
          </p>

          <div className="mt-6">
            <p className="font-medium">
              Stock: {product.stock_quantity}
            </p>
          </div>

          <AddToCartButton
            productId={product.id}
            stockQuantity={product.stock_quantity}
          />
        </div>
      </div>
    </section>
  );
}