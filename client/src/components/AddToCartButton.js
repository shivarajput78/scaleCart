// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// import { authenticatedRequest } from "@/lib/api";
// import { getAccessToken } from "@/lib/auth";

// export default function AddToCartButton({
//   productId,
//   stockQuantity,
// }) {
//   const router = useRouter();

//   const [quantity, setQuantity] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const numericProductId = Number(productId);
//   const stock = Number(stockQuantity);

//   async function handleAddToCart() {
//     try {
//       setLoading(true);
//       setError("");
//       setMessage("");

//       const token = getAccessToken();

//       if (!token) {
//         router.push("/login");
//         return;
//       }

//       if (!Number.isInteger(numericProductId) || numericProductId <= 0) {
//         setError("Invalid product ID");
//         return;
//       }

//       if (quantity < 1 || quantity > stock) {
//         setError("Invalid quantity");
//         return;
//       }

//       console.log("Adding to cart:", {
//         productId: numericProductId,
//         quantity,
//       });

//       await authenticatedRequest("/cart/items", {
//         method: "POST",
//         body: JSON.stringify({
//           productId: numericProductId,
//           quantity,
//         }),
//       });

//       setMessage("Product added to cart");

//       setTimeout(() => {
//         router.push("/cart");
//       }, 700);
//     } catch (error) {
//       console.error("Add to cart error:", error);

//       setError(
//         error.message || "Failed to add product to cart"
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (stock <= 0) {
//     return (
//       <div className="mt-8">
//         <button
//           type="button"
//           disabled
//           className="rounded-xl border border-red-500/20 bg-red-500/10 px-6 py-3 font-semibold text-red-300"
//         >
//           Out of Stock
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-8">
//       <div className="flex items-center gap-3">
//         <button
//           type="button"
//           disabled={quantity <= 1 || loading}
//           onClick={() =>
//             setQuantity((current) => current - 1)
//           }
//           className="h-10 w-10 rounded-lg border disabled:cursor-not-allowed disabled:opacity-40"
//         >
//           -
//         </button>

//         <span className="w-8 text-center font-medium">
//           {quantity}
//         </span>

//         <button
//           type="button"
//           disabled={quantity >= stock || loading}
//           onClick={() =>
//             setQuantity((current) => current + 1)
//           }
//           className="h-10 w-10 rounded-lg border disabled:cursor-not-allowed disabled:opacity-40"
//         >
//           +
//         </button>
//       </div>

//       <button
//         type="button"
//         disabled={loading}
//         onClick={handleAddToCart}
//         className="mt-4 rounded-lg bg-black px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
//       >
//         {loading ? "Adding..." : "Add to Cart"}
//       </button>

//       {message && (
//         <p className="mt-3 text-sm font-medium">
//           {message}
//         </p>
//       )}

//       {error && (
//         <p className="mt-3 text-sm font-medium text-red-600">
//           {error}
//         </p>
//       )}
//     </div>
//   );
// }




"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authenticatedRequest } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

export default function AddToCartButton({
  productId,
  stockQuantity,
}) {
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const numericProductId = Number(productId);
  const stock = Number(stockQuantity);

  async function handleAddToCart() {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const token = getAccessToken();

      if (!token) {
        router.push("/login");
        return;
      }

      if (
        !Number.isInteger(numericProductId) ||
        numericProductId <= 0
      ) {
        setError("Invalid product ID");
        return;
      }

      if (quantity < 1 || quantity > stock) {
        setError("Invalid quantity");
        return;
      }

      console.log("Adding to cart:", {
        productId: numericProductId,
        quantity,
      });

      await authenticatedRequest("/cart/items", {
        method: "POST",
        body: JSON.stringify({
          productId: numericProductId,
          quantity,
        }),
      });

      setMessage("Product added to cart");

      setTimeout(() => {
        router.push("/cart");
      }, 700);
    } catch (error) {
      console.error("Add to cart error:", error);

      setError(
        error.message || "Failed to add product to cart"
      );
    } finally {
      setLoading(false);
    }
  }

  if (stock <= 0) {
    return (
      <div className="mt-8">
        <button
          type="button"
          disabled
          className="rounded-xl border border-red-500/20 bg-red-500/10 px-6 py-3 font-semibold text-red-300 disabled:cursor-not-allowed"
        >
          Out of Stock
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={quantity <= 1 || loading}
          onClick={() =>
            setQuantity((current) => current - 1)
          }
          aria-label="Decrease quantity"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] text-lg font-medium text-white transition duration-200 hover:border-violet-400/50 hover:bg-violet-500/10 hover:text-violet-300 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/30 disabled:opacity-60"
        >
          −
        </button>

        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-base font-semibold text-white">
          {quantity}
        </span>

        <button
          type="button"
          disabled={quantity >= stock || loading}
          onClick={() =>
            setQuantity((current) => current + 1)
          }
          aria-label="Increase quantity"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] text-lg font-medium text-white transition duration-200 hover:border-violet-400/50 hover:bg-violet-500/10 hover:text-violet-300 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/30 disabled:opacity-60"
        >
          +
        </button>
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={handleAddToCart}
        className="mt-4 inline-flex min-h-12 min-w-48 items-center justify-center rounded-xl bg-violet-600 px-6 text-base font-semibold text-white shadow-lg shadow-violet-500/20 transition duration-200 hover:-translate-y-0.5 hover:bg-violet-500 hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>

      {message && (
        <p className="mt-3 text-sm font-medium text-emerald-400">
          {message}
        </p>
      )}

      {error && (
        <p className="mt-3 text-sm font-medium text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}