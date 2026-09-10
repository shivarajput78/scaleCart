// export default function Footer() {
//   return (
//     <footer className="border-t py-6 text-center text-sm text-gray-500">
//       © {new Date().getFullYear()} ScaleCart. All rights reserved.
//     </footer>
//   );
// }


import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#07070a]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-sm shadow-lg shadow-violet-600/30">
                S
              </span>

              Scale<span className="text-violet-400">Cart</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/40">
              A simple, modern shopping experience built for
              discovering products and managing your orders with ease.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Shop
            </h3>

            <div className="mt-4 space-y-3">
              <Link
                href="/products"
                className="block text-sm text-white/40 transition hover:text-violet-300"
              >
                Products
              </Link>

              <Link
                href="/cart"
                className="block text-sm text-white/40 transition hover:text-violet-300"
              >
                Cart
              </Link>

              <Link
                href="/orders"
                className="block text-sm text-white/40 transition hover:text-violet-300"
              >
                My Orders
              </Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Account
            </h3>

            <div className="mt-4 space-y-3">
              <Link
                href="/login"
                className="block text-sm text-white/40 transition hover:text-violet-300"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="block text-sm text-white/40 transition hover:text-violet-300"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} ScaleCart. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-xs text-white/25">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Built for a better shopping experience
          </div>
        </div>
      </div>
    </footer>
  );
}