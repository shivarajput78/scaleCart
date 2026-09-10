// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// import { authenticatedRequest, apiRequest } from "@/lib/api";

// export default function NewProductPage() {
//   const router = useRouter();

//   const [categories, setCategories] = useState([]);

//   const [form, setForm] = useState({
//     categoryId: "",
//     name: "",
//     slug: "",
//     description: "",
//     price: "",
//     quantity: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [categoriesLoading, setCategoriesLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function fetchCategories() {
//       try {
//         const data = await apiRequest("/categories");

//         setCategories(
//           data.categories ||
//             data.data?.categories ||
//             data.data ||
//             []
//         );
//       } catch (error) {
//         console.error(error);
//         setError(
//           error.message || "Failed to load categories"
//         );
//       } finally {
//         setCategoriesLoading(false);
//       }
//     }

//     fetchCategories();
//   }, []);

//   function handleChange(event) {
//     const { name, value } = event.target;

//     setForm((current) => ({
//       ...current,
//       [name]: value,
//     }));
//   }

//   async function handleSubmit(event) {
//     event.preventDefault();

//     try {
//       setLoading(true);
//       setError("");

//       if (!form.categoryId) {
//         throw new Error("Please select a category");
//       }

//       if (!form.name.trim()) {
//         throw new Error("Product name is required");
//       }

//       if (!form.slug.trim()) {
//         throw new Error("Product slug is required");
//       }

//       if (
//         form.price === "" ||
//         Number(form.price) < 0
//       ) {
//         throw new Error("Enter a valid price");
//       }

//       if (
//         form.quantity === "" ||
//         !Number.isInteger(Number(form.quantity)) ||
//         Number(form.quantity) < 0
//       ) {
//         throw new Error("Enter a valid inventory quantity");
//       }

//       await authenticatedRequest("/products", {
//         method: "POST",
//         body: JSON.stringify({
//           categoryId: Number(form.categoryId),
//           name: form.name.trim(),
//           slug: form.slug.trim().toLowerCase(),
//           description: form.description.trim(),
//           price: Number(form.price),
//           quantity: Number(form.quantity),
//         }),
//       });

//       router.push("/admin/products");
//     } catch (error) {
//       console.error("Create product error:", error);

//       setError(
//         error.message || "Failed to create product"
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <section className="mx-auto max-w-3xl px-6 py-12">
//       <Link
//         href="/admin/products"
//         className="text-sm text-gray-500 hover:underline"
//       >
//         ← Back to Products
//       </Link>

//       <h1 className="mt-4 text-3xl font-bold">
//         Add Product
//       </h1>

//       <p className="mt-2 text-gray-600">
//         Create a new product and initialize its inventory.
//       </p>

//       {error && (
//         <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
//           {error}
//         </div>
//       )}

//       <form
//         onSubmit={handleSubmit}
//         className="mt-8 space-y-6 rounded-xl border bg-white p-8"
//       >
//         {/* Category */}
//         <div>
//           <label
//             htmlFor="categoryId"
//             className="mb-2 block text-sm font-medium"
//           >
//             Category
//           </label>

//           <select
//             id="categoryId"
//             name="categoryId"
//             value={form.categoryId}
//             onChange={handleChange}
//             disabled={categoriesLoading}
//             className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
//           >
//             <option value="">
//               {categoriesLoading
//                 ? "Loading categories..."
//                 : "Select category"}
//             </option>

//             {categories.map((category) => (
//               <option
//                 key={category.id}
//                 value={category.id}
//               >
//                 {category.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Name */}
//         <div>
//           <label
//             htmlFor="name"
//             className="mb-2 block text-sm font-medium"
//           >
//             Product Name
//           </label>

//           <input
//             id="name"
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             placeholder="Example: Wireless Headphones"
//             className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
//           />
//         </div>

//         {/* Slug */}
//         <div>
//           <label
//             htmlFor="slug"
//             className="mb-2 block text-sm font-medium"
//           >
//             Slug
//           </label>

//           <input
//             id="slug"
//             name="slug"
//             value={form.slug}
//             onChange={handleChange}
//             placeholder="wireless-headphones"
//             className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
//           />

//           <p className="mt-1 text-xs text-gray-500">
//             Slug must be unique.
//           </p>
//         </div>

//         {/* Description */}
//         <div>
//           <label
//             htmlFor="description"
//             className="mb-2 block text-sm font-medium"
//           >
//             Description
//           </label>

//           <textarea
//             id="description"
//             name="description"
//             value={form.description}
//             onChange={handleChange}
//             rows={5}
//             placeholder="Describe the product..."
//             className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
//           />
//         </div>

//         {/* Price + Quantity */}
//         <div className="grid gap-6 sm:grid-cols-2">
//           <div>
//             <label
//               htmlFor="price"
//               className="mb-2 block text-sm font-medium"
//             >
//               Price
//             </label>

//             <input
//               id="price"
//               name="price"
//               type="number"
//               min="0"
//               step="0.01"
//               value={form.price}
//               onChange={handleChange}
//               placeholder="999.00"
//               className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="quantity"
//               className="mb-2 block text-sm font-medium"
//             >
//               Initial Stock
//             </label>

//             <input
//               id="quantity"
//               name="quantity"
//               type="number"
//               min="0"
//               step="1"
//               value={form.quantity}
//               onChange={handleChange}
//               placeholder="100"
//               className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
//             />
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row">
//           <button
//             type="submit"
//             disabled={loading}
//             className="rounded-lg bg-black px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {loading
//               ? "Creating..."
//               : "Create Product"}
//           </button>

//           <Link
//             href="/admin/products"
//             className="rounded-lg border px-6 py-3 text-center font-medium"
//           >
//             Cancel
//           </Link>
//         </div>
//       </form>
//     </section>
//   );
// }





"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authenticatedRequest, apiRequest } from "@/lib/api";

export default function NewProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    categoryId: "",
    name: "",
    slug: "",
    description: "",
    price: "",
    quantity: "",
  });

  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] =
    useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await apiRequest("/categories");

        setCategories(
          data.categories ||
            data.data?.categories ||
            data.data ||
            []
        );
      } catch (error) {
        console.error(error);

        setError(
          error.message || "Failed to load categories"
        );
      } finally {
        setCategoriesLoading(false);
      }
    }

    fetchCategories();
  }, []);

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
      setLoading(true);
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

      if (
        form.quantity === "" ||
        !Number.isInteger(Number(form.quantity)) ||
        Number(form.quantity) < 0
      ) {
        throw new Error(
          "Enter a valid inventory quantity"
        );
      }

      await authenticatedRequest("/products", {
        method: "POST",
        body: JSON.stringify({
          categoryId: Number(form.categoryId),
          name: form.name.trim(),
          slug: form.slug.trim().toLowerCase(),
          description: form.description.trim(),
          price: Number(form.price),
          quantity: Number(form.quantity),
        }),
      });

      router.push("/admin/products");
    } catch (error) {
      console.error(
        "Create product error:",
        error
      );

      setError(
        error.message || "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-[calc(100vh-72px)] overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-fuchsia-600/5 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-5xl px-6 py-14 sm:py-16">
        {/* Header */}
        <div>
          <Link
            href="/admin/products"
            className="text-sm text-white/40 transition hover:text-violet-300"
          >
            ← Back to Products
          </Link>

          <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
              Catalog Management
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
              Add Product
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Create a new product and initialize its inventory.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-300">
                !
              </span>

              <div>
                <p className="font-medium text-red-200">
                  Unable to create product
                </p>

                <p className="mt-1 text-sm text-red-300/70">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/30"
        >
          <div className="p-6 sm:p-8 lg:p-10">
            {/* Product basics */}
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-sm font-semibold text-violet-300">
                  01
                </span>

                <div>
                  <h2 className="font-semibold text-white">
                    Product Information
                  </h2>

                  <p className="text-xs text-white/30">
                    Basic details for your product listing
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-6">
                {/* Category */}
                <div>
                  <label
                    htmlFor="categoryId"
                    className="mb-2 block text-sm font-medium text-white/80"
                  >
                    Category
                  </label>

                  <select
                    id="categoryId"
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    disabled={categoriesLoading}
                    className="sc-input w-full appearance-none"
                  >
                    <option value="">
                      {categoriesLoading
                        ? "Loading categories..."
                        : "Select category"}
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

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-white/80"
                  >
                    Product Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Example: Wireless Headphones"
                    className="sc-input w-full"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label
                    htmlFor="slug"
                    className="mb-2 block text-sm font-medium text-white/80"
                  >
                    Slug
                  </label>

                  <input
                    id="slug"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="wireless-headphones"
                    className="sc-input w-full"
                  />

                  <p className="mt-2 text-xs text-white/30">
                    Slug must be unique.
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-white/80"
                  >
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Describe the product..."
                    className="sc-input w-full resize-y"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & inventory */}
            <div className="mt-10 border-t border-white/10 pt-8">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-sm font-semibold text-violet-300">
                  02
                </span>

                <div>
                  <h2 className="font-semibold text-white">
                    Pricing & Inventory
                  </h2>

                  <p className="text-xs text-white/30">
                    Set the selling price and initial stock
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                {/* Price */}
                <div>
                  <label
                    htmlFor="price"
                    className="mb-2 block text-sm font-medium text-white/80"
                  >
                    Price
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/30">
                      ₹
                    </span>

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="999.00"
                      className="sc-input w-full pl-9"
                    />
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label
                    htmlFor="quantity"
                    className="mb-2 block text-sm font-medium text-white/80"
                  >
                    Initial Stock
                  </label>

                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    step="1"
                    value={form.quantity}
                    onChange={handleChange}
                    placeholder="100"
                    className="sc-input w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-white/10 bg-white/[0.015] p-6 sm:flex-row sm:justify-end sm:px-8 lg:px-10">
            <Link
              href="/admin/products"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="sc-button-primary px-6 py-3.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating...
                </span>
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}