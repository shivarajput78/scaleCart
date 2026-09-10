// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";

// import { authenticatedRequest } from "@/lib/api";

// export default function AdminProductsPage() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         const data = await authenticatedRequest(
//           "/products?limit=50"
//         );

//         setProducts(
//           data.products ||
//             data.data?.products ||
//             data.data ||
//             []
//         );
//       } catch (error) {
//         console.error(error);
//         setError(
//           error.message || "Failed to load products"
//         );
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProducts();
//   }, []);

//   async function handleDelete(productId) {
//     const confirmed = window.confirm(
//       "Are you sure you want to deactivate this product?"
//     );

//     if (!confirmed) return;

//     try {
//       await authenticatedRequest(
//         `/products/${productId}`,
//         {
//           method: "DELETE",
//         }
//       );

//       setProducts((current) =>
//         current.map((product) =>
//           Number(product.id) === Number(productId)
//             ? {
//                 ...product,
//                 status: "inactive",
//               }
//             : product
//         )
//       );
//     } catch (error) {
//       setError(
//         error.message || "Failed to deactivate product"
//       );
//     }
//   }

//   if (loading) {
//     return (
//       <section className="mx-auto max-w-7xl px-6 py-12">
//         <p>Loading products...</p>
//       </section>
//     );
//   }

//   return (
//     <section className="mx-auto max-w-7xl px-6 py-12">
//       <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//         <div>
//           <Link
//             href="/admin"
//             className="text-sm text-gray-500 hover:underline"
//           >
//             ← Dashboard
//           </Link>

//           <h1 className="mt-3 text-3xl font-bold">
//             Products
//           </h1>
//         </div>

//         <Link
//             href="/admin/products/new"
//             className="rounded-lg bg-black px-5 py-3 font-medium text-white"
//         >
//             Add Product
//         </Link>
//       </div>

//       {error && (
//         <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
//           {error}
//         </div>
//       )}

//       <div className="mt-8 overflow-x-auto rounded-xl border bg-white">
//         <table className="w-full min-w-[700px]">
//           <thead className="border-b bg-gray-50">
//             <tr>
//               <th className="px-6 py-4 text-left text-sm">
//                 Product
//               </th>

//               <th className="px-6 py-4 text-left text-sm">
//                 Category
//               </th>

//               <th className="px-6 py-4 text-left text-sm">
//                 Price
//               </th>

//               <th className="px-6 py-4 text-left text-sm">
//                 Stock
//               </th>

//               <th className="px-6 py-4 text-left text-sm">
//                 Status
//               </th>

//               <th className="px-6 py-4 text-left text-sm">
//                 Action
//               </th>
//             </tr>
//           </thead>

//           <tbody className="divide-y">
//             {products.map((product) => (
//               <tr key={product.id}>
//                 <td className="px-6 py-4 font-medium">
//                   {product.name}
//                 </td>

//                 <td className="px-6 py-4 text-gray-600">
//                   {product.category_name || "-"}
//                 </td>

//                 <td className="px-6 py-4">
//                   ₹{Number(product.price).toFixed(2)}
//                 </td>

//                 <td className="px-6 py-4">
//                   {Number(product.stock_quantity ?? 0)}
//                 </td>

//                 <td className="px-6 py-4">
//                   {product.status}
//                 </td>

//                 <td className="px-6 py-4">
//                     <div className="flex items-center gap-4">
//                         <Link
//                             href={`/admin/products/${product.id}`}
//                             className="text-sm font-medium underline"
//                         >
//                             Edit
//                         </Link>

//                         <button
//                             type="button"
//                             disabled={product.status === "inactive"}
//                             onClick={() =>
//                             handleDelete(product.id)
//                             }
//                             className="text-sm font-medium text-red-600 disabled:text-gray-400"
//                         >
//                             Deactivate
//                         </button>
//                     </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </section>
//   );
// }




"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { authenticatedRequest } from "@/lib/api";

function getStatusStyle(status) {
  if (status === "inactive") {
    return "border-red-400/20 bg-red-400/10 text-red-300";
  }

  return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
}

function getStockStyle(stock) {
  const quantity = Number(stock ?? 0);

  if (quantity === 0) {
    return "text-red-300";
  }

  if (quantity <= 5) {
    return "text-amber-300";
  }

  return "text-white";
}

function ProductsSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <div className="animate-pulse">
        <div className="h-4 w-24 rounded bg-white/10" />
        <div className="mt-4 h-10 w-48 rounded bg-white/10" />
      </div>

      <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
        <div className="hidden border-b border-white/10 p-5 md:grid md:grid-cols-6 md:gap-4">
          {["1", "2", "3", "4", "5", "6"].map((item) => (
            <div
              key={item}
              className="h-4 rounded bg-white/10"
            />
          ))}
        </div>

        <div className="divide-y divide-white/10">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="grid gap-4 p-5 md:grid-cols-6 md:items-center"
            >
              <div className="h-5 w-32 rounded bg-white/10" />
              <div className="h-4 w-24 rounded bg-white/5" />
              <div className="h-4 w-20 rounded bg-white/5" />
              <div className="h-4 w-12 rounded bg-white/5" />
              <div className="h-7 w-20 rounded-full bg-white/10" />
              <div className="h-4 w-28 rounded bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
        error.message ||
          "Failed to deactivate product"
      );
    }
  }

  if (loading) {
    return <ProductsSkeleton />;
  }

  return (
    <main className="relative min-h-[calc(100vh-72px)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-10 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-7xl px-6 py-14">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Link
              href="/admin"
              className="text-sm text-white/40 transition hover:text-violet-300"
            >
              ← Dashboard
            </Link>

            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
              Catalog Management
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
              Products
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Manage your product catalog, pricing, stock and
              availability.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="sc-button-primary inline-flex w-fit px-5 py-3"
          >
            + Add Product
          </Link>
        </div>

        {/* Summary */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-wider text-white/30">
              Total Products
            </p>

            <p className="mt-2 text-2xl font-semibold text-white">
              {products.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-wider text-white/30">
              Active
            </p>

            <p className="mt-2 text-2xl font-semibold text-emerald-300">
              {
                products.filter(
                  (product) =>
                    product.status !== "inactive"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-wider text-white/30">
              Low Stock
            </p>

            <p className="mt-2 text-2xl font-semibold text-amber-300">
              {
                products.filter(
                  (product) =>
                    Number(
                      product.stock_quantity ?? 0
                    ) <= 5
                ).length
              }
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Empty */}
        {!error && products.length === 0 && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl text-violet-300">
              +
            </div>

            <h2 className="mt-5 text-xl font-semibold text-white">
              No products found
            </h2>

            <p className="mt-2 text-sm text-white/40">
              Start building your catalog by adding your first
              product.
            </p>

            <Link
              href="/admin/products/new"
              className="sc-button-primary mt-6 inline-flex px-5 py-3"
            >
              Add Product
            </Link>
          </div>
        )}

        {/* Desktop table */}
        {!error && products.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/20">
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px]">
                <thead className="border-b border-white/10 bg-white/[0.02]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/30">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/30">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/30">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/30">
                      Stock
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/30">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/30">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="transition hover:bg-white/[0.025]"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-violet-500/10 text-sm font-semibold text-violet-300">
                            {product.name
                              ?.charAt(0)
                              ?.toUpperCase() || "P"}
                          </div>

                          <div>
                            <p className="font-medium text-white">
                              {product.name}
                            </p>

                            <p className="mt-0.5 text-xs text-white/25">
                              ID #{product.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-white/45">
                        {product.category_name || "-"}
                      </td>

                      <td className="px-6 py-5 text-sm font-medium text-white">
                        ₹{Number(product.price).toFixed(2)}
                      </td>

                      <td
                        className={`px-6 py-5 text-sm font-semibold ${getStockStyle(
                          product.stock_quantity
                        )}`}
                      >
                        {Number(
                          product.stock_quantity ?? 0
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                            product.status
                          )}`}
                        >
                          {product.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="text-sm font-medium text-violet-300 transition hover:text-violet-200"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            disabled={
                              product.status ===
                              "inactive"
                            }
                            onClick={() =>
                              handleDelete(
                                product.id
                              )
                            }
                            className="text-sm font-medium text-red-300 transition hover:text-red-200 disabled:cursor-not-allowed disabled:text-white/20"
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

            {/* Mobile cards */}
            <div className="divide-y divide-white/10 md:hidden">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-violet-500/10 text-sm font-semibold text-violet-300">
                        {product.name
                          ?.charAt(0)
                          ?.toUpperCase() || "P"}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-white/30">
                          {product.category_name || "No category"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${getStatusStyle(
                        product.status
                      )}`}
                    >
                      {product.status}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <div>
                      <p className="text-xs text-white/30">
                        Price
                      </p>

                      <p className="mt-1 font-semibold text-white">
                        ₹{Number(product.price).toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-white/30">
                        Stock
                      </p>

                      <p
                        className={`mt-1 font-semibold ${getStockStyle(
                          product.stock_quantity
                        )}`}
                      >
                        {Number(
                          product.stock_quantity ?? 0
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white transition hover:border-violet-400/30 hover:bg-violet-500/10"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      disabled={
                        product.status === "inactive"
                      }
                      onClick={() =>
                        handleDelete(product.id)
                      }
                      className="flex-1 rounded-xl border border-red-400/15 bg-red-500/5 px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      Deactivate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}