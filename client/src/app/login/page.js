// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// import { apiRequest } from "@/lib/api";
// import { saveTokens } from "@/lib/auth";

// export default function LoginPage() {
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   async function handleSubmit(event) {
//     event.preventDefault();

//     try {
//       setLoading(true);
//       setError("");

//       const data = await apiRequest("/auth/login", {
//         method: "POST",
//         body: JSON.stringify({
//           email,
//           password,
//         }),
//       });

//       saveTokens(
//         data.accessToken,
//         data.refreshToken
//       );

//       router.push("/products");
//     } catch (error) {
//       setError(
//         error.message || "Login failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <section className="flex min-h-[80vh] items-center justify-center px-6 py-10">
//       <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">

//         <h1 className="text-3xl font-bold">
//           Login
//         </h1>

//         <p className="mt-2 text-gray-500">
//           Login to your ScaleCart account.
//         </p>

//         {error && (
//           <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
//             {error}
//           </div>
//         )}

//         <form
//           onSubmit={handleSubmit}
//           className="mt-6 space-y-5"
//         >
//           <div>
//             <label className="mb-2 block text-sm font-medium">
//               Email
//             </label>

//             <input
//               type="email"
//               value={email}
//               onChange={(e) =>
//                 setEmail(e.target.value)
//               }
//               required
//               className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
//               placeholder="you@example.com"
//             />
//           </div>

//           <div>
//             <label className="mb-2 block text-sm font-medium">
//               Password
//             </label>

//             <input
//               type="password"
//               value={password}
//               onChange={(e) =>
//                 setPassword(e.target.value)
//               }
//               required
//               className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
//               placeholder="Your password"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white disabled:opacity-50"
//           >
//             {loading
//               ? "Logging in..."
//               : "Login"}
//           </button>
//         </form>

//         <p className="mt-6 text-center text-sm text-gray-500">
//             Don&apos;t have an account?{" "}
//             <Link
//                 href="/register"
//                 className="font-medium underline"
//             >
//             Create Account
//             </Link>
//         </p>
//       </div>
//     </section>
//   );
// }



"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { apiRequest } from "@/lib/api";
import { saveTokens } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      saveTokens(
        data.accessToken,
        data.refreshToken
      );

      router.push("/products");
    } catch (error) {
      setError(
        error.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-[calc(100vh-72px)] overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-fuchsia-600/5 blur-3xl" />
      </div>

      <section className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-6xl items-center justify-center px-6 py-14">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40 backdrop-blur-xl lg:grid-cols-[1fr_1.05fr]">

          {/* Brand panel */}
          <div className="hidden border-r border-white/10 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-500/5 p-10 lg:flex lg:flex-col lg:justify-between">
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

              <div className="mt-20">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
                  Welcome back
                </p>

                <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-white">
                  Your next purchase
                  <br />
                  starts here.
                </h2>

                <p className="mt-5 max-w-sm text-sm leading-7 text-white/50">
                  Sign in to access your cart, orders and a
                  smoother ScaleCart shopping experience.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-white/35">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
              Secure account access
            </div>
          </div>

          {/* Login panel */}
          <div className="p-7 sm:p-10 lg:p-12">
            <div className="mx-auto max-w-md">
              {/* Mobile brand */}
              <Link
                href="/"
                className="mb-10 flex items-center justify-center gap-2 text-lg font-bold tracking-tight text-white lg:hidden"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-sm shadow-lg shadow-violet-600/30">
                  S
                </span>
                Scale<span className="text-violet-400">Cart</span>
              </Link>

              <div>
                <p className="text-sm font-medium text-violet-400">
                  Account
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                  Welcome back
                </h1>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  Login to your ScaleCart account.
                </p>
              </div>

              {error && (
                <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-white/80"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                    autoComplete="email"
                    className="sc-input w-full"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-white/80"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                    autoComplete="current-password"
                    className="sc-input w-full"
                    placeholder="Your password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="sc-button-primary mt-2 w-full py-3.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Logging in...
                    </span>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-white/25">
                  SCALECART
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <p className="text-center text-sm text-white/45">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-violet-400 transition hover:text-violet-300"
                >
                  Create Account
                </Link>
              </p>

              <p className="mt-8 text-center text-xs leading-5 text-white/25">
                By continuing, you agree to use your
                ScaleCart account responsibly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}