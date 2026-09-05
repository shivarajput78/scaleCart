
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

  // IMPORTANT:
  // Backend expects camelCase field names.
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

  // Load cart + addresses
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

        // Select default address automatically
        const defaultAddress = addressResult.find(
          (address) => address.is_default === true
        );

        if (defaultAddress) {
          setSelectedAddressId(String(defaultAddress.id));
        } else if (addressResult.length > 0) {
          setSelectedAddressId(String(addressResult[0].id));
        }

        setLoading(false);
      } catch (error) {
        console.error("Checkout loading error:", error);

        if (!cancelled) {
          setError(
            error.message || "Failed to load checkout"
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
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleAddAddress(event) {
    event.preventDefault();

    try {
      setSavingAddress(true);
      setAddressError("");

      const data = await authenticatedRequest(
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
        // Fallback: reload addresses
        const addressData =
          await authenticatedRequest("/addresses");

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

      // IMPORTANT:
      // Reset using same camelCase names
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
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="text-gray-500">
          Loading checkout...
        </p>
      </section>
    );
  }

  if (error && items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-lg bg-red-50 p-5 text-red-700">
          {error}
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
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Checkout
        </h1>

        <p className="mt-2 text-gray-500">
          Select your delivery address and
          review your order.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* LEFT */}
        <div className="space-y-6 lg:col-span-2">

          {/* ADDRESS */}
          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Delivery Address
              </h2>

              <button
                type="button"
                onClick={() =>
                  setShowAddressForm(
                    (current) => !current
                  )
                }
                className="rounded-lg border px-4 py-2 text-sm font-medium"
              >
                {showAddressForm
                  ? "Cancel"
                  : "Add New Address"}
              </button>
            </div>

            {/* ADDRESS LIST */}
            <div className="mt-6 space-y-4">
              {addresses.length === 0 &&
                !showAddressForm && (
                  <div className="rounded-lg border border-dashed p-6 text-center">
                    <p className="text-gray-500">
                      No saved addresses.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setShowAddressForm(true)
                      }
                      className="mt-3 font-medium underline"
                    >
                      Add an address
                    </button>
                  </div>
                )}

              {addresses.map((address) => (
                <label
                  key={address.id}
                  className={`block cursor-pointer rounded-lg border p-4 ${
                    String(selectedAddressId) ===
                    String(address.id)
                      ? "border-black"
                      : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <input
                      type="radio"
                      name="address"
                      value={address.id}
                      checked={
                        String(
                          selectedAddressId
                        ) ===
                        String(address.id)
                      }
                      onChange={(event) =>
                        setSelectedAddressId(
                          event.target.value
                        )
                      }
                    />

                    <div>
                      <p className="font-semibold">
                        {address.full_name}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {address.phone}
                      </p>

                      <p className="mt-2 text-sm text-gray-600">
                        {address.address_line1}

                        {address.address_line2
                          ? `, ${address.address_line2}`
                          : ""}
                      </p>

                      <p className="text-sm text-gray-600">
                        {address.city},{" "}
                        {address.state}{" "}
                        {address.postal_code}
                      </p>

                      <p className="text-sm text-gray-600">
                        {address.country}
                      </p>

                      {address.is_default && (
                        <span className="mt-2 inline-block text-xs font-medium">
                          Default Address
                        </span>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* NEW ADDRESS FORM */}
            {showAddressForm && (
              <form
                onSubmit={handleAddAddress}
                className="mt-6 border-t pt-6"
              >
                <h3 className="text-lg font-semibold">
                  Add New Address
                </h3>

                {addressError && (
                  <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {addressError}
                  </div>
                )}

                <div className="mt-5 grid gap-4 md:grid-cols-2">

                  {/* FULL NAME */}
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="Full name"
                    className="rounded-lg border px-4 py-3"
                  />

                  {/* PHONE */}
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Phone"
                    className="rounded-lg border px-4 py-3"
                  />

                  {/* ADDRESS LINE 1 */}
                  <input
                    name="addressLine1"
                    value={form.addressLine1}
                    onChange={handleInputChange}
                    required
                    placeholder="Address line 1"
                    className="rounded-lg border px-4 py-3 md:col-span-2"
                  />

                  {/* ADDRESS LINE 2 */}
                  <input
                    name="addressLine2"
                    value={form.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Address line 2 (optional)"
                    className="rounded-lg border px-4 py-3 md:col-span-2"
                  />

                  {/* CITY */}
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleInputChange}
                    required
                    placeholder="City"
                    className="rounded-lg border px-4 py-3"
                  />

                  {/* STATE */}
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleInputChange}
                    required
                    placeholder="State"
                    className="rounded-lg border px-4 py-3"
                  />

                  {/* POSTAL CODE */}
                  <input
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleInputChange}
                    required
                    placeholder="Postal code"
                    className="rounded-lg border px-4 py-3"
                  />

                  {/* COUNTRY */}
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleInputChange}
                    required
                    placeholder="Country"
                    className="rounded-lg border px-4 py-3"
                  />
                </div>

                {/* DEFAULT ADDRESS */}
                <label className="mt-5 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={form.isDefault}
                    onChange={handleInputChange}
                  />

                  Make this my default address
                </label>

                {/* SAVE */}
                <button
                  type="submit"
                  disabled={savingAddress}
                  className="mt-5 rounded-lg bg-black px-6 py-3 font-medium text-white disabled:opacity-50"
                >
                  {savingAddress
                    ? "Saving..."
                    : "Save Address"}
                </button>
              </form>
            )}
          </div>

          {/* PRODUCTS */}
          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-xl font-bold">
              Your Items
            </h2>

            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex items-center justify-between border-b pb-4 last:border-b-0"
                >
                  <div>
                    <p className="font-medium">
                      {item.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      ₹
                      {Number(
                        item.price
                      ).toFixed(2)}{" "}
                      × {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold">
                    ₹
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT - SUMMARY */}
        <div className="h-fit rounded-xl border bg-white p-6">
          <h2 className="text-xl font-bold">
            Order Summary
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">
                Subtotal
              </span>

              <span>
                ₹{subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Shipping
              </span>

              <span>
                {shippingFee === 0
                  ? "FREE"
                  : `₹${shippingFee.toFixed(2)}`}
              </span>
            </div>
          </div>

          <div className="mt-6 border-t pt-5">
            <div className="flex justify-between">
              <span className="font-bold">
                Total
              </span>

              <span className="text-xl font-bold">
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
            className="mt-6 w-full rounded-lg bg-black px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creatingOrder
              ? "Creating Order..."
              : "Continue to Payment"}
          </button>
        </div>
      </div>
    </section>
  );
}

