// import Link from "next/link";

// import AddToCartButton from "@/components/AddToCartButton";


// // async function getProduct(id) {
// //   const response = await fetch(
// //     `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
// //     {
// //       cache: "no-store",
// //     }
// //   );

// //   if (!response.ok) {
// //     return null;
// //   }

// //   return response.json();
// // }


// async function getProduct(id) {
//   // const API_URL =
//   //   process.env.NODE_ENV === "production"
//   //     ? "http://server:5000/api"
//   //     : process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
//   const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

//   const response = await fetch(
//     `${API_URL}/products/${id}`,
//     {
//       cache: "no-store",
//     }
//   );

//   if (!response.ok) {
//     return null;
//   }

//   return response.json();
// }

// export default async function ProductDetailPage({ params }) {
//   const { id } = await params;

//   const data = await getProduct(id);

//   if (!data || !data.product) {
//     return (
//       <section className="mx-auto max-w-7xl px-6 py-16">
//         <h1 className="text-3xl font-bold">
//           Product not found
//         </h1>

//         <Link
//           href="/products"
//           className="mt-4 inline-block underline"
//         >
//           Back to Products
//         </Link>
//       </section>
//     );
//   }

//   const product = data.product;

//   return (
//     <section className="mx-auto max-w-7xl px-6 py-10">
//       <Link
//         href="/products"
//         className="mb-8 inline-block text-sm underline"
//       >
//         ← Back to Products
//       </Link>

//       <div className="grid gap-10 md:grid-cols-2">
//         <div className="flex min-h-[400px] items-center justify-center rounded-xl bg-gray-100">
//           <span className="text-gray-400">
//             Product Image
//           </span>
//         </div>

//         <div>
//           <p className="text-sm text-gray-500">
//             {product.category_name}
//           </p>

//           <h1 className="mt-2 text-4xl font-bold">
//             {product.name}
//           </h1>

//           <p className="mt-6 text-3xl font-bold">
//             ₹{product.price}
//           </p>

//           <p className="mt-6 leading-7 text-gray-600">
//             {product.description || "No description available."}
//           </p>

//           <div className="mt-6">
//             <p className="font-medium">
//               Stock: {product.stock_quantity}
//             </p>
//           </div>

//           <AddToCartButton
//             productId={product.id}
//             stockQuantity={product.stock_quantity}
//           />
//         </div>
//       </div>
//     </section>
//   );
// }





import Link from "next/link";

import AddToCartButton from "@/components/AddToCartButton";

async function getProduct(id) {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api";

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
      <main className="relative min-h-screen overflow-hidden">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/[0.06] blur-[120px]"
          aria-hidden="true"
        />

        <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl rounded-[28px] border border-white/[0.07] bg-[#0d0d13]/90 p-8 text-center shadow-2xl shadow-black/30 sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/15 bg-red-500/[0.07]">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-300"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M9 9l6 6M15 9l-6 6" />
              </svg>
            </div>

            <h1 className="mt-6 text-2xl font-bold tracking-tight text-white">
              Product not found
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              This product may no longer be available or the
              requested product could not be found.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-black transition duration-200 hover:-translate-y-0.5 hover:bg-zinc-200"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>

              Back to Products
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const product = data.product;
  const stock = Number(product.stock_quantity);
  const inStock = stock > 0;

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Ambient background */}
      <div
        className="pointer-events-none absolute left-[15%] top-0 h-[500px] w-[700px] rounded-full bg-violet-600/[0.07] blur-[130px]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute right-[-200px] top-[300px] h-[450px] w-[450px] rounded-full bg-blue-500/[0.035] blur-[120px]"
        aria-hidden="true"
      />

      <section className="relative mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Breadcrumb */}
        <Link
          href="/products"
          className="group mb-8 inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-2 text-sm font-medium text-zinc-400 transition duration-200 hover:border-white/[0.13] hover:bg-white/[0.05] hover:text-white"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition group-hover:-translate-x-0.5"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>

          Back to Products
        </Link>

        {/* Main product area */}
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* Product visual */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-[36px] bg-violet-500/[0.045] blur-2xl" />

            <div className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#0d0d13]/90 shadow-2xl shadow-black/40">
              <div className="relative aspect-square sm:aspect-[5/4] lg:aspect-square">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(139,92,246,0.14),transparent_52%)]" />

                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.045] via-transparent to-violet-500/[0.035]" />

                {/* Decorative grid */}
                <div
                  className="absolute inset-0 opacity-[0.035]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                    backgroundSize: "42px 42px",
                  }}
                  aria-hidden="true"
                />

                {/* Product placeholder */}
                <div className="relative flex h-full items-center justify-center">
                  <div className="flex h-40 w-40 items-center justify-center rounded-[32px] border border-white/[0.08] bg-white/[0.035] shadow-[0_0_100px_rgba(139,92,246,0.12)] sm:h-48 sm:w-48">
                    <svg
                      width="72"
                      height="72"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-zinc-600"
                      aria-hidden="true"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                      />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                  </div>
                </div>

                {/* Category badge */}
                <div className="absolute left-5 top-5">
                  <span className="rounded-full border border-violet-400/15 bg-violet-500/[0.09] px-3 py-1.5 text-xs font-semibold text-violet-300 backdrop-blur-md">
                    {product.category_name}
                  </span>
                </div>

                {/* Stock badge */}
                <div className="absolute right-5 top-5">
                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-md ${
                      inStock
                        ? "border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300"
                        : "border-red-400/15 bg-red-400/[0.08] text-red-300"
                    }`}
                  >
                    {inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product information */}
          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
              {product.category_name}
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-[-0.035em] text-white sm:text-5xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-7 flex items-end gap-3">
              <span className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                ₹{product.price}
              </span>

              <span className="mb-1 text-sm text-zinc-500">
                inclusive of listed price
              </span>
            </div>

            {/* Divider */}
            <div className="my-7 h-px bg-white/[0.07]" />

            {/* Description */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                About this product
              </p>

              <p className="mt-3 text-sm leading-7 text-zinc-400 sm:text-base">
                {product.description ||
                  "No description available."}
              </p>
            </div>

            {/* Stock information */}
            <div className="mt-7 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                    Availability
                  </p>

                  <p className="mt-1 text-sm font-semibold text-zinc-200">
                    {inStock
                      ? `${stock} units available`
                      : "Currently unavailable"}
                  </p>
                </div>

                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    inStock
                      ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.55)]"
                      : "bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.4)]"
                  }`}
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Existing Add To Cart functionality */}
            <div className="mt-7">
              <AddToCartButton
                productId={product.id}
                stockQuantity={product.stock_quantity}
              />
            </div>

            {/* Trust row */}
            <div className="mt-7 grid grid-cols-3 gap-2 border-t border-white/[0.07] pt-6">
              <div>
                <p className="text-xs font-medium text-zinc-300">
                  Secure
                </p>
                <p className="mt-1 text-[11px] text-zinc-600">
                  Protected checkout
                </p>
              </div>

              <div className="border-l border-white/[0.06] pl-3">
                <p className="text-xs font-medium text-zinc-300">
                  Reliable
                </p>
                <p className="mt-1 text-[11px] text-zinc-600">
                  Verified catalog
                </p>
              </div>

              <div className="border-l border-white/[0.06] pl-3">
                <p className="text-xs font-medium text-zinc-300">
                  Simple
                </p>
                <p className="mt-1 text-[11px] text-zinc-600">
                  Easy shopping
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom information */}
        <div className="mt-10 grid gap-4 border-t border-white/[0.06] pt-8 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.06] bg-[#0d0d13]/60 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/[0.08] text-violet-300">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3v18" />
                <path d="M3 12h18" />
              </svg>
            </div>

            <h2 className="mt-4 text-sm font-semibold text-white">
              Easy quantity control
            </h2>

            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Choose the quantity you need before adding the
              product to your cart.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-[#0d0d13]/60 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/[0.08] text-violet-300">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3 5 6v5c0 4.6 3 8.7 7 10 4-1.3 7-5.4 7-10V6l-7-3Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>

            <h2 className="mt-4 text-sm font-semibold text-white">
              Secure cart flow
            </h2>

            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Your existing authenticated cart flow remains
              connected to this product.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-[#0d0d13]/60 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/[0.08] text-violet-300">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 6h18" />
                <path d="M6 6v14h12V6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </div>

            <h2 className="mt-4 text-sm font-semibold text-white">
              Continue shopping
            </h2>

            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Return to the catalog anytime and continue
              exploring available products.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}