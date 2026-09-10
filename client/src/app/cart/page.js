// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// import { authenticatedRequest } from "@/lib/api";
// import { getAccessToken } from "@/lib/auth";

// export default function CartPage() {
//   const router = useRouter();

//   const [cart, setCart] = useState(null);
//   const [items, setItems] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Initial cart loading
//   useEffect(() => {
//     let cancelled = false;

//     async function fetchCart() {
//       try {
//         const token = getAccessToken();

//         if (!token) {
//           router.push("/login");
//           return;
//         }

//         const data = await authenticatedRequest("/cart");

//         if (cancelled) {
//           return;
//         }

//         const cartData = data.cart || data;

//         setCart(cartData);
//         setItems(cartData.items || []);
//         setError("");
//         setLoading(false);
//       } catch (error) {
//         if (cancelled) {
//           return;
//         }

//         console.error("Cart error:", error);

//         setError(
//           error.message || "Failed to load cart"
//         );

//         setLoading(false);
//       }
//     }

//     fetchCart();

//     return () => {
//       cancelled = true;
//     };
//   }, [router]);

//   async function refreshCart() {
//     try {
//       const data = await authenticatedRequest("/cart");

//       const cartData = data.cart || data;

//       setCart(cartData);
//       setItems(cartData.items || []);
//       setError("");
//     } catch (error) {
//       console.error("Refresh cart error:", error);

//       setError(
//         error.message || "Failed to refresh cart"
//       );
//     }
//   }

//   async function updateQuantity(productId, quantity) {
//     if (quantity < 1) {
//       return;
//     }

//     try {
//       setError("");

//       await authenticatedRequest(
//         `/cart/items/${productId}`,
//         {
//           method: "PUT",
//           body: JSON.stringify({
//             quantity,
//           }),
//         }
//       );

//       await refreshCart();
//     } catch (error) {
//       console.error("Update quantity error:", error);

//       setError(
//         error.message || "Failed to update quantity"
//       );
//     }
//   }

//   async function removeItem(productId) {
//     try {
//       setError("");

//       await authenticatedRequest(
//         `/cart/items/${productId}`,
//         {
//           method: "DELETE",
//         }
//       );

//       await refreshCart();
//     } catch (error) {
//       console.error("Remove item error:", error);

//       setError(
//         error.message || "Failed to remove item"
//       );
//     }
//   }

//   function calculateSubtotal() {
//     return items.reduce((total, item) => {
//       return (
//         total +
//         Number(item.price) * Number(item.quantity)
//       );
//     }, 0);
//   }

//   if (loading) {
//     return (
//       <section className="mx-auto max-w-7xl px-6 py-20 text-center">
//         <p className="text-gray-500">
//           Loading cart...
//         </p>
//       </section>
//     );
//   }

//   if (error && items.length === 0) {
//     return (
//       <section className="mx-auto max-w-7xl px-6 py-20">
//         <div className="rounded-lg bg-red-50 p-5 text-red-700">
//           {error}
//         </div>

//         <Link
//           href="/products"
//           className="mt-5 inline-block rounded-lg bg-black px-5 py-3 text-white"
//         >
//           Back to Products
//         </Link>
//       </section>
//     );
//   }

//   if (items.length === 0) {
//     return (
//       <section className="mx-auto max-w-7xl px-6 py-20 text-center">
//         <h1 className="text-3xl font-bold">
//           Your Cart is Empty
//         </h1>

//         <p className="mt-3 text-gray-500">
//           Add some products to your cart.
//         </p>

//         <Link
//           href="/products"
//           className="mt-6 inline-block rounded-lg bg-black px-6 py-3 font-medium text-white"
//         >
//           Browse Products
//         </Link>
//       </section>
//     );
//   }

//   const subtotal = calculateSubtotal();

//   const shippingFee =
//     subtotal >= 500 ? 0 : 50;

//   const total = subtotal + shippingFee;

//   return (
//     <section className="mx-auto max-w-7xl px-6 py-10">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold">
//           Your Cart
//         </h1>

//         <p className="mt-2 text-gray-500">
//           Review your items before checkout.
//         </p>
//       </div>

//       {error && (
//         <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
//           {error}
//         </div>
//       )}

//       <div className="grid gap-8 lg:grid-cols-3">
//         {/* Cart Items */}

//         <div className="space-y-4 lg:col-span-2">
//           {items.map((item) => {
//             const price = Number(item.price);
//             const quantity = Number(item.quantity);
//             const stock = Number(item.stock_quantity);

//             const itemTotal = price * quantity;

//             return (
//               <div
//                 key={item.product_id}
//                 className="rounded-xl border bg-white p-5"
//               >
//                 <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
//                   {/* Product Info */}

//                   <div>
//                     <h2 className="text-lg font-semibold">
//                       {item.name}
//                     </h2>

//                     <p className="mt-2 text-gray-600">
//                       ₹{price.toFixed(2)}
//                     </p>

//                     <p className="mt-1 text-sm text-gray-500">
//                       Available stock: {stock}
//                     </p>
//                   </div>

//                   {/* Quantity */}

//                   <div className="flex items-center gap-3">
//                     <button
//                       type="button"
//                       disabled={quantity <= 1}
//                       onClick={() =>
//                         updateQuantity(
//                           item.product_id,
//                           quantity - 1
//                         )
//                       }
//                       className="h-9 w-9 rounded-lg border disabled:cursor-not-allowed disabled:opacity-40"
//                     >
//                       -
//                     </button>

//                     <span className="w-8 text-center font-medium">
//                       {quantity}
//                     </span>

//                     <button
//                       type="button"
//                       disabled={quantity >= stock}
//                       onClick={() =>
//                         updateQuantity(
//                           item.product_id,
//                           quantity + 1
//                         )
//                       }
//                       className="h-9 w-9 rounded-lg border disabled:cursor-not-allowed disabled:opacity-40"
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>

//                 {/* Item Total */}

//                 <div className="mt-5 flex items-center justify-between border-t pt-4">
//                   <p className="font-semibold">
//                     ₹{itemTotal.toFixed(2)}
//                   </p>

//                   <button
//                     type="button"
//                     onClick={() =>
//                       removeItem(item.product_id)
//                     }
//                     className="text-sm font-medium text-red-600 hover:underline"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Order Summary */}

//         <div className="h-fit rounded-xl border bg-white p-6">
//           <h2 className="text-xl font-bold">
//             Order Summary
//           </h2>

//           <div className="mt-6 space-y-4">
//             <div className="flex justify-between">
//               <span className="text-gray-600">
//                 Subtotal
//               </span>

//               <span className="font-medium">
//                 ₹{subtotal.toFixed(2)}
//               </span>
//             </div>

//             <div className="flex justify-between">
//               <span className="text-gray-600">
//                 Shipping
//               </span>

//               <span className="font-medium">
//                 {shippingFee === 0
//                   ? "FREE"
//                   : `₹${shippingFee.toFixed(2)}`}
//               </span>
//             </div>
//           </div>

//           <div className="mt-6 border-t pt-5">
//             <div className="flex justify-between">
//               <span className="font-bold">
//                 Total
//               </span>

//               <span className="text-xl font-bold">
//                 ₹{total.toFixed(2)}
//               </span>
//             </div>
//           </div>

//           <Link
//             href="/checkout"
//             className="mt-6 block rounded-lg bg-black px-6 py-3 text-center font-medium text-white"
//           >
//             Proceed to Checkout
//           </Link>

//           <Link
//             href="/products"
//             className="mt-3 block text-center text-sm text-gray-600 hover:underline"
//           >
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authenticatedRequest } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchCart() {
      try {
        const token = getAccessToken();

        if (!token) {
          router.push("/login");
          return;
        }

        const data = await authenticatedRequest("/cart");

        if (cancelled) {
          return;
        }

        const cartData = data.cart || data;

        setCart(cartData);
        setItems(cartData.items || []);
        setError("");
        setLoading(false);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Cart error:", error);

        setError(
          error.message || "Failed to load cart"
        );

        setLoading(false);
      }
    }

    fetchCart();

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function refreshCart() {
    try {
      const data = await authenticatedRequest("/cart");

      const cartData = data.cart || data;

      setCart(cartData);
      setItems(cartData.items || []);
      setError("");
    } catch (error) {
      console.error("Refresh cart error:", error);

      setError(
        error.message || "Failed to refresh cart"
      );
    }
  }

  async function updateQuantity(productId, quantity) {
    if (quantity < 1) {
      return;
    }

    try {
      setError("");

      await authenticatedRequest(
        `/cart/items/${productId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            quantity,
          }),
        }
      );

      await refreshCart();
    } catch (error) {
      console.error("Update quantity error:", error);

      setError(
        error.message || "Failed to update quantity"
      );
    }
  }

  async function removeItem(productId) {
    try {
      setError("");

      await authenticatedRequest(
        `/cart/items/${productId}`,
        {
          method: "DELETE",
        }
      );

      await refreshCart();
    } catch (error) {
      console.error("Remove item error:", error);

      setError(
        error.message || "Failed to remove item"
      );
    }
  }

  function calculateSubtotal() {
    return items.reduce((total, item) => {
      return (
        total +
        Number(item.price) * Number(item.quantity)
      );
    }, 0);
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]" />

          <div className="mx-auto mt-6 h-6 w-36 animate-pulse rounded-lg bg-white/[0.06]" />

          <div className="mx-auto mt-3 h-4 w-64 animate-pulse rounded-lg bg-white/[0.04]" />
        </div>
      </section>
    );
  }

  if (error && items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-red-500/20 bg-red-500/[0.06] p-8 text-center shadow-2xl shadow-black/20">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-xl text-red-300">
            !
          </div>

          <h1 className="mt-6 text-2xl font-bold text-white">
            Unable to load your cart
          </h1>

          <p className="mt-3 text-sm leading-6 text-red-200/70">
            {error}
          </p>

          <Link
            href="/products"
            className="mt-7 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
          >
            Back to Products
          </Link>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-400/15 bg-violet-500/10 text-3xl shadow-[0_0_60px_rgba(139,92,246,0.12)]">
            🛒
          </div>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.22em] text-violet-300">
            Shopping cart
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Your Cart is Empty
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-white/50">
            Looks like you haven&apos;t added anything yet.
            Explore our products and find something you love.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex items-center rounded-xl bg-violet-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-400 hover:shadow-violet-500/30"
          >
            Browse Products
            <span className="ml-2">→</span>
          </Link>
        </div>
      </section>
    );
  }

  const subtotal = calculateSubtotal();

  const shippingFee =
    subtotal >= 500 ? 0 : 50;

  const total = subtotal + shippingFee;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-300">
              Shopping cart
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Your Cart
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/50 sm:text-base">
              Review your items and make sure everything looks
              right before checkout.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex w-fit items-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-5 py-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Cart Items */}
        <div className="space-y-4">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Cart Items
            </h2>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/50">
              {items.length}{" "}
              {items.length === 1 ? "item" : "items"}
            </span>
          </div>

          {items.map((item) => {
            const price = Number(item.price);
            const quantity = Number(item.quantity);
            const stock = Number(item.stock_quantity);

            const itemTotal = price * quantity;

            return (
              <div
                key={item.product_id}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-xl shadow-black/10 transition duration-300 hover:border-white/15 hover:bg-white/[0.05]"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  {/* Product */}
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-violet-400/10 bg-gradient-to-br from-violet-500/15 via-white/[0.03] to-fuchsia-500/10 text-2xl">
                      ◇
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-base font-semibold text-white sm:text-lg">
                        {item.name}
                      </h2>

                      <p className="mt-1 text-sm text-white/50">
                        ₹{price.toFixed(2)} each
                      </p>

                      <p className="mt-1 text-xs text-white/35">
                        {stock > 0
                          ? `${stock} available`
                          : "Out of stock"}
                      </p>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center justify-between gap-5 sm:justify-end">
                    <div className="flex items-center rounded-xl border border-white/10 bg-black/20 p-1">
                      <button
                        type="button"
                        disabled={quantity <= 1}
                        onClick={() =>
                          updateQuantity(
                            item.product_id,
                            quantity - 1
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-white/60 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <span className="w-10 text-center text-sm font-semibold text-white">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        disabled={quantity >= stock}
                        onClick={() =>
                          updateQuantity(
                            item.product_id,
                            quantity + 1
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-white/60 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      removeItem(item.product_id)
                    }
                    className="text-sm font-medium text-red-300/70 transition hover:text-red-300"
                  >
                    Remove
                  </button>

                  <div className="text-right">
                    <p className="text-xs text-white/35">
                      Item total
                    </p>

                    <p className="mt-1 text-lg font-bold text-white">
                      ₹{itemTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <aside className="h-fit lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20">
            <div className="border-b border-white/[0.07] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                Checkout
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                Order Summary
              </h2>
            </div>

            <div className="space-y-5 p-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">
                  Subtotal
                </span>

                <span className="font-medium text-white">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">
                  Shipping
                </span>

                <span
                  className={
                    shippingFee === 0
                      ? "font-semibold text-emerald-300"
                      : "font-medium text-white"
                  }
                >
                  {shippingFee === 0
                    ? "FREE"
                    : `₹${shippingFee.toFixed(2)}`}
                </span>
              </div>

              {shippingFee > 0 && (
                <div className="rounded-xl border border-violet-400/10 bg-violet-500/[0.06] px-4 py-3 text-xs leading-5 text-violet-200/70">
                  Add ₹
                  {(500 - subtotal).toFixed(2)} more to
                  unlock free shipping.
                </div>
              )}

              <div className="border-t border-white/[0.08] pt-5">
                <div className="flex items-end justify-between">
                  <span className="font-semibold text-white">
                    Total
                  </span>

                  <span className="text-2xl font-bold tracking-tight text-white">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full rounded-xl bg-violet-500 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-400 hover:shadow-violet-500/30"
              >
                Proceed to Checkout
                <span className="ml-2">→</span>
              </Link>

              <Link
                href="/products"
                className="block text-center text-sm font-medium text-white/40 transition hover:text-white"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Trust Card */}
          <div className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg">🔒</div>
                <p className="mt-2 text-xs font-medium text-white/60">
                  Secure checkout
                </p>
              </div>

              <div>
                <div className="text-lg">✓</div>
                <p className="mt-2 text-xs font-medium text-white/60">
                  Reliable delivery
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}