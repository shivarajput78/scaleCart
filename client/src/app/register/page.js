// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { apiRequest } from "@/lib/api";
// import { saveTokens } from "@/lib/auth";
// import Link from "next/link";

// export default function RegisterPage() {
//   const router = useRouter();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   async function handleSubmit(event) {
//     event.preventDefault();

//     try {
//       setLoading(true);
//       setError("");

//       const data = await apiRequest("/auth/register", {
//         method: "POST",
//         body: JSON.stringify({
//           name,
//           email,
//           password,
//         }),
//       });

//       if (data.accessToken && data.refreshToken) {
//         saveTokens(
//           data.accessToken,
//           data.refreshToken
//         );
//       }

//       router.push("/login");
//     } catch (error) {
//       setError(
//         error.message || "Registration failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <section className="flex min-h-[80vh] items-center justify-center px-6 py-10">
//       <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">

//         <h1 className="text-3xl font-bold">
//           Create Account
//         </h1>

//         <p className="mt-2 text-gray-500">
//           Create your ScaleCart account.
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
//               Name
//             </label>

//             <input
//               type="text"
//               value={name}
//               onChange={(e) =>
//                 setName(e.target.value)
//               }
//               required
//               className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
//               placeholder="Your name"
//             />
//           </div>

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
//               minLength={6}
//               className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
//               placeholder="Minimum 6 characters"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white disabled:opacity-50"
//           >
//             {loading
//               ? "Creating account..."
//               : "Create Account"}
//           </button>
//         </form>

//         <p className="mt-6 text-center text-sm text-gray-500">
//           Already have an account?{" "}
//           <Link
//             href="/login"
//             className="font-medium underline"
//           >
//             Login
//           </Link>
//         </p>
//       </div>
//     </section>
//   );
// }




"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { saveTokens } from "@/lib/auth";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (data.accessToken && data.refreshToken) {
        saveTokens(
          data.accessToken,
          data.refreshToken
        );
      }

      router.push("/login");
    } catch (error) {
      setError(
        error.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-[calc(100vh-72px)] overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-16 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-60 w-60 rounded-full bg-fuchsia-600/5 blur-3xl" />
      </div>

      <section className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-6xl items-center justify-center px-6 py-14">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40 backdrop-blur-xl lg:grid-cols-[1.05fr_1fr]">

          {/* Register form */}
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
                  Get started
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                  Create your account
                </h1>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  Join ScaleCart and start shopping with a
                  smoother experience.
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
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-white/80"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    required
                    autoComplete="name"
                    className="sc-input w-full"
                    placeholder="Your name"
                  />
                </div>

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
                    minLength={6}
                    autoComplete="new-password"
                    className="sc-input w-full"
                    placeholder="Minimum 6 characters"
                  />

                  <p className="mt-2 text-xs text-white/30">
                    Use at least 6 characters.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="sc-button-primary mt-2 w-full py-3.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating account...
                    </span>
                  ) : (
                    "Create Account"
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
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-violet-400 transition hover:text-violet-300"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>

          {/* Brand panel */}
          <div className="hidden border-l border-white/10 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-500/5 p-10 lg:flex lg:flex-col lg:justify-between">
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
                  Start shopping
                </p>

                <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-white">
                  One account.
                  <br />
                  Everything you need.
                </h2>

                <p className="mt-5 max-w-sm text-sm leading-7 text-white/50">
                  Create your ScaleCart account to keep your
                  cart, orders and shopping experience together.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-white/50">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-violet-400">
                  ✓
                </span>
                Easy account setup
              </div>

              <div className="flex items-center gap-3 text-sm text-white/50">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-violet-400">
                  ✓
                </span>
                Secure authentication
              </div>

              <div className="flex items-center gap-3 text-sm text-white/50">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-violet-400">
                  ✓
                </span>
                Track your orders
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}