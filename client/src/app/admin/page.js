// "use client";

// import Link from "next/link";

// export default function AdminDashboard() {
//   return (
//     <section className="mx-auto max-w-7xl px-6 py-12">
//       <div>
//         <p className="text-sm font-medium text-gray-500">
//           ScaleCart Admin
//         </p>

//         <h1 className="mt-2 text-3xl font-bold">
//           Dashboard
//         </h1>

//         <p className="mt-2 text-gray-600">
//           Manage products, inventory and customer orders.
//         </p>
//       </div>

//       <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//         <Link
//           href="/admin/products"
//           className="rounded-xl border bg-white p-6 transition hover:shadow-md"
//         >
//           <p className="text-sm text-gray-500">
//             Catalog
//           </p>

//           <h2 className="mt-2 text-xl font-bold">
//             Products
//           </h2>

//           <p className="mt-2 text-sm text-gray-600">
//             Create, update and manage products.
//           </p>
//         </Link>

//         <Link
//           href="/admin/inventory"
//           className="rounded-xl border bg-white p-6 transition hover:shadow-md"
//         >
//           <p className="text-sm text-gray-500">
//             Stock
//           </p>

//           <h2 className="mt-2 text-xl font-bold">
//             Inventory
//           </h2>

//           <p className="mt-2 text-sm text-gray-600">
//             Monitor and update product stock.
//           </p>
//         </Link>

//         <Link
//           href="/admin/orders"
//           className="rounded-xl border bg-white p-6 transition hover:shadow-md"
//         >
//           <p className="text-sm text-gray-500">
//             Fulfillment
//           </p>

//           <h2 className="mt-2 text-xl font-bold">
//             Orders
//           </h2>

//           <p className="mt-2 text-sm text-gray-600">
//             Manage order status and fulfillment.
//           </p>
//         </Link>

//         <div className="rounded-xl border bg-white p-6">
//           <p className="text-sm text-gray-500">
//             Analytics
//           </p>

//           <h2 className="mt-2 text-xl font-bold">
//             Coming Soon
//           </h2>

//           <p className="mt-2 text-sm text-gray-600">
//             Sales and operational metrics.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }



"use client";

import Link from "next/link";

const adminSections = [
  {
    label: "Catalog",
    title: "Products",
    description:
      "Create, update and manage products across your store.",
    href: "/admin/products",
    icon: "▦",
  },
  {
    label: "Stock",
    title: "Inventory",
    description:
      "Monitor product availability and keep stock levels updated.",
    href: "/admin/inventory",
    icon: "◫",
  },
  {
    label: "Fulfillment",
    title: "Orders",
    description:
      "Manage order status and keep fulfillment moving smoothly.",
    href: "/admin/orders",
    icon: "□",
  },
];

export default function AdminDashboard() {
  return (
    <main className="relative min-h-[calc(100vh-72px)] overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-10 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-fuchsia-600/5 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-7xl px-6 py-14 sm:py-16">
        {/* Header */}
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-sm font-bold text-violet-300">
                S
              </span>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
                ScaleCart Admin
              </p>
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Dashboard
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
              Manage your catalog, inventory and customer orders
              from one central workspace.
            </p>
          </div>

          <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />

            <div>
              <p className="text-xs font-medium text-white/70">
                Admin workspace
              </p>

              <p className="text-xs text-white/30">
                Operational controls
              </p>
            </div>
          </div>
        </div>

        {/* Main cards */}
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {adminSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-violet-400/25 hover:bg-white/[0.05] hover:shadow-violet-950/20"
            >
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-600/10 blur-3xl transition duration-500 group-hover:bg-violet-600/20" />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl text-violet-300">
                    {section.icon}
                  </span>

                  <span className="text-lg text-white/20 transition group-hover:translate-x-1 group-hover:text-violet-300">
                    →
                  </span>
                </div>

                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
                  {section.label}
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  {section.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/40">
                  {section.description}
                </p>

                <div className="mt-7 border-t border-white/10 pt-5">
                  <span className="text-sm font-medium text-white/60 transition group-hover:text-violet-300">
                    Open {section.title}
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* Analytics */}
          <div className="relative overflow-hidden rounded-3xl border border-dashed border-white/10 bg-white/[0.015] p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg text-white/30">
              ↗
            </div>

            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-white/30">
              Analytics
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white/60">
              Coming Soon
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/30">
              Sales and operational metrics will appear here in
              a future update.
            </p>

            <div className="mt-7 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/30">
              Planned feature
            </div>
          </div>
        </div>

        {/* Quick info */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-r from-violet-500/[0.07] to-transparent p-6 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                ScaleCart operations
              </p>

              <p className="mt-1 text-sm text-white/35">
                Use the sections above to manage the core store
                workflows.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex w-fit items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-violet-400/30 hover:bg-violet-500/10"
            >
              View Store →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}