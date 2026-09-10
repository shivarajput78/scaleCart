// export default function Home() {
//   return (
//     <section className="mx-auto max-w-7xl px-6 py-20">
//       <h1 className="text-5xl font-bold">
//         Welcome to ScaleCart
//       </h1>

//       <p className="mt-4 max-w-2xl text-lg text-gray-600">
//         A production-level e-commerce platform built with
//         Next.js, Node.js, Express and PostgreSQL.
//       </p>
//     </section>
//   );
// }


import Link from "next/link";

const highlights = [
  {
    number: "01",
    title: "Discover",
    description: "Explore products through a clean, focused shopping experience.",
  },
  {
    number: "02",
    title: "Choose",
    description: "Compare products and find what fits your needs.",
  },
  {
    number: "03",
    title: "Checkout",
    description: "Move from cart to checkout with a simple, reliable flow.",
  },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-violet-600/[0.08] blur-[120px]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute right-[-180px] top-[300px] h-[400px] w-[400px] rounded-full bg-blue-500/[0.05] blur-[100px]"
        aria-hidden="true"
      />

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pb-36 lg:pt-32">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-500/[0.07] px-3.5 py-2 text-sm font-medium text-violet-300">
            <span
              className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.8)]"
              aria-hidden="true"
            />
            Modern shopping, simplified
          </div>

          {/* Heading */}
          <h1 className="max-w-4xl text-5xl font-bold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
            Everything you need.
            <span className="block bg-gradient-to-r from-violet-300 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              One better cart.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-7 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
            ScaleCart brings products, shopping and checkout together in a
            clean experience built for modern e-commerce.
          </p>

          {/* Actions */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 px-6 text-sm font-semibold text-white shadow-xl shadow-violet-950/30 transition duration-200 hover:-translate-y-0.5 hover:from-violet-500 hover:to-violet-600 hover:shadow-violet-900/40"
            >
              Explore products
              <svg
                className="ml-2"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </Link>

            <Link
              href="/cart"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.035] px-6 text-sm font-semibold text-zinc-200 transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-white"
            >
              View cart
            </Link>
          </div>
        </div>

        {/* Hero visual */}
        <div className="relative mt-16 lg:mt-20">
          <div className="absolute -inset-4 rounded-[32px] bg-violet-500/[0.05] blur-2xl" />

          <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0d0d13]/90 p-2 shadow-2xl shadow-black/40">
            <div className="rounded-[22px] border border-white/[0.06] bg-[#111118] p-6 sm:p-8">
              {/* Fake browser/header area */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-5">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                </div>

                <div className="hidden h-7 w-40 rounded-lg bg-white/[0.04] sm:block" />

                <div className="h-7 w-7 rounded-lg bg-violet-500/10" />
              </div>

              {/* Dashboard/product preview */}
              <div className="grid gap-5 pt-6 lg:grid-cols-[1.35fr_0.65fr]">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                        Featured
                      </p>

                      <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
                        Curated for you
                      </p>
                    </div>

                    <div className="rounded-lg bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-300">
                      Explore
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#15151d]"
                      >
                        <div className="aspect-[4/3] bg-gradient-to-br from-white/[0.06] via-violet-500/[0.08] to-white/[0.02]" />

                        <div className="space-y-2 p-3">
                          <div className="h-2.5 w-3/4 rounded-full bg-white/[0.08]" />
                          <div className="h-2 w-1/2 rounded-full bg-white/[0.05]" />
                          <div className="h-2.5 w-1/3 rounded-full bg-violet-400/20" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-violet-500/[0.10] to-white/[0.02] p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-300/70">
                    Your cart
                  </p>

                  <div className="mt-6 flex items-center justify-center">
                    <div className="flex h-28 w-28 items-center justify-center rounded-full border border-violet-400/15 bg-violet-500/[0.07] shadow-[0_0_60px_rgba(139,92,246,0.12)]">
                      <svg
                        width="38"
                        height="38"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-violet-300"
                        aria-hidden="true"
                      >
                        <circle cx="9" cy="20" r="1" />
                        <circle cx="19" cy="20" r="1" />
                        <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 1.9-1.4L22 8H6" />
                      </svg>
                    </div>
                  </div>

                  <div className="mt-7 space-y-2">
                    <div className="h-2.5 w-full rounded-full bg-white/[0.07]" />
                    <div className="h-2.5 w-2/3 rounded-full bg-white/[0.04]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative border-y border-white/[0.06] bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
              Simple by design
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Shopping without the clutter.
            </h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.number}
                className="group rounded-2xl border border-white/[0.07] bg-[#0d0d12]/70 p-6 transition duration-200 hover:-translate-y-1 hover:border-violet-400/15 hover:bg-[#111119]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-violet-400">
                    {item.number}
                  </span>

                  <span className="h-px w-12 bg-white/[0.08] transition duration-200 group-hover:w-16 group-hover:bg-violet-400/30" />
                </div>

                <h3 className="mt-8 text-xl font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="relative overflow-hidden rounded-[28px] border border-violet-400/10 bg-gradient-to-br from-violet-500/[0.10] via-[#101017] to-[#0b0b10] p-8 sm:p-12 lg:p-16">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/[0.12] blur-3xl"
            aria-hidden="true"
          />

          <div className="relative max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
              Ready when you are
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Find something worth adding to your cart.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
              Browse the catalog and discover the products available on
              ScaleCart.
            </p>

            <Link
                 href="/products"
                 className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition duration-200 hover:-translate-y-0.5 hover:bg-violet-500 hover:shadow-violet-500/30"
            >
            Browse products
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}