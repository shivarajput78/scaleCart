import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "ScaleCart",
  description: "Production-level e-commerce platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="min-h-[80vh]">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}