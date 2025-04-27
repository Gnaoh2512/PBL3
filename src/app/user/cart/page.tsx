"use client";

import React, { useEffect, useState } from "react";
import callAPI from "utils/callAPI";
import styles from "./page.module.scss";

type CartItem = {
  id: number;
  brand_name: string;
  price: string;
  product_id: number;
  quantity: number;
  stock: number;
  time: string;
};

function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const [updatedQuantity, setUpdatedQuantity] = useState<string>("");
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [selectedCheckoutItems, setSelectedCheckoutItems] = useState<CartItem[]>([]); // Updated state

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const data = await callAPI<{ items: CartItem[] }>(`${process.env.NEXT_PUBLIC_API_URL}/customer/cart`);
        console.log(data.items);
        setCartItems(data.items || []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const openModal = (item: CartItem) => {
    setSelectedItem(item);
    setUpdatedQuantity(String(item.quantity));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdateItem = async () => {
    if (!selectedItem) return;
    if (selectedItem && Number(updatedQuantity) === selectedItem?.quantity) return alert("Select different quantity to update");

    setIsLoading(true);
    try {
      const response = await callAPI<{ message: string }>(`${process.env.NEXT_PUBLIC_API_URL}/customer/cart`, {
        method: "POST",
        body: {
          productId: String(selectedItem.product_id),
          quantity: updatedQuantity,
        },
      });
      alert(response.message);
    } finally {
      const cartData = await callAPI<{ items: CartItem[] }>(`${process.env.NEXT_PUBLIC_API_URL}/customer/cart`);
      setCartItems(cartData.items || []);
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;

    try {
      const response = await callAPI<{ message: string }>(`${process.env.NEXT_PUBLIC_API_URL}/customer/cart`, {
        method: "DELETE",
        body: { productId: String(selectedItem.product_id) },
      });
      alert(response.message);
    } finally {
      const data = await callAPI<{ items: CartItem[] }>(`${process.env.NEXT_PUBLIC_API_URL}/customer/cart`);
      setCartItems(data.items || []);
      handleCloseModal();
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
          items: selectedCheckoutItems.map((item) => ({
            productId: String(item.product_id), // Use productId from CartItem
            quantity: item.quantity,
            priceAtOrder: item.price,
          })),
        },
      });
      alert(response.message);
    } finally {
      const data = await callAPI<{ items: CartItem[] }>(`${process.env.NEXT_PUBLIC_API_URL}/customer/cart`);
      setCartItems(data.items || []);
      setSelectedCheckoutItems([]); // Clear selection after checkout
      setIsCheckoutModalOpen(false); // Close checkout modal
    }
  };

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
                  <input type="text" value={updatedQuantity} onChange={(e) => setUpdatedQuantity(e.target.value)} min="1" max={selectedItem.stock.toString()} />
                </div>
                <button onClick={handleUpdateItem}>Save</button>
                <button onClick={handleDeleteItem}>Delete</button>
                <button onClick={handleCloseModal}>Close</button>
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
                    <p>${item.price}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
          <button onClick={() => handleCheckout()}>Proceed</button>
          <button onClick={() => setIsCheckoutModalOpen(false)}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
