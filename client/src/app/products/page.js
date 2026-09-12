
// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { apiRequest } from "@/lib/api";

// export default function ProductsPage() {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);

//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [sort, setSort] = useState("newest");
//   const [page, setPage] = useState(1);
//   const [pagination, setPagination] = useState(null);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Load categories
//   useEffect(() => {
//     let cancelled = false;

//     async function fetchCategories() {
//       try {
//         const data = await apiRequest("/categories");

//         if (!cancelled) {
//           setCategories(data.categories || []);
//         }
//       } catch (error) {
//         console.error("Categories error:", error);
//       }
//     }

//     fetchCategories();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   // Load products
//   useEffect(() => {
//     let cancelled = false;

//     async function fetchProducts() {
//       try {
//         setError("");
//         setLoading(true);

//         const params = new URLSearchParams();

//         if (search.trim()) {
//           params.set("search", search.trim());
//         }

//         if (category) {
//           params.set("category", category);
//         }

//         if (minPrice) {
//           params.set("minPrice", minPrice);
//         }

//         if (maxPrice) {
//           params.set("maxPrice", maxPrice);
//         }

//         if (sort) {
//           params.set("sort", sort);
//         }

//         params.set("page", page);
//         params.set("limit", 10);

//         const data = await apiRequest(
//           `/products?${params.toString()}`
//         );

//         if (!cancelled) {
//           setProducts(data.products || []);
//           setPagination(data.pagination || null);
//           setLoading(false);
//         }
//       } catch (error) {
//         console.error("Products error:", error);

//         if (!cancelled) {
//           setError(
//             error.message || "Failed to load products"
//           );
//           setLoading(false);
//         }
//       }
//     }

//     fetchProducts();

//     return () => {
//       cancelled = true;
//     };
//   }, [
//     search,
//     category,
//     minPrice,
//     maxPrice,
//     sort,
//     page,
//   ]);

//   function resetFilters() {
//     setSearch("");
//     setCategory("");
//     setMinPrice("");
//     setMaxPrice("");
//     setSort("newest");
//     setPage(1);
//   }

//   function handleSearchChange(event) {
//     setSearch(event.target.value);
//     setPage(1);
//   }

//   function handleCategoryChange(event) {
//     setCategory(event.target.value);
//     setPage(1);
//   }

//   function handleMinPriceChange(event) {
//     setMinPrice(event.target.value);
//     setPage(1);
//   }

//   function handleMaxPriceChange(event) {
//     setMaxPrice(event.target.value);
//     setPage(1);
//   }

//   function handleSortChange(event) {
//     setSort(event.target.value);
//     setPage(1);
//   }

//   return (
//     <main className="relative min-h-screen overflow-hidden">
//       {/* Ambient background */}
//       <div
//         className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-violet-600/[0.06] blur-[130px]"
//         aria-hidden="true"
//       />

//       <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
//         {/* Header */}
//         <div className="mb-10">
//           <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-500/[0.06] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
//             <span
//               className="h-1.5 w-1.5 rounded-full bg-violet-400"
//               aria-hidden="true"
//             />
//             Store
//           </div>

//           <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
//             <div>
//               <h1 className="text-4xl font-bold tracking-[-0.035em] text-white sm:text-5xl">
//                 Explore products
//               </h1>

//               <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
//                 Find the right products using search, categories,
//                 price filters and sorting.
//               </p>
//             </div>

//             {!loading && pagination && (
//               <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
//                 <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
//                   Catalog
//                 </p>

//                 <p className="mt-1 text-lg font-semibold text-white">
//                   {pagination.totalProducts}
//                   <span className="ml-1 text-sm font-normal text-zinc-500">
//                     products
//                   </span>
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Filters */}
//         <section className="mb-10 rounded-[24px] border border-white/[0.07] bg-[#0d0d13]/85 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-5">
//           <div className="mb-5 flex flex-col gap-1">
//             <h2 className="text-sm font-semibold text-white">
//               Refine your search
//             </h2>

//             <p className="text-xs text-zinc-500">
//               Adjust the filters to find exactly what you need.
//             </p>
//           </div>

//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
//             {/* Search */}
//             <div className="relative lg:col-span-2">
//               <label
//                 htmlFor="product-search"
//                 className="mb-2 block text-xs font-medium text-zinc-400"
//               >
//                 Search
//               </label>

//               <div className="relative">
//                 <svg
//                   className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
//                   width="17"
//                   height="17"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="1.8"
//                   strokeLinecap="round"
//                   aria-hidden="true"
//                 >
//                   <circle cx="11" cy="11" r="7" />
//                   <path d="m20 20-4-4" />
//                 </svg>

//                 <input
//                   id="product-search"
//                   type="text"
//                   value={search}
//                   onChange={handleSearchChange}
//                   placeholder="Search products..."
//                   className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/[0.13] focus:border-violet-400/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet-500/10"
//                 />
//               </div>
//             </div>

//             {/* Category */}
//             <div>
//               <label
//                 htmlFor="product-category"
//                 className="mb-2 block text-xs font-medium text-zinc-400"
//               >
//                 Category
//               </label>

//               <select
//                 id="product-category"
//                 value={category}
//                 onChange={handleCategoryChange}
//                 className="h-11 w-full appearance-none rounded-xl border border-white/[0.08] bg-[#12121a] px-3.5 text-sm text-zinc-200 outline-none transition hover:border-white/[0.13] focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10"
//               >
//                 <option value="">All Categories</option>

//                 {categories.map((item) => (
//                   <option key={item.id} value={item.slug}>
//                     {item.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Min Price */}
//             <div>
//               <label
//                 htmlFor="min-price"
//                 className="mb-2 block text-xs font-medium text-zinc-400"
//               >
//                 Min price
//               </label>

//               <div className="relative">
//                 <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
//                   ₹
//                 </span>

//                 <input
//                   id="min-price"
//                   type="number"
//                   value={minPrice}
//                   onChange={handleMinPriceChange}
//                   placeholder="0"
//                   min="0"
//                   className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] pl-8 pr-3 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/[0.13] focus:border-violet-400/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet-500/10"
//                 />
//               </div>
//             </div>

//             {/* Max Price */}
//             <div>
//               <label
//                 htmlFor="max-price"
//                 className="mb-2 block text-xs font-medium text-zinc-400"
//               >
//                 Max price
//               </label>

//               <div className="relative">
//                 <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
//                   ₹
//                 </span>

//                 <input
//                   id="max-price"
//                   type="number"
//                   value={maxPrice}
//                   onChange={handleMaxPriceChange}
//                   placeholder="Any"
//                   min="0"
//                   className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] pl-8 pr-3 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/[0.13] focus:border-violet-400/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet-500/10"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Filter bottom row */}
//           <div className="mt-4 flex flex-col gap-3 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-end sm:justify-between">
//             <div className="w-full sm:max-w-xs">
//               <label
//                 htmlFor="product-sort"
//                 className="mb-2 block text-xs font-medium text-zinc-400"
//               >
//                 Sort by
//               </label>

//               <select
//                 id="product-sort"
//                 value={sort}
//                 onChange={handleSortChange}
//                 className="h-11 w-full appearance-none rounded-xl border border-white/[0.08] bg-[#12121a] px-3.5 text-sm text-zinc-200 outline-none transition hover:border-white/[0.13] focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10"
//               >
//                 <option value="newest">Newest</option>
//                 <option value="price_asc">
//                   Price: Low to High
//                 </option>
//                 <option value="price_desc">
//                   Price: High to Low
//                 </option>
//                 <option value="name_asc">Name: A-Z</option>
//               </select>
//             </div>

//             <button
//               type="button"
//               onClick={resetFilters}
//               className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 text-sm font-medium text-zinc-300 transition duration-200 hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white"
//             >
//               <svg
//                 width="16"
//                 height="16"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="1.8"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 aria-hidden="true"
//               >
//                 <path d="M3 12a9 9 0 1 0 3-6.7" />
//                 <path d="M3 4v5h5" />
//               </svg>

//               Reset filters
//             </button>
//           </div>
//         </section>

//         {/* Results count */}
//         {!loading && pagination && (
//           <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
//             <p className="text-sm text-zinc-500">
//               Showing page{" "}
//               <span className="font-medium text-zinc-300">
//                 {pagination.page}
//               </span>{" "}
//               of{" "}
//               <span className="font-medium text-zinc-300">
//                 {pagination.totalPages}
//               </span>
//             </p>

//             <p className="text-xs text-zinc-600">
//               {pagination.totalProducts} total products
//             </p>
//           </div>
//         )}

//         {/* Loading */}
//         {loading && (
//           <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
//             {Array.from({ length: 8 }).map((_, index) => (
//               <div
//                 key={index}
//                 className="overflow-hidden rounded-[20px] border border-white/[0.06] bg-[#0d0d13]"
//               >
//                 <div className="aspect-[4/3] animate-pulse bg-white/[0.04]" />

//                 <div className="space-y-3 p-5">
//                   <div className="h-3 w-1/3 animate-pulse rounded-full bg-white/[0.06]" />
//                   <div className="h-4 w-4/5 animate-pulse rounded-full bg-white/[0.07]" />
//                   <div className="h-5 w-1/3 animate-pulse rounded-full bg-violet-400/[0.08]" />
//                   <div className="h-3 w-1/2 animate-pulse rounded-full bg-white/[0.05]" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Error */}
//         {!loading && error && (
//           <div className="rounded-[24px] border border-red-400/15 bg-red-500/[0.06] p-8 text-center">
//             <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/15 bg-red-500/10 text-red-300">
//               <svg
//                 width="22"
//                 height="22"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="1.8"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 aria-hidden="true"
//               >
//                 <path d="M12 9v4" />
//                 <path d="M12 17h.01" />
//                 <path d="M10.3 3.8 2.9 17a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
//               </svg>
//             </div>

//             <h2 className="mt-4 text-lg font-semibold text-white">
//               Couldn&apos;t load products
//             </h2>

//             <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
//               {error}
//             </p>

//             <button
//               type="button"
//               onClick={() => setPage((current) => current)}
//               className="mt-5 rounded-xl border border-white/[0.09] bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.07] hover:text-white"
//             >
//               Try again
//             </button>
//           </div>
//         )}

//         {/* Empty */}
//         {!loading && !error && products.length === 0 && (
//           <div className="rounded-[24px] border border-white/[0.07] bg-[#0d0d13]/80 px-6 py-16 text-center">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.035]">
//               <svg
//                 width="25"
//                 height="25"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="1.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="text-zinc-500"
//                 aria-hidden="true"
//               >
//                 <circle cx="11" cy="11" r="7" />
//                 <path d="m20 20-4-4" />
//               </svg>
//             </div>

//             <h2 className="mt-5 text-xl font-semibold text-white">
//               No products found
//             </h2>

//             <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
//               Try changing your search or filters to find
//               something else.
//             </p>

//             <button
//               type="button"
//               onClick={resetFilters}
//               className="mt-6 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
//             >
//               Clear filters
//             </button>
//           </div>
//         )}

//         {/* Products */}
//         {!loading && !error && products.length > 0 && (
//           <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
//             {products.map((product) => {
//               const inStock =
//                 Number(product.stock_quantity) > 0;

//               return (
//                 <Link
//                   key={product.id}
//                   href={`/products/${product.id}`}
//                   className="group overflow-hidden rounded-[20px] border border-white/[0.07] bg-[#0d0d13] transition duration-300 hover:-translate-y-1 hover:border-violet-400/15 hover:bg-[#111119] hover:shadow-2xl hover:shadow-black/30"
//                 >
//                   {/* Product visual */}
//                   <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-white/[0.055] via-violet-500/[0.035] to-white/[0.015]">
//                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(139,92,246,0.12),transparent_50%)] opacity-70 transition duration-300 group-hover:opacity-100" />

//                     <div className="relative flex h-full items-center justify-center">
//                       <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.035] shadow-xl shadow-black/20 transition duration-300 group-hover:scale-105 group-hover:border-violet-400/15">
//                         <svg
//                           width="32"
//                           height="32"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="1.4"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           className="text-zinc-500 transition group-hover:text-violet-300"
//                           aria-hidden="true"
//                         >
//                           <rect
//                             x="3"
//                             y="3"
//                             width="18"
//                             height="18"
//                             rx="2"
//                           />
//                           <circle cx="8.5" cy="8.5" r="1.5" />
//                           <path d="m21 15-5-5L5 21" />
//                         </svg>
//                       </div>
//                     </div>

//                     {/* Stock badge */}
//                     <div className="absolute left-4 top-4">
//                       <span
//                         className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
//                           inStock
//                             ? "border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300"
//                             : "border-red-400/15 bg-red-400/[0.08] text-red-300"
//                         }`}
//                       >
//                         {inStock
//                           ? "In Stock"
//                           : "Out of Stock"}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Product information */}
//                   <div className="p-5">
//                     <p className="text-xs font-medium uppercase tracking-[0.12em] text-violet-400/80">
//                       {product.category_name}
//                     </p>

//                     <h2 className="mt-2 line-clamp-2 min-h-[48px] text-base font-semibold leading-6 text-white transition group-hover:text-violet-200">
//                       {product.name}
//                     </h2>

//                     <div className="mt-4 flex items-end justify-between gap-3">
//                       <div>
//                         <p className="text-xl font-bold tracking-tight text-white">
//                           ₹{product.price}
//                         </p>

//                         <p className="mt-1 text-xs text-zinc-600">
//                           Stock: {product.stock_quantity}
//                         </p>
//                       </div>

//                       <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-zinc-400 transition duration-200 group-hover:border-violet-400/20 group-hover:bg-violet-500/10 group-hover:text-violet-300">
//                         <svg
//                           width="16"
//                           height="16"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="1.8"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           aria-hidden="true"
//                         >
//                           <path d="M5 12h14" />
//                           <path d="m13 6 6 6-6 6" />
//                         </svg>
//                       </span>
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         )}

//         {/* Pagination */}
//         {!loading &&
//           !error &&
//           pagination &&
//           pagination.totalPages > 1 && (
//             <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
//               <button
//                 type="button"
//                 disabled={!pagination.hasPreviousPage}
//                 onClick={() =>
//                   setPage((current) => current - 1)
//                 }
//                 className="inline-flex h-11 min-w-28 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 text-sm font-medium text-zinc-300 transition hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
//               >
//                 <svg
//                   className="mr-2"
//                   width="15"
//                   height="15"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="1.8"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   aria-hidden="true"
//                 >
//                   <path d="m15 18-6-6 6-6" />
//                 </svg>

//                 Previous
//               </button>

//               <div className="rounded-xl border border-white/[0.07] bg-white/[0.035] px-4 py-2.5 text-sm font-medium text-zinc-300">
//                 Page{" "}
//                 <span className="text-white">
//                   {pagination.page}
//                 </span>
//               </div>

//               <button
//                 type="button"
//                 disabled={!pagination.hasNextPage}
//                 onClick={() =>
//                   setPage((current) => current + 1)
//                 }
//                 className="inline-flex h-11 min-w-28 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 text-sm font-medium text-zinc-300 transition hover:border-violet-400/20 hover:bg-violet-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
//               >
//                 Next

//                 <svg
//                   className="ml-2"
//                   width="15"
//                   height="15"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="1.8"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   aria-hidden="true"
//                 >
//                   <path d="m9 18 6-6-6-6" />
//                 </svg>
//               </button>
//             </div>
//           )}
//       </div>
//     </main>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { apiRequest } from "@/lib/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load categories
  useEffect(() => {
    let cancelled = false;

    async function fetchCategories() {
      try {
        const data = await apiRequest("/categories");

        if (!cancelled) {
          setCategories(
            data.categories ||
              data.data?.categories ||
              data.data ||
              []
          );
        }
      } catch (error) {
        console.error("Categories error:", error);
      }
    }

    fetchCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load products
  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        setError("");
        setLoading(true);

        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (category) {
          params.set("category", category);
        }

        if (minPrice) {
          params.set("minPrice", minPrice);
        }

        if (maxPrice) {
          params.set("maxPrice", maxPrice);
        }

        if (sort) {
          params.set("sort", sort);
        }

        params.set("page", page);
        params.set("limit", 100);

        const data = await apiRequest(
          `/products?${params.toString()}`
        );

        if (!cancelled) {
          setProducts(data.products || []);
          setPagination(data.pagination || null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Products error:", error);

        if (!cancelled) {
          setError(
            error.message || "Failed to load products"
          );
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [
    search,
    category,
    minPrice,
    maxPrice,
    sort,
    page,
  ]);

  function resetFilters() {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setPage(1);
  }

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setPage(1);
  }

  function handleCategoryChange(event) {
    setCategory(event.target.value);
    setPage(1);
  }

  function handleMinPriceChange(event) {
    setMinPrice(event.target.value);
    setPage(1);
  }

  function handleMaxPriceChange(event) {
    setMaxPrice(event.target.value);
    setPage(1);
  }

  function handleSortChange(event) {
    setSort(event.target.value);
    setPage(1);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-violet-400">
          ScaleCart Store
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Products
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
          Find the products you are looking for.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-xl shadow-black/10 sm:p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="min-h-11 rounded-xl border border-white/10 bg-[#0d0d12] px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          />

          {/* Category */}
          <select
            value={category}
            onChange={handleCategoryChange}
            className="min-h-11 rounded-xl border border-white/10 bg-[#0d0d12] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          >
            <option value="">
              All Categories
            </option>

            {categories.map((item) => (
              <option
                key={item.id}
                value={item.slug}
              >
                {item.name}
              </option>
            ))}
          </select>

          {/* Min Price */}
          <input
            type="number"
            value={minPrice}
            onChange={handleMinPriceChange}
            placeholder="Min price"
            min="0"
            className="min-h-11 rounded-xl border border-white/10 bg-[#0d0d12] px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          />

          {/* Max Price */}
          <input
            type="number"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            placeholder="Max price"
            min="0"
            className="min-h-11 rounded-xl border border-white/10 bg-[#0d0d12] px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          />

          {/* Sort */}
          <select
            value={sort}
            onChange={handleSortChange}
            className="min-h-11 rounded-xl border border-white/10 bg-[#0d0d12] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          >
            <option value="newest">
              Newest
            </option>

            <option value="price_asc">
              Price: Low to High
            </option>

            <option value="price_desc">
              Price: High to Low
            </option>

            <option value="name_asc">
              Name: A-Z
            </option>
          </select>
        </div>

        <button
          type="button"
          onClick={resetFilters}
          className="mt-4 min-h-10 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
        >
          Reset Filters
        </button>
      </div>

      {/* Results count */}
      {!loading && pagination && (
        <div className="mb-5 text-sm text-zinc-500">
          Showing page{" "}
          <span className="font-medium text-zinc-300">
            {pagination.page}
          </span>{" "}
          of{" "}
          <span className="font-medium text-zinc-300">
            {pagination.totalPages}
          </span>{" "}
          —{" "}
          <span className="font-medium text-zinc-300">
            {pagination.totalProducts}
          </span>{" "}
          products
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map(
            (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                <div className="h-56 animate-pulse bg-white/[0.06]" />

                <div className="space-y-3 p-5">
                  <div className="h-3 w-20 animate-pulse rounded bg-white/10" />

                  <div className="h-5 w-4/5 animate-pulse rounded bg-white/10" />

                  <div className="h-6 w-24 animate-pulse rounded bg-white/10" />

                  <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        products.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-20 text-center">
            <h2 className="text-xl font-semibold text-white">
              No products found
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Try changing your search or filters.
            </p>
          </div>
        )}

      {/* Products */}
      {!loading &&
        !error &&
        products.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const imageUrl =
                product.image_url ||
                product.imageUrl ||
                "";

              const stock = Number(
                product.stock_quantity
              );

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-200 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-violet-500/10"
                >
                  {/* Product Image */}
                  <div className="relative flex h-56 items-center justify-center overflow-hidden bg-[#0d0d12]">
                    {imageUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="h-full w-full object-contain p-5 transition duration-300 group-hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";

                            const fallback =
                              event.currentTarget
                                .nextElementSibling;

                            if (fallback) {
                              fallback.classList.remove(
                                "hidden"
                              );
                            }
                          }}
                        />

                        <div className="absolute inset-0 hidden items-center justify-center text-sm text-zinc-600">
                          Product Image
                        </div>
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-xl text-zinc-600">
                            ◇
                          </div>

                          <p className="mt-3 text-xs text-zinc-600">
                            No image
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-violet-400">
                      {product.category_name ||
                        "Product"}
                    </p>

                    <h2 className="mt-2 line-clamp-2 min-h-12 font-semibold leading-6 text-white">
                      {product.name}
                    </h2>

                    <p className="mt-4 text-xl font-bold text-white">
                      ₹{product.price}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-sm text-zinc-500">
                        Stock: {stock}
                      </p>

                      {stock > 0 ? (
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                          In Stock
                        </span>
                      ) : (
                        <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-300">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      {/* Pagination */}
      {!loading &&
        !error &&
        pagination &&
        pagination.totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              disabled={!pagination.hasPreviousPage}
              onClick={() =>
                setPage((current) => current - 1)
              }
              className="min-h-10 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-zinc-300">
              Page {pagination.page}
            </span>

            <button
              type="button"
              disabled={!pagination.hasNextPage}
              onClick={() =>
                setPage((current) => current + 1)
              }
              className="min-h-10 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
    </section>
  );
}