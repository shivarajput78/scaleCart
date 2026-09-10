
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// import { authenticatedRequest } from "@/lib/api";
// import { getAccessToken } from "@/lib/auth";

// export default function CheckoutPage() {
//   const router = useRouter();

//   const [cart, setCart] = useState(null);
//   const [items, setItems] = useState([]);

//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddressId, setSelectedAddressId] = useState("");

//   const [showAddressForm, setShowAddressForm] = useState(false);

//   // IMPORTANT:
//   // Backend expects camelCase field names.
//   const [form, setForm] = useState({
//     fullName: "",
//     phone: "",
//     addressLine1: "",
//     addressLine2: "",
//     city: "",
//     state: "",
//     postalCode: "",
//     country: "India",
//     isDefault: false,
//   });

//   const [loading, setLoading] = useState(true);
//   const [savingAddress, setSavingAddress] = useState(false);
//   const [creatingOrder, setCreatingOrder] = useState(false);

//   const [error, setError] = useState("");
//   const [addressError, setAddressError] = useState("");

//   // Load cart + addresses
//   useEffect(() => {
//     let cancelled = false;

//     async function loadCheckoutData() {
//       try {
//         const token = getAccessToken();

//         if (!token) {
//           router.push("/login");
//           return;
//         }

//         const [cartData, addressData] = await Promise.all([
//           authenticatedRequest("/cart"),
//           authenticatedRequest("/addresses"),
//         ]);

//         if (cancelled) {
//           return;
//         }

//         const cartResult = cartData.cart || cartData;

//         const addressResult =
//           addressData.addresses ||
//           addressData.data ||
//           [];

//         setCart(cartResult);
//         setItems(cartResult.items || []);

//         setAddresses(addressResult);

//         // Select default address automatically
//         const defaultAddress = addressResult.find(
//           (address) => address.is_default === true
//         );

//         if (defaultAddress) {
//           setSelectedAddressId(String(defaultAddress.id));
//         } else if (addressResult.length > 0) {
//           setSelectedAddressId(String(addressResult[0].id));
//         }

//         setLoading(false);
//       } catch (error) {
//         console.error("Checkout loading error:", error);

//         if (!cancelled) {
//           setError(
//             error.message || "Failed to load checkout"
//           );

//           setLoading(false);
//         }
//       }
//     }

//     loadCheckoutData();

//     return () => {
//       cancelled = true;
//     };
//   }, [router]);

//   function handleInputChange(event) {
//     const { name, value, type, checked } = event.target;

//     setForm((current) => ({
//       ...current,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   }

//   async function handleAddAddress(event) {
//     event.preventDefault();

//     try {
//       setSavingAddress(true);
//       setAddressError("");

//       const data = await authenticatedRequest(
//         "/addresses",
//         {
//           method: "POST",
//           body: JSON.stringify(form),
//         }
//       );

//       const newAddress =
//         data.address || data.data;

//       if (newAddress) {
//         setAddresses((current) => [
//           ...current,
//           newAddress,
//         ]);

//         setSelectedAddressId(
//           String(newAddress.id)
//         );
//       } else {
//         // Fallback: reload addresses
//         const addressData =
//           await authenticatedRequest("/addresses");

//         const updatedAddresses =
//           addressData.addresses ||
//           addressData.data ||
//           [];

//         setAddresses(updatedAddresses);

//         if (updatedAddresses.length > 0) {
//           const latest =
//             updatedAddresses[
//               updatedAddresses.length - 1
//             ];

//           setSelectedAddressId(
//             String(latest.id)
//           );
//         }
//       }

//       // IMPORTANT:
//       // Reset using same camelCase names
//       setForm({
//         fullName: "",
//         phone: "",
//         addressLine1: "",
//         addressLine2: "",
//         city: "",
//         state: "",
//         postalCode: "",
//         country: "India",
//         isDefault: false,
//       });

//       setShowAddressForm(false);
//     } catch (error) {
//       console.error(
//         "Add address error:",
//         error
//       );

//       setAddressError(
//         error.message ||
//           "Failed to add address"
//       );
//     } finally {
//       setSavingAddress(false);
//     }
//   }

//   async function handleCreateOrder() {
//     try {
//       setError("");

//       if (!selectedAddressId) {
//         setError(
//           "Please select a delivery address"
//         );
//         return;
//       }

//       if (items.length === 0) {
//         setError("Your cart is empty");
//         return;
//       }

//       setCreatingOrder(true);

//       const data =
//         await authenticatedRequest(
//           "/orders",
//           {
//             method: "POST",
//             body: JSON.stringify({
//               addressId: Number(
//                 selectedAddressId
//               ),
//             }),
//           }
//         );

//       const order =
//         data.order || data.data;

//       if (!order || !order.id) {
//         throw new Error(
//           "Order was created but order ID was not returned"
//         );
//       }

//       router.push(
//         `/checkout/payment?orderId=${order.id}`
//       );
//     } catch (error) {
//       console.error(
//         "Create order error:",
//         error
//       );

//       setError(
//         error.message ||
//           "Failed to create order"
//       );
//     } finally {
//       setCreatingOrder(false);
//     }
//   }

//   function calculateSubtotal() {
//     return items.reduce(
//       (total, item) =>
//         total +
//         Number(item.price) *
//           Number(item.quantity),
//       0
//     );
//   }

//   if (loading) {
//     return (
//       <section className="mx-auto max-w-7xl px-6 py-20 text-center">
//         <p className="text-gray-500">
//           Loading checkout...
//         </p>
//       </section>
//     );
//   }

//   if (error && items.length === 0) {
//     return (
//       <section className="mx-auto max-w-7xl px-6 py-20">
//         <div className="rounded-lg bg-red-50 p-5 text-red-700">
//           {error}
//         </div>
//       </section>
//     );
//   }

//   const subtotal = calculateSubtotal();

//   const shippingFee =
//     subtotal >= 500 ? 0 : 50;

//   const total =
//     subtotal + shippingFee;

//   return (
//     <section className="mx-auto max-w-7xl px-6 py-10">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold">
//           Checkout
//         </h1>

//         <p className="mt-2 text-gray-500">
//           Select your delivery address and
//           review your order.
//         </p>
//       </div>

//       {error && (
//         <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
//           {error}
//         </div>
//       )}

//       <div className="grid gap-8 lg:grid-cols-3">
//         {/* LEFT */}
//         <div className="space-y-6 lg:col-span-2">

//           {/* ADDRESS */}
//           <div className="rounded-xl border bg-white p-6">
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-bold">
//                 Delivery Address
//               </h2>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setShowAddressForm(
//                     (current) => !current
//                   )
//                 }
//                 className="rounded-lg border px-4 py-2 text-sm font-medium"
//               >
//                 {showAddressForm
//                   ? "Cancel"
//                   : "Add New Address"}
//               </button>
//             </div>

//             {/* ADDRESS LIST */}
//             <div className="mt-6 space-y-4">
//               {addresses.length === 0 &&
//                 !showAddressForm && (
//                   <div className="rounded-lg border border-dashed p-6 text-center">
//                     <p className="text-gray-500">
//                       No saved addresses.
//                     </p>

//                     <button
//                       type="button"
//                       onClick={() =>
//                         setShowAddressForm(true)
//                       }
//                       className="mt-3 font-medium underline"
//                     >
//                       Add an address
//                     </button>
//                   </div>
//                 )}

//               {addresses.map((address) => (
//                 <label
//                   key={address.id}
//                   className={`block cursor-pointer rounded-lg border p-4 ${
//                     String(selectedAddressId) ===
//                     String(address.id)
//                       ? "border-black"
//                       : ""
//                   }`}
//                 >
//                   <div className="flex gap-3">
//                     <input
//                       type="radio"
//                       name="address"
//                       value={address.id}
//                       checked={
//                         String(
//                           selectedAddressId
//                         ) ===
//                         String(address.id)
//                       }
//                       onChange={(event) =>
//                         setSelectedAddressId(
//                           event.target.value
//                         )
//                       }
//                     />

//                     <div>
//                       <p className="font-semibold">
//                         {address.full_name}
//                       </p>

//                       <p className="mt-1 text-sm text-gray-600">
//                         {address.phone}
//                       </p>

//                       <p className="mt-2 text-sm text-gray-600">
//                         {address.address_line1}

//                         {address.address_line2
//                           ? `, ${address.address_line2}`
//                           : ""}
//                       </p>

//                       <p className="text-sm text-gray-600">
//                         {address.city},{" "}
//                         {address.state}{" "}
//                         {address.postal_code}
//                       </p>

//                       <p className="text-sm text-gray-600">
//                         {address.country}
//                       </p>

//                       {address.is_default && (
//                         <span className="mt-2 inline-block text-xs font-medium">
//                           Default Address
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </label>
//               ))}
//             </div>

//             {/* NEW ADDRESS FORM */}
//             {showAddressForm && (
//               <form
//                 onSubmit={handleAddAddress}
//                 className="mt-6 border-t pt-6"
//               >
//                 <h3 className="text-lg font-semibold">
//                   Add New Address
//                 </h3>

//                 {addressError && (
//                   <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
//                     {addressError}
//                   </div>
//                 )}

//                 <div className="mt-5 grid gap-4 md:grid-cols-2">

//                   {/* FULL NAME */}
//                   <input
//                     name="fullName"
//                     value={form.fullName}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="Full name"
//                     className="rounded-lg border px-4 py-3"
//                   />

//                   {/* PHONE */}
//                   <input
//                     name="phone"
//                     value={form.phone}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="Phone"
//                     className="rounded-lg border px-4 py-3"
//                   />

//                   {/* ADDRESS LINE 1 */}
//                   <input
//                     name="addressLine1"
//                     value={form.addressLine1}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="Address line 1"
//                     className="rounded-lg border px-4 py-3 md:col-span-2"
//                   />

//                   {/* ADDRESS LINE 2 */}
//                   <input
//                     name="addressLine2"
//                     value={form.addressLine2}
//                     onChange={handleInputChange}
//                     placeholder="Address line 2 (optional)"
//                     className="rounded-lg border px-4 py-3 md:col-span-2"
//                   />

//                   {/* CITY */}
//                   <input
//                     name="city"
//                     value={form.city}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="City"
//                     className="rounded-lg border px-4 py-3"
//                   />

//                   {/* STATE */}
//                   <input
//                     name="state"
//                     value={form.state}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="State"
//                     className="rounded-lg border px-4 py-3"
//                   />

//                   {/* POSTAL CODE */}
//                   <input
//                     name="postalCode"
//                     value={form.postalCode}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="Postal code"
//                     className="rounded-lg border px-4 py-3"
//                   />

//                   {/* COUNTRY */}
//                   <input
//                     name="country"
//                     value={form.country}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="Country"
//                     className="rounded-lg border px-4 py-3"
//                   />
//                 </div>

//                 {/* DEFAULT ADDRESS */}
//                 <label className="mt-5 flex items-center gap-2 text-sm">
//                   <input
//                     type="checkbox"
//                     name="isDefault"
//                     checked={form.isDefault}
//                     onChange={handleInputChange}
//                   />

//                   Make this my default address
//                 </label>

//                 {/* SAVE */}
//                 <button
//                   type="submit"
//                   disabled={savingAddress}
//                   className="mt-5 rounded-lg bg-black px-6 py-3 font-medium text-white disabled:opacity-50"
//                 >
//                   {savingAddress
//                     ? "Saving..."
//                     : "Save Address"}
//                 </button>
//               </form>
//             )}
//           </div>

//           {/* PRODUCTS */}
//           <div className="rounded-xl border bg-white p-6">
//             <h2 className="text-xl font-bold">
//               Your Items
//             </h2>

//             <div className="mt-5 space-y-4">
//               {items.map((item) => (
//                 <div
//                   key={item.product_id}
//                   className="flex items-center justify-between border-b pb-4 last:border-b-0"
//                 >
//                   <div>
//                     <p className="font-medium">
//                       {item.name}
//                     </p>

//                     <p className="text-sm text-gray-500">
//                       ₹
//                       {Number(
//                         item.price
//                       ).toFixed(2)}{" "}
//                       × {item.quantity}
//                     </p>
//                   </div>

//                   <p className="font-semibold">
//                     ₹
//                     {(
//                       Number(item.price) *
//                       Number(item.quantity)
//                     ).toFixed(2)}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* RIGHT - SUMMARY */}
//         <div className="h-fit rounded-xl border bg-white p-6">
//           <h2 className="text-xl font-bold">
//             Order Summary
//           </h2>

//           <div className="mt-6 space-y-4">
//             <div className="flex justify-between">
//               <span className="text-gray-600">
//                 Subtotal
//               </span>

//               <span>
//                 ₹{subtotal.toFixed(2)}
//               </span>
//             </div>

//             <div className="flex justify-between">
//               <span className="text-gray-600">
//                 Shipping
//               </span>

//               <span>
//                 {shippingFee === 0
//                   ? "FREE"
//                   : `₹${shippingFee.toFixed(2)}`}
//               </span>
//             </div>
//           </div>

//           <div className="mt-6 border-t pt-5">
//             <div className="flex justify-between">
//               <span className="font-bold">
//                 Total
//               </span>

//               <span className="text-xl font-bold">
//                 ₹{total.toFixed(2)}
//               </span>
//             </div>
//           </div>

//           <button
//             type="button"
//             disabled={
//               creatingOrder ||
//               !selectedAddressId ||
//               items.length === 0
//             }
//             onClick={handleCreateOrder}
//             className="mt-6 w-full rounded-lg bg-black px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {creatingOrder
//               ? "Creating Order..."
//               : "Continue to Payment"}
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }





"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authenticatedRequest } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });

  const [loading, setLoading] = useState(true);
  const [savingAddress, setSavingAddress] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [error, setError] = useState("");
  const [addressError, setAddressError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCheckoutData() {
      try {
        const token = getAccessToken();

        if (!token) {
          router.push("/login");
          return;
        }

        const [cartData, addressData] = await Promise.all([
          authenticatedRequest("/cart"),
          authenticatedRequest("/addresses"),
        ]);

        if (cancelled) {
          return;
        }

        const cartResult = cartData.cart || cartData;

        const addressResult =
          addressData.addresses ||
          addressData.data ||
          [];

        setCart(cartResult);
        setItems(cartResult.items || []);

        setAddresses(addressResult);

        const defaultAddress = addressResult.find(
          (address) => address.is_default === true
        );

        if (defaultAddress) {
          setSelectedAddressId(String(defaultAddress.id));
        } else if (addressResult.length > 0) {
          setSelectedAddressId(
            String(addressResult[0].id)
          );
        }

        setLoading(false);
      } catch (error) {
        console.error(
          "Checkout loading error:",
          error
        );

        if (!cancelled) {
          setError(
            error.message ||
              "Failed to load checkout"
          );

          setLoading(false);
        }
      }
    }

    loadCheckoutData();

    return () => {
      cancelled = true;
    };
  }, [router]);

  function handleInputChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  async function handleAddAddress(event) {
    event.preventDefault();

    try {
      setSavingAddress(true);
      setAddressError("");

      const data =
        await authenticatedRequest(
          "/addresses",
          {
            method: "POST",
            body: JSON.stringify(form),
          }
        );

      const newAddress =
        data.address || data.data;

      if (newAddress) {
        setAddresses((current) => [
          ...current,
          newAddress,
        ]);

        setSelectedAddressId(
          String(newAddress.id)
        );
      } else {
        const addressData =
          await authenticatedRequest(
            "/addresses"
          );

        const updatedAddresses =
          addressData.addresses ||
          addressData.data ||
          [];

        setAddresses(updatedAddresses);

        if (updatedAddresses.length > 0) {
          const latest =
            updatedAddresses[
              updatedAddresses.length - 1
            ];

          setSelectedAddressId(
            String(latest.id)
          );
        }
      }

      setForm({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        isDefault: false,
      });

      setShowAddressForm(false);
    } catch (error) {
      console.error(
        "Add address error:",
        error
      );

      setAddressError(
        error.message ||
          "Failed to add address"
      );
    } finally {
      setSavingAddress(false);
    }
  }

  async function handleCreateOrder() {
    try {
      setError("");

      if (!selectedAddressId) {
        setError(
          "Please select a delivery address"
        );
        return;
      }

      if (items.length === 0) {
        setError("Your cart is empty");
        return;
      }

      setCreatingOrder(true);

      const data =
        await authenticatedRequest(
          "/orders",
          {
            method: "POST",
            body: JSON.stringify({
              addressId: Number(
                selectedAddressId
              ),
            }),
          }
        );

      const order =
        data.order || data.data;

      if (!order || !order.id) {
        throw new Error(
          "Order was created but order ID was not returned"
        );
      }

      router.push(
        `/checkout/payment?orderId=${order.id}`
      );
    } catch (error) {
      console.error(
        "Create order error:",
        error
      );

      setError(
        error.message ||
          "Failed to create order"
      );
    } finally {
      setCreatingOrder(false);
    }
  }

  function calculateSubtotal() {
    return items.reduce(
      (total, item) =>
        total +
        Number(item.price) *
          Number(item.quantity),
      0
    );
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto h-14 w-14 animate-pulse rounded-2xl border border-white/10 bg-white/[0.05]" />

          <div className="mx-auto mt-7 h-7 w-40 animate-pulse rounded-lg bg-white/[0.06]" />

          <div className="mx-auto mt-3 h-4 w-72 animate-pulse rounded-lg bg-white/[0.04]" />
        </div>
      </section>
    );
  }

  if (error && items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-red-500/20 bg-red-500/[0.06] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-xl text-red-300">
            !
          </div>

          <h1 className="mt-6 text-2xl font-bold text-white">
            Checkout unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-red-200/70">
            {error}
          </p>

          <button
            type="button"
            onClick={() => router.push("/cart")}
            className="mt-7 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
          >
            Back to Cart
          </button>
        </div>
      </section>
    );
  }

  const subtotal = calculateSubtotal();

  const shippingFee =
    subtotal >= 500 ? 0 : 50;

  const total =
    subtotal + shippingFee;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-300">
          Secure checkout
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Checkout
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50 sm:text-base">
          Select your delivery address and review your
          order before continuing to payment.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-5 py-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* LEFT */}
        <div className="space-y-6">
          {/* Address Card */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-xl shadow-black/10">
            <div className="flex flex-col gap-4 border-b border-white/[0.07] p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                  Step 1
                </p>

                <h2 className="mt-2 text-xl font-bold text-white">
                  Delivery Address
                </h2>

                <p className="mt-1 text-sm text-white/40">
                  Where should we deliver your order?
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAddressForm(
                    (current) => !current
                  )
                }
                className="w-fit rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white"
              >
                {showAddressForm
                  ? "Cancel"
                  : "+ Add New Address"}
              </button>
            </div>

            <div className="p-6">
              {/* Address list */}
              <div className="space-y-3">
                {addresses.length === 0 &&
                  !showAddressForm && (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-xl">
                        📍
                      </div>

                      <p className="mt-4 text-sm font-medium text-white/70">
                        No saved addresses
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setShowAddressForm(
                            true
                          )
                        }
                        className="mt-3 text-sm font-semibold text-violet-300 transition hover:text-violet-200"
                      >
                        Add an address →
                      </button>
                    </div>
                  )}

                {addresses.map((address) => {
                  const selected =
                    String(
                      selectedAddressId
                    ) ===
                    String(address.id);

                  return (
                    <label
                      key={address.id}
                      className={`block cursor-pointer rounded-2xl border p-5 transition ${
                        selected
                          ? "border-violet-400/50 bg-violet-500/[0.07] shadow-lg shadow-violet-500/5"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className="pt-1">
                          <input
                            type="radio"
                            name="address"
                            value={address.id}
                            checked={selected}
                            onChange={(event) =>
                              setSelectedAddressId(
                                event.target.value
                              )
                            }
                            className="h-4 w-4 accent-violet-500"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-white">
                              {address.full_name}
                            </p>

                            {address.is_default && (
                              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                                Default
                              </span>
                            )}

                            {selected && (
                              <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-300">
                                Selected
                              </span>
                            )}
                          </div>

                          <p className="mt-2 text-sm text-white/50">
                            {address.phone}
                          </p>

                          <div className="mt-3 text-sm leading-6 text-white/60">
                            <p>
                              {address.address_line1}
                              {address.address_line2
                                ? `, ${address.address_line2}`
                                : ""}
                            </p>

                            <p>
                              {address.city},{" "}
                              {address.state}{" "}
                              {address.postal_code}
                            </p>

                            <p>
                              {address.country}
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* New address form */}
              {showAddressForm && (
                <form
                  onSubmit={handleAddAddress}
                  className="mt-6 border-t border-white/[0.07] pt-6"
                >
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                      New address
                    </p>

                    <h3 className="mt-2 text-lg font-bold text-white">
                      Add Delivery Address
                    </h3>
                  </div>

                  {addressError && (
                    <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4 text-sm text-red-300">
                      {addressError}
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={
                        handleInputChange
                      }
                      required
                      placeholder="Full name"
                      className="sc-input"
                    />

                    <input
                      name="phone"
                      value={form.phone}
                      onChange={
                        handleInputChange
                      }
                      required
                      placeholder="Phone number"
                      className="sc-input"
                    />

                    <input
                      name="addressLine1"
                      value={form.addressLine1}
                      onChange={
                        handleInputChange
                      }
                      required
                      placeholder="Address line 1"
                      className="sc-input md:col-span-2"
                    />

                    <input
                      name="addressLine2"
                      value={form.addressLine2}
                      onChange={
                        handleInputChange
                      }
                      placeholder="Address line 2 (optional)"
                      className="sc-input md:col-span-2"
                    />

                    <input
                      name="city"
                      value={form.city}
                      onChange={
                        handleInputChange
                      }
                      required
                      placeholder="City"
                      className="sc-input"
                    />

                    <input
                      name="state"
                      value={form.state}
                      onChange={
                        handleInputChange
                      }
                      required
                      placeholder="State"
                      className="sc-input"
                    />

                    <input
                      name="postalCode"
                      value={form.postalCode}
                      onChange={
                        handleInputChange
                      }
                      required
                      placeholder="Postal code"
                      className="sc-input"
                    />

                    <input
                      name="country"
                      value={form.country}
                      onChange={
                        handleInputChange
                      }
                      required
                      placeholder="Country"
                      className="sc-input"
                    />
                  </div>

                  <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-white/60">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={form.isDefault}
                      onChange={
                        handleInputChange
                      }
                      className="h-4 w-4 accent-violet-500"
                    />

                    Make this my default address
                  </label>

                  <button
                    type="submit"
                    disabled={savingAddress}
                    className="mt-6 rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/15 transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingAddress
                      ? "Saving Address..."
                      : "Save Address"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-xl shadow-black/10">
            <div className="border-b border-white/[0.07] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                Step 2
              </p>

              <h2 className="mt-2 text-xl font-bold text-white">
                Your Items
              </h2>

              <p className="mt-1 text-sm text-white/40">
                {items.length}{" "}
                {items.length === 1
                  ? "item"
                  : "items"}{" "}
                in your order
              </p>
            </div>

            <div className="divide-y divide-white/[0.07] px-6">
              {items.map((item) => {
                const itemTotal =
                  Number(item.price) *
                  Number(item.quantity);

                return (
                  <div
                    key={item.product_id}
                    className="flex items-center justify-between gap-4 py-5"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/[0.08] text-lg">
                        ◇
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">
                          {item.name}
                        </p>

                        <p className="mt-1 text-sm text-white/40">
                          ₹
                          {Number(
                            item.price
                          ).toFixed(2)}{" "}
                          × {item.quantity}
                        </p>
                      </div>
                    </div>

                    <p className="shrink-0 font-semibold text-white">
                      ₹{itemTotal.toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        <aside className="h-fit lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20">
            <div className="border-b border-white/[0.07] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                Step 3
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                Order Summary
              </h2>
            </div>

            <div className="space-y-5 p-6">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">
                  Subtotal
                </span>

                <span className="font-medium text-white">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-white/50">
                  Shipping
                </span>

                <span
                  className={
                    shippingFee === 0
                      ? "font-semibold text-emerald-300"
                      : "font-medium text-white"
                  }
                >
                  {shippingFee === 0
                    ? "FREE"
                    : `₹${shippingFee.toFixed(2)}`}
                </span>
              </div>

              {shippingFee > 0 && (
                <div className="rounded-xl border border-violet-400/10 bg-violet-500/[0.06] px-4 py-3 text-xs leading-5 text-violet-200/70">
                  Add ₹
                  {(500 - subtotal).toFixed(2)}{" "}
                  more to unlock free shipping.
                </div>
              )}

              <div className="border-t border-white/[0.08] pt-5">
                <div className="flex items-end justify-between">
                  <span className="font-semibold text-white">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-white">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={
                  creatingOrder ||
                  !selectedAddressId ||
                  items.length === 0
                }
                onClick={handleCreateOrder}
                className="w-full rounded-xl bg-violet-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-400 hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {creatingOrder
                  ? "Creating Order..."
                  : "Continue to Payment →"}
              </button>

              {!selectedAddressId && (
                <p className="text-center text-xs text-amber-300/70">
                  Select a delivery address to
                  continue.
                </p>
              )}
            </div>
          </div>

          {/* Security */}
          <div className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-sm text-emerald-300">
                🔒
              </div>

              <div>
                <p className="text-sm font-semibold text-white/80">
                  Secure checkout
                </p>

                <p className="mt-1 text-xs leading-5 text-white/35">
                  Your order details are securely
                  processed before payment.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

