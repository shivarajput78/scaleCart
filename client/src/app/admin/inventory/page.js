// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";

// import {
//   apiRequest,
//   authenticatedRequest,
// } from "@/lib/api";

// export default function InventoryPage() {
//   const [products, setProducts] = useState([]);
//   const [quantities, setQuantities] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [savingId, setSavingId] = useState(null);
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         const data = await apiRequest(
//           "/products?limit=50"
//         );

//         const productList =
//           data.products ||
//           data.data?.products ||
//           data.data ||
//           [];

//         setProducts(productList);

//         const initialQuantities = {};

//         productList.forEach((product) => {
//           initialQuantities[product.id] =
//             Number(product.stock_quantity ?? 0);
//         });

//         setQuantities(initialQuantities);
//       } catch (error) {
//         console.error(error);

//         setError(
//           error.message || "Failed to load inventory"
//         );
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProducts();
//   }, []);

//   function handleQuantityChange(productId, value) {
//     setQuantities((current) => ({
//       ...current,
//       [productId]: value,
//     }));
//   }

//   async function updateInventory(productId) {
//     try {
//       setSavingId(productId);
//       setError("");
//       setMessage("");

//       const quantity = Number(
//         quantities[productId]
//       );

//       if (
//         !Number.isInteger(quantity) ||
//         quantity < 0
//       ) {
//         throw new Error(
//           "Inventory quantity must be a non-negative integer"
//         );
//       }

//       await authenticatedRequest(
//         `/products/${productId}/inventory`,
//         {
//           method: "PUT",
//           body: JSON.stringify({
//             quantity,
//           }),
//         }
//       );

//       setProducts((current) =>
//         current.map((product) =>
//           Number(product.id) === Number(productId)
//             ? {
//                 ...product,
//                 stock_quantity: quantity,
//               }
//             : product
//         )
//       );

//       setMessage(
//         `Inventory updated for product #${productId}`
//       );
//     } catch (error) {
//       console.error(error);

//       setError(
//         error.message || "Failed to update inventory"
//       );
//     } finally {
//       setSavingId(null);
//     }
//   }

//   if (loading) {
//     return (
//       <section className="mx-auto max-w-7xl px-6 py-12">
//         <p>Loading inventory...</p>
//       </section>
//     );
//   }

//   return (
//     <section className="mx-auto max-w-7xl px-6 py-12">
//       <Link
//         href="/admin"
//         className="text-sm text-gray-500 hover:underline"
//       >
//         ← Dashboard
//       </Link>

//       <h1 className="mt-4 text-3xl font-bold">
//         Inventory
//       </h1>

//       <p className="mt-2 text-gray-600">
//         Monitor and update product stock.
//       </p>

//       {error && (
//         <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
//           {error}
//         </div>
//       )}

//       {message && (
//         <div className="mt-6 rounded-lg bg-green-50 p-4 text-green-700">
//           {message}
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
//                 Current Stock
//               </th>

//               <th className="px-6 py-4 text-left text-sm">
//                 New Stock
//               </th>

//               <th className="px-6 py-4 text-left text-sm">
//                 Action
//               </th>
//             </tr>
//           </thead>

//           <tbody className="divide-y">
//             {products.map((product) => {
//               const stock = Number(
//                 product.stock_quantity ?? 0
//               );

//               const isLowStock =
//                 stock > 0 && stock <= 5;

//               const isOutOfStock = stock === 0;

//               return (
//                 <tr key={product.id}>
//                   <td className="px-6 py-4 font-medium">
//                     {product.name}
//                   </td>

//                   <td className="px-6 py-4">
//                     <span
//                       className={
//                         isOutOfStock
//                           ? "font-medium text-red-600"
//                           : isLowStock
//                           ? "font-medium text-orange-600"
//                           : ""
//                       }
//                     >
//                       {stock}
//                     </span>
//                   </td>

//                   <td className="px-6 py-4">
//                     <input
//                       type="number"
//                       min="0"
//                       step="1"
//                       value={
//                         quantities[product.id] ?? stock
//                       }
//                       onChange={(event) =>
//                         handleQuantityChange(
//                           product.id,
//                           event.target.value
//                         )
//                       }
//                       className="w-32 rounded-lg border px-3 py-2"
//                     />
//                   </td>

//                   <td className="px-6 py-4">
//                     <button
//                       type="button"
//                       disabled={
//                         savingId === product.id
//                       }
//                       onClick={() =>
//                         updateInventory(product.id)
//                       }
//                       className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
//                     >
//                       {savingId === product.id
//                         ? "Saving..."
//                         : "Update"}
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </section>
//   );
// }



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
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="animate-pulse">
          <div className="h-4 w-28 rounded bg-white/10" />

          <div className="mt-6 h-9 w-48 rounded bg-white/10" />

          <div className="mt-3 h-5 w-80 max-w-full rounded bg-white/10" />

          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="h-14 border-b border-white/10 bg-white/[0.02]" />

            <div className="space-y-0">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="grid grid-cols-4 gap-6 border-b border-white/5 px-6 py-5 last:border-0"
                >
                  <div className="h-5 rounded bg-white/10" />
                  <div className="h-5 rounded bg-white/10" />
                  <div className="h-10 rounded bg-white/10" />
                  <div className="h-10 rounded bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const totalProducts = products.length;

  const outOfStockCount = products.filter(
    (product) =>
      Number(product.stock_quantity ?? 0) === 0
  ).length;

  const lowStockCount = products.filter((product) => {
    const stock = Number(
      product.stock_quantity ?? 0
    );

    return stock > 0 && stock <= 5;
  }).length;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition hover:text-white"
      >
        <span>←</span>
        Dashboard
      </Link>

      <div className="mt-7">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
          Inventory Management
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Inventory
        </h1>

        <p className="mt-2 text-sm text-white/50">
          Monitor and update product stock from one place.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="sc-card p-5">
          <p className="text-sm text-white/45">
            Total Products
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {totalProducts}
          </p>
        </div>

        <div className="sc-card p-5">
          <p className="text-sm text-white/45">
            Low Stock
          </p>

          <p className="mt-2 text-3xl font-bold text-amber-300">
            {lowStockCount}
          </p>

          <p className="mt-1 text-xs text-white/35">
            1–5 units remaining
          </p>
        </div>

        <div className="sc-card p-5">
          <p className="text-sm text-white/45">
            Out of Stock
          </p>

          <p className="mt-2 text-3xl font-bold text-red-300">
            {outOfStockCount}
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
          <div className="flex items-start gap-3">
            <span className="mt-0.5">!</span>
            <p>{error}</p>
          </div>
        </div>
      )}

      {message && (
        <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-300">
          <div className="flex items-start gap-3">
            <span className="mt-0.5">✓</span>
            <p>{message}</p>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05] text-2xl">
            📦
          </div>

          <h2 className="mt-5 text-lg font-semibold text-white">
            No products found
          </h2>

          <p className="mt-2 text-sm text-white/45">
            Add products before managing inventory.
          </p>

          <Link
            href="/admin/products/new"
            className="sc-button-primary mt-6 inline-flex"
          >
            Add Product
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="mt-8 hidden overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/20 md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead className="border-b border-white/10 bg-white/[0.025]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/40">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/40">
                      Current Stock
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/40">
                      New Stock
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-white/40">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {products.map((product) => {
                    const stock = Number(
                      product.stock_quantity ?? 0
                    );

                    const isLowStock =
                      stock > 0 && stock <= 5;

                    const isOutOfStock =
                      stock === 0;

                    return (
                      <tr
                        key={product.id}
                        className="transition hover:bg-white/[0.025]"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-sm font-bold text-violet-300">
                              {product.name
                                ?.charAt(0)
                                ?.toUpperCase() || "P"}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-medium text-white">
                                {product.name}
                              </p>

                              <p className="mt-1 text-xs text-white/35">
                                Product #{product.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={
                              isOutOfStock
                                ? "inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300"
                                : isLowStock
                                ? "inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300"
                                : "inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300"
                            }
                          >
                            {isOutOfStock
                              ? "Out of stock"
                              : isLowStock
                              ? "Low stock"
                              : "In stock"}
                          </span>

                          <p className="mt-2 text-sm font-semibold text-white">
                            {stock} units
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={
                              quantities[product.id] ??
                              stock
                            }
                            onChange={(event) =>
                              handleQuantityChange(
                                product.id,
                                event.target.value
                              )
                            }
                            className="sc-input w-32"
                          />
                        </td>

                        <td className="px-6 py-5 text-right">
                          <button
                            type="button"
                            disabled={
                              savingId === product.id
                            }
                            onClick={() =>
                              updateInventory(
                                product.id
                              )
                            }
                            className="sc-button-primary min-w-24 disabled:cursor-not-allowed disabled:opacity-50"
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
          </div>

          {/* Mobile */}
          <div className="mt-8 space-y-4 md:hidden">
            {products.map((product) => {
              const stock = Number(
                product.stock_quantity ?? 0
              );

              const isLowStock =
                stock > 0 && stock <= 5;

              const isOutOfStock =
                stock === 0;

              return (
                <div
                  key={product.id}
                  className="sc-card p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-sm font-bold text-violet-300">
                        {product.name
                          ?.charAt(0)
                          ?.toUpperCase() || "P"}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-white/35">
                          Product #{product.id}
                        </p>
                      </div>
                    </div>

                    <span
                      className={
                        isOutOfStock
                          ? "shrink-0 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-300"
                          : isLowStock
                          ? "shrink-0 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300"
                          : "shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300"
                      }
                    >
                      {isOutOfStock
                        ? "Out"
                        : isLowStock
                        ? "Low"
                        : "In Stock"}
                    </span>
                  </div>

                  <div className="mt-5 rounded-xl border border-white/5 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-wider text-white/35">
                      Current Stock
                    </p>

                    <p className="mt-1 text-2xl font-bold text-white">
                      {stock}
                    </p>
                  </div>

                  <div className="mt-5">
                    <label
                      htmlFor={`quantity-${product.id}`}
                      className="mb-2 block text-sm font-medium text-white/70"
                    >
                      New Stock
                    </label>

                    <input
                      id={`quantity-${product.id}`}
                      type="number"
                      min="0"
                      step="1"
                      value={
                        quantities[product.id] ??
                        stock
                      }
                      onChange={(event) =>
                        handleQuantityChange(
                          product.id,
                          event.target.value
                        )
                      }
                      className="sc-input w-full"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={
                      savingId === product.id
                    }
                    onClick={() =>
                      updateInventory(product.id)
                    }
                    className="sc-button-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingId === product.id
                      ? "Saving..."
                      : "Update Inventory"}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}