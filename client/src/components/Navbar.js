import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold">
          ScaleCart
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
          <Link href="/cart">Cart</Link>
        </div>
      </div>
    </nav>
  );
}