"use client";

import React, { useCallback, useEffect, useState } from "react";
import callAPI from "utils/callAPI";
import styles from "./page.module.scss";
import { useAuth } from "../../../providers/authProvider";

type CartItem = {
  id: number;
  brand_name: string;
  price: string;
  product_id: number;
  quantity: number;
  stock: number;
};

function Page() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const [updatedQuantity, setUpdatedQuantity] = useState(1);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [selectedCheckoutItems, setSelectedCheckoutItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  const fetchCartItems = useCallback(async () => {
    if (user?.role !== "customer") return;

    setIsLoading(true);
    try {
      const data = await callAPI<CartItem[]>(`${process.env.NEXT_PUBLIC_API_URL}/customer/cart`);
      setCartItems(data || []);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const openModal = (item: CartItem) => {
    setSelectedItem(item);
    setUpdatedQuantity(item.quantity);
    setIsModalOpen(true);
  };

  const handleUpdateQuantity = async () => {
    if (!selectedItem) return;
    if (selectedItem && Number(updatedQuantity) === selectedItem?.quantity) return alert("Select different quantity to update");

    setIsLoading(true);
    try {
      const response = await callAPI<{ message: string }>(`${process.env.NEXT_PUBLIC_API_URL}/customer/cart`, {
        method: "POST",
        body: {
          productId: selectedItem.product_id,
          quantity: updatedQuantity,
        },
      });
      alert(response.message);
    } finally {
      fetchCartItems();
      setIsModalOpen(false);
    }
  };

  const handleRemoveItem = async () => {
    if (!selectedItem) return;

    try {
      const response = await callAPI<{ message: string }>(`${process.env.NEXT_PUBLIC_API_URL}/customer/cart`, {
        method: "DELETE",
        body: { productId: selectedItem.product_id },
      });
      alert(response.message);
    } finally {
      fetchCartItems();
      setIsModalOpen(false);
    }
  };

  const handleCheckout = async () => {
    if (selectedCheckoutItems.length === 0) {
      alert("Select at least one item to checkout.");
      return;
    }

    try {
      const response = await callAPI<{ message: string }>(`${process.env.NEXT_PUBLIC_API_URL}/customer/order`, {
        method: "POST",
        body: {
          itemIds: selectedCheckoutItems.map((item) => String(item.product_id)).join(","),
        },
      });
      alert(response.message);
    } finally {
      fetchCartItems();
      setSelectedCheckoutItems([]);
      setIsCheckoutModalOpen(false);
    }
  };

  if (user?.role !== "customer") {
    return <div className={styles.loading}>This route is for customer only</div>;
  }

  if (isLoading) {
    return <div className={styles.loading}>Loading cart items...</div>;
  }

  if (cartItems.length === 0) {
    return <div className={styles.emptyCart}>Your cart is empty</div>;
  }

  return (
    <div id="cart">
      <div className={styles.header}>
        <h1>Your Cart</h1>
        <button className={styles.checkoutButton} onClick={() => setIsCheckoutModalOpen(true)}>
          Checkout
        </button>
      </div>

      <div className={styles.cart}>
        {cartItems.map((item) => (
          <div key={item.id} className={styles.cartItem} onClick={() => openModal(item)}>
            <div className={styles.imgWrapper}>
              <img src={`${process.env.NEXT_PUBLIC_API_URL}/img/${item.id}_1.webp`} />
            </div>
            <div className={styles.des}>
              <p>{item.brand_name}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={`${styles.modal} ${isModalOpen ? styles.visible : ""}`}>
        <div className={styles.modalContent}>
          {selectedItem && (
            <>
              <div className={styles.imgWrapper}>
                <img src={`${process.env.NEXT_PUBLIC_API_URL}/img/${selectedItem.id}_1.webp`} />
                <img src={`${process.env.NEXT_PUBLIC_API_URL}/img/${selectedItem.id}_2.webp`} />
              </div>
              <div className={styles.modalDes}>
                <p>Brand: {selectedItem.brand_name}</p>
                <p>Price: ${selectedItem.price}</p>
                <div>
                  <label>Quantity: </label>
                  <input type="text" value={updatedQuantity} onChange={(e) => setUpdatedQuantity(Number(e.target.value))} min="1" max={selectedItem.stock.toString()} />
                </div>
                <button onClick={handleUpdateQuantity}>Save</button>
                <button onClick={handleRemoveItem}>Delete</button>
                <button onClick={() => setIsModalOpen(false)}>Close</button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className={`${styles.modal} ${isCheckoutModalOpen ? styles.visible : ""}`}>
        <div className={styles.modalContent}>
          <h2>Select Items to Checkout</h2>
          <div className={styles.checkoutList}>
            {cartItems.map((item) => (
              <label key={item.id} className={styles.checkoutItem}>
                <input
                  type="checkbox"
                  checked={selectedCheckoutItems.some((selectedItem) => selectedItem.id === item.id)} // Compare CartItem objects
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCheckoutItems([...selectedCheckoutItems, item]);
                    } else {
                      setSelectedCheckoutItems(selectedCheckoutItems.filter((i) => i.id !== item.id));
                    }
                  }}
                />
                <div className={styles.checkoutItemContent}>
                  <div className={styles.checkoutImgWrapper}>
                    <img src={`${process.env.NEXT_PUBLIC_API_URL}/img/${item.id}_1.webp`} alt={item.brand_name} />
                  </div>
                  <div>
                    <p>{item.brand_name}</p>
                    <p>${(Number(item.price) * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
          <p>Total: ${selectedCheckoutItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0).toFixed(2)}</p>

          <button onClick={() => handleCheckout()}>Proceed</button>
          <button onClick={() => setIsCheckoutModalOpen(false)}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default Page;
