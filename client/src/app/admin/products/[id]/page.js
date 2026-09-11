// // "use client";

// // import Link from "next/link";
// // import { useParams, useRouter } from "next/navigation";
// // import { useEffect, useState } from "react";

// // import { apiRequest, authenticatedRequest } from "@/lib/api";

// // export default function EditProductPage() {
// //   const params = useParams();
// //   const router = useRouter();

// //   const [categories, setCategories] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);
// //   const [error, setError] = useState("");

// //   const [form, setForm] = useState({
// //     categoryId: "",
// //     name: "",
// //     slug: "",
// //     description: "",
// //     price: "",
// //     status: "active",
// //   });

// //   useEffect(() => {
// //     async function loadProduct() {
// //       try {
// //         const [productData, categoryData] =
// //           await Promise.all([
// //             apiRequest(`/products/${params.id}`),
// //             apiRequest("/categories"),
// //           ]);

// //         const product =
// //           productData.product ||
// //           productData.data;

// //         const categoriesResult =
// //           categoryData.categories ||
// //           categoryData.data?.categories ||
// //           categoryData.data ||
// //           [];

// //         setCategories(categoriesResult);

// //         if (!product) {
// //           throw new Error("Product not found");
// //         }

// //         setForm({
// //           categoryId: String(product.category_id || ""),
// //           name: product.name || "",
// //           slug: product.slug || "",
// //           description: product.description || "",
// //           price: String(product.price ?? ""),
// //           status: product.status || "active",
// //         });
// //       } catch (error) {
// //         console.error(error);

// //         setError(
// //           error.message || "Failed to load product"
// //         );
// //       } finally {
// //         setLoading(false);
// //       }
// //     }

// //     loadProduct();
// //   }, [params.id]);

// //   function handleChange(event) {
// //     const { name, value } = event.target;

// //     setForm((current) => ({
// //       ...current,
// //       [name]: value,
// //     }));
// //   }

// //   async function handleSubmit(event) {
// //     event.preventDefault();

// //     try {
// //       setSaving(true);
// //       setError("");

// //       if (!form.categoryId) {
// //         throw new Error("Please select a category");
// //       }

// //       if (!form.name.trim()) {
// //         throw new Error("Product name is required");
// //       }

// //       if (!form.slug.trim()) {
// //         throw new Error("Product slug is required");
// //       }

// //       if (
// //         form.price === "" ||
// //         Number(form.price) < 0
// //       ) {
// //         throw new Error("Enter a valid price");
// //       }

// //       await authenticatedRequest(
// //         `/products/${params.id}`,
// //         {
// //           method: "PATCH",
// //           body: JSON.stringify({
// //             categoryId: Number(form.categoryId),
// //             name: form.name.trim(),
// //             slug: form.slug.trim().toLowerCase(),
// //             description: form.description.trim(),
// //             price: Number(form.price),
// //             status: form.status,
// //           }),
// //         }
// //       );

// //       router.push("/admin/products");
// //     } catch (error) {
// //       console.error("Update product error:", error);

// //       setError(
// //         error.message || "Failed to update product"
// //       );
// //     } finally {
// //       setSaving(false);
// //     }
// //   }

// //   if (loading) {
// //     return (
// //       <section className="mx-auto max-w-3xl px-6 py-12">
// //         <p>Loading product...</p>
// //       </section>
// //     );
// //   }

// //   return (
// //     <section className="mx-auto max-w-3xl px-6 py-12">
// //       <Link
// //         href="/admin/products"
// //         className="text-sm text-gray-500 hover:underline"
// //       >
// //         ← Back to Products
// //       </Link>

// //       <h1 className="mt-4 text-3xl font-bold">
// //         Edit Product
// //       </h1>

// //       {error && (
// //         <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
// //           {error}
// //         </div>
// //       )}

// //       <form
// //         onSubmit={handleSubmit}
// //         className="mt-8 space-y-6 rounded-xl border bg-white p-8"
// //       >
// //         <div>
// //           <label
// //             htmlFor="categoryId"
// //             className="mb-2 block text-sm font-medium"
// //           >
// //             Category
// //           </label>

// //           <select
// //             id="categoryId"
// //             name="categoryId"
// //             value={form.categoryId}
// //             onChange={handleChange}
// //             className="w-full rounded-lg border px-4 py-3"
// //           >
// //             <option value="">
// //               Select category
// //             </option>

// //             {categories.map((category) => (
// //               <option
// //                 key={category.id}
// //                 value={category.id}
// //               >
// //                 {category.name}
// //               </option>
// //             ))}
// //           </select>
// //         </div>

// //         <div>
// //           <label
// //             htmlFor="name"
// //             className="mb-2 block text-sm font-medium"
// //           >
// //             Product Name
// //           </label>

// //           <input
// //             id="name"
// //             name="name"
// //             value={form.name}
// //             onChange={handleChange}
// //             className="w-full rounded-lg border px-4 py-3"
// //           />
// //         </div>

// //         <div>
// //           <label
// //             htmlFor="slug"
// //             className="mb-2 block text-sm font-medium"
// //           >
// //             Slug
// //           </label>

// //           <input
// //             id="slug"
// //             name="slug"
// //             value={form.slug}
// //             onChange={handleChange}
// //             className="w-full rounded-lg border px-4 py-3"
// //           />
// //         </div>

// //         <div>
// //           <label
// //             htmlFor="description"
// //             className="mb-2 block text-sm font-medium"
// //           >
// //             Description
// //           </label>

// //           <textarea
// //             id="description"
// //             name="description"
// //             rows={5}
// //             value={form.description}
// //             onChange={handleChange}
// //             className="w-full rounded-lg border px-4 py-3"
// //           />
// //         </div>

// //         <div>
// //           <label
// //             htmlFor="price"
// //             className="mb-2 block text-sm font-medium"
// //           >
// //             Price
// //           </label>

// //           <input
// //             id="price"
// //             name="price"
// //             type="number"
// //             min="0"
// //             step="0.01"
// //             value={form.price}
// //             onChange={handleChange}
// //             className="w-full rounded-lg border px-4 py-3"
// //           />
// //         </div>

// //         <div>
// //           <label
// //             htmlFor="status"
// //             className="mb-2 block text-sm font-medium"
// //           >
// //             Status
// //           </label>

// //           <select
// //             id="status"
// //             name="status"
// //             value={form.status}
// //             onChange={handleChange}
// //             className="w-full rounded-lg border px-4 py-3"
// //           >
// //             <option value="active">
// //               Active
// //             </option>

// //             <option value="inactive">
// //               Inactive
// //             </option>
// //           </select>
// //         </div>

// //         <div className="flex gap-3 border-t pt-6">
// //           <button
// //             type="submit"
// //             disabled={saving}
// //             className="rounded-lg bg-black px-6 py-3 font-medium text-white disabled:opacity-50"
// //           >
// //             {saving ? "Saving..." : "Save Changes"}
// //           </button>

// //           <Link
// //             href="/admin/products"
// //             className="rounded-lg border px-6 py-3 font-medium"
// //           >
// //             Cancel
// //           </Link>
// //         </div>
// //       </form>
// //     </section>
// //   );
// // }



// "use client";

// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// import { apiRequest, authenticatedRequest } from "@/lib/api";

// export default function EditProductPage() {
//   const params = useParams();
//   const router = useRouter();

//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   const [form, setForm] = useState({
//     categoryId: "",
//     name: "",
//     slug: "",
//     description: "",
//     price: "",
//     status: "active",
//   });

//   useEffect(() => {
//     async function loadProduct() {
//       try {
//         const [productData, categoryData] = await Promise.all([
//           apiRequest(`/products/${params.id}`),
//           apiRequest("/categories"),
//         ]);

//         const product =
//           productData.product ||
//           productData.data;

//         const categoriesResult =
//           categoryData.categories ||
//           categoryData.data?.categories ||
//           categoryData.data ||
//           [];

//         setCategories(categoriesResult);

//         if (!product) {
//           throw new Error("Product not found");
//         }

//         setForm({
//           categoryId: String(product.category_id || ""),
//           name: product.name || "",
//           slug: product.slug || "",
//           description: product.description || "",
//           price: String(product.price ?? ""),
//           status: product.status || "active",
//         });
//       } catch (error) {
//         console.error(error);

//         setError(
//           error.message || "Failed to load product"
//         );
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadProduct();
//   }, [params.id]);

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
//       setSaving(true);
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

//       await authenticatedRequest(
//         `/products/${params.id}`,
//         {
//           method: "PATCH",
//           body: JSON.stringify({
//             categoryId: Number(form.categoryId),
//             name: form.name.trim(),
//             slug: form.slug.trim().toLowerCase(),
//             description: form.description.trim(),
//             price: Number(form.price),
//             status: form.status,
//           }),
//         }
//       );

//       router.push("/admin/products");
//     } catch (error) {
//       console.error("Update product error:", error);

//       setError(
//         error.message || "Failed to update product"
//       );
//     } finally {
//       setSaving(false);
//     }
//   }

//   if (loading) {
//     return (
//       <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
//         <div className="animate-pulse">
//           <div className="h-4 w-32 rounded bg-white/10" />

//           <div className="mt-6 h-9 w-64 rounded bg-white/10" />
//           <div className="mt-3 h-5 w-96 max-w-full rounded bg-white/10" />

//           <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
//             <div className="space-y-7">
//               <div>
//                 <div className="mb-3 h-4 w-24 rounded bg-white/10" />
//                 <div className="h-12 rounded-xl bg-white/10" />
//               </div>

//               <div>
//                 <div className="mb-3 h-4 w-32 rounded bg-white/10" />
//                 <div className="h-12 rounded-xl bg-white/10" />
//               </div>

//               <div>
//                 <div className="mb-3 h-4 w-16 rounded bg-white/10" />
//                 <div className="h-12 rounded-xl bg-white/10" />
//               </div>

//               <div>
//                 <div className="mb-3 h-4 w-24 rounded bg-white/10" />
//                 <div className="h-32 rounded-xl bg-white/10" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
//       <Link
//         href="/admin/products"
//         className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition hover:text-white"
//       >
//         <span>←</span>
//         Back to Products
//       </Link>

//       <div className="mt-7">
//         <div className="flex flex-col gap-3">
//           <div>
//             <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
//               Product Management
//             </p>

//             <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
//               Edit Product
//             </h1>

//             <p className="mt-2 text-sm text-white/50">
//               Update product information, pricing and availability.
//             </p>
//           </div>
//         </div>
//       </div>

//       {error && (
//         <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
//           <div className="flex items-start gap-3">
//             <span className="mt-0.5">!</span>
//             <p>{error}</p>
//           </div>
//         </div>
//       )}

//       <form
//         onSubmit={handleSubmit}
//         className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/20"
//       >
//         <div className="border-b border-white/10 px-5 py-5 sm:px-8">
//           <h2 className="text-lg font-semibold text-white">
//             Product Information
//           </h2>

//           <p className="mt-1 text-sm text-white/45">
//             Keep the product details accurate and customer-friendly.
//           </p>
//         </div>

//         <div className="space-y-7 px-5 py-6 sm:px-8 sm:py-8">
//           <div>
//             <label
//               htmlFor="categoryId"
//               className="mb-2 block text-sm font-medium text-white/80"
//             >
//               Category
//             </label>

//             <select
//               id="categoryId"
//               name="categoryId"
//               value={form.categoryId}
//               onChange={handleChange}
//               className="sc-input w-full"
//             >
//               <option value="">Select category</option>

//               {categories.map((category) => (
//                 <option
//                   key={category.id}
//                   value={category.id}
//                 >
//                   {category.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label
//               htmlFor="name"
//               className="mb-2 block text-sm font-medium text-white/80"
//             >
//               Product Name
//             </label>

//             <input
//               id="name"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               placeholder="Enter product name"
//               className="sc-input w-full"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="slug"
//               className="mb-2 block text-sm font-medium text-white/80"
//             >
//               Slug
//             </label>

//             <input
//               id="slug"
//               name="slug"
//               value={form.slug}
//               onChange={handleChange}
//               placeholder="product-slug"
//               className="sc-input w-full"
//             />

//             <p className="mt-2 text-xs text-white/35">
//               The slug will be converted to lowercase when saved.
//             </p>
//           </div>

//           <div>
//             <label
//               htmlFor="description"
//               className="mb-2 block text-sm font-medium text-white/80"
//             >
//               Description
//             </label>

//             <textarea
//               id="description"
//               name="description"
//               rows={6}
//               value={form.description}
//               onChange={handleChange}
//               placeholder="Describe this product..."
//               className="sc-input w-full resize-y"
//             />
//           </div>
//         </div>

//         <div className="border-y border-white/10 px-5 py-5 sm:px-8">
//           <h2 className="text-lg font-semibold text-white">
//             Pricing & Availability
//           </h2>

//           <p className="mt-1 text-sm text-white/45">
//             Control the selling price and product visibility.
//           </p>
//         </div>

//         <div className="space-y-7 px-5 py-6 sm:px-8 sm:py-8">
//           <div>
//             <label
//               htmlFor="price"
//               className="mb-2 block text-sm font-medium text-white/80"
//             >
//               Price
//             </label>

//             <div className="relative">
//               <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/40">
//                 ₹
//               </span>

//               <input
//                 id="price"
//                 name="price"
//                 type="number"
//                 min="0"
//                 step="0.01"
//                 value={form.price}
//                 onChange={handleChange}
//                 placeholder="0.00"
//                 className="sc-input w-full pl-9"
//               />
//             </div>
//           </div>

//           <div>
//             <label
//               htmlFor="status"
//               className="mb-2 block text-sm font-medium text-white/80"
//             >
//               Status
//             </label>

//             <select
//               id="status"
//               name="status"
//               value={form.status}
//               onChange={handleChange}
//               className="sc-input w-full"
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>

//             <p className="mt-2 text-xs text-white/35">
//               Inactive products can be hidden from normal shopping flows.
//             </p>
//           </div>
//         </div>

//         <div className="flex flex-col-reverse gap-3 border-t border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
//           <Link
//             href="/admin/products"
//             className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
//           >
//             Cancel
//           </Link>

//           <button
//             type="submit"
//             disabled={saving}
//             className="sc-button-primary min-w-36 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {saving ? "Saving..." : "Save Changes"}
//           </button>
//         </div>
//       </form>
//     </section>
//   );
// }



"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { apiRequest, authenticatedRequest } from "@/lib/api";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    categoryId: "",
    name: "",
    slug: "",
    description: "",
    price: "",
    status: "active",
    imageUrl: "",
  });

  useEffect(() => {
    async function loadProduct() {
      try {
        const [productData, categoryData] =
          await Promise.all([
            apiRequest(`/products/${params.id}`),
            apiRequest("/categories"),
          ]);

        const product =
          productData.product ||
          productData.data;

        const categoriesResult =
          categoryData.categories ||
          categoryData.data?.categories ||
          categoryData.data ||
          [];

        setCategories(categoriesResult);

        if (!product) {
          throw new Error("Product not found");
        }

        setForm({
          categoryId: String(
            product.category_id || ""
          ),
          name: product.name || "",
          slug: product.slug || "",
          description: product.description || "",
          price: String(product.price ?? ""),
          status: product.status || "active",
          imageUrl: product.image_url || "",
        });
      } catch (error) {
        console.error(error);

        setError(
          error.message || "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [params.id]);

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
      setSaving(true);
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

      await authenticatedRequest(
        `/products/${params.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            categoryId: Number(form.categoryId),
            name: form.name.trim(),
            slug: form.slug.trim().toLowerCase(),
            description: form.description.trim(),
            price: Number(form.price),
            status: form.status,
            imageUrl: form.imageUrl.trim() || null,
          }),
        }
      );

      router.push("/admin/products");
    } catch (error) {
      console.error(
        "Update product error:",
        error
      );

      setError(
        error.message ||
          "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <div className="h-4 w-32 animate-pulse rounded bg-white/10" />

          <div className="mt-5 h-10 w-56 animate-pulse rounded bg-white/10" />

          <div className="mt-8 space-y-5">
            <div className="h-12 animate-pulse rounded-xl bg-white/10" />
            <div className="h-12 animate-pulse rounded-xl bg-white/10" />
            <div className="h-12 animate-pulse rounded-xl bg-white/10" />
            <div className="h-32 animate-pulse rounded-xl bg-white/10" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/admin/products"
        className="text-sm font-medium text-zinc-400 transition hover:text-white"
      >
        ← Back to Products
      </Link>

      <div className="mt-6">
        <p className="text-sm font-medium text-violet-400">
          Admin / Products
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Edit Product
        </h1>

        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Update product information, image and status.
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20 sm:p-8"
      >
        {/* Category */}
        <div>
          <label
            htmlFor="categoryId"
            className="mb-2 block text-sm font-medium text-zinc-200"
          >
            Category
          </label>

          <select
            id="categoryId"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-[#0d0d12] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          >
            <option value="">
              Select category
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
            className="mb-2 block text-sm font-medium text-zinc-200"
          >
            Product Name
          </label>

          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-[#0d0d12] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        {/* Slug */}
        <div>
          <label
            htmlFor="slug"
            className="mb-2 block text-sm font-medium text-zinc-200"
          >
            Slug
          </label>

          <input
            id="slug"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-[#0d0d12] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        {/* Image URL */}
        <div>
          <label
            htmlFor="imageUrl"
            className="mb-2 block text-sm font-medium text-zinc-200"
          >
            Product Image URL
          </label>

          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/product-image.jpg"
            className="w-full rounded-xl border border-white/10 bg-[#0d0d12] px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          />

          <p className="mt-2 text-xs leading-5 text-zinc-500">
            Optional. Paste a publicly accessible image URL.
          </p>

          {form.imageUrl.trim() && (
            <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-black/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.imageUrl}
                alt="Product preview"
                className="h-48 w-full object-contain"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-zinc-200"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            rows={5}
            value={form.description}
            onChange={handleChange}
            className="w-full resize-y rounded-xl border border-white/10 bg-[#0d0d12] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="mb-2 block text-sm font-medium text-zinc-200"
          >
            Price
          </label>

          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-[#0d0d12] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-zinc-200"
          >
            Status
          </label>

          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-[#0d0d12] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          >
            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition duration-200 hover:-translate-y-0.5 hover:bg-violet-500 hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

          <Link
            href="/admin/products"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}