"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import callAPI from "utils/callAPI";
import { Product } from "types";
import styles from "./page.module.scss";
import { useAuth } from "../../../providers/authProvider";

type CartItem = {
  id: number;
  quantity: number;
};

function Page() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const isCustomer = user?.role === "customer";
  const cartItem = cartItems.find((item) => item.id === Number(id));

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      const data = await callAPI<{ product: Product }>(`${process.env.NEXT_PUBLIC_API_URL}/data/products/${id}`);
      setProduct(data.product);
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!isCustomer) return;

    const fetchCart = async () => {
      const cartData = await callAPI<{ items: CartItem[] }>(`${process.env.NEXT_PUBLIC_API_URL}/customer/cart`);
      setCartItems(cartData.items || []);
    };

    fetchCart();
  }, [isCustomer]);

  useEffect(() => {
    if (cartItem) {
      setQuantity(String(cartItem.quantity));
    }
  }, [cartItem]);

  const handleUpdateItem = async () => {
    if (!isCustomer) return alert("Only customers can add items to cart.");
    if (!product || isNaN(Number(quantity))) return;
    if (cartItem && Number(quantity) === cartItem?.quantity) return alert("Select different quantity to update");

    setIsLoading(true);
    try {
      const response = await callAPI<{ message: string }>(`${process.env.NEXT_PUBLIC_API_URL}/customer/cart`, {
        method: "POST",
        body: {
          productId: String(product.id),
          quantity: quantity,
        },
      });
      alert(response.message);
      const cartData = await callAPI<{ items: CartItem[] }>(`${process.env.NEXT_PUBLIC_API_URL}/customer/cart`);
      setCartItems(cartData.items || []);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = event.target.value;

    if (!isNaN(Number(newQuantity)) && Number(newQuantity) >= 1) {
      setQuantity(newQuantity);
    }
  };

  if (!product) {
    return <div className={styles.loading}>Loading product...</div>;
  }

  return (
    <div id="product">
      <div className={styles.main}>
        <div className={styles.imgWrapper}>
          <img src={`${process.env.NEXT_PUBLIC_API_URL}/img/${product.id}_1.webp`} alt="main" />
          <img src={`${process.env.NEXT_PUBLIC_API_URL}/img/${product.id}_2.webp`} alt="main" />
        </div>
        <div className={styles.des}>
          <div className={styles.wrapper}>
            <p className={styles.brand}>{product.brand}</p>
            <p className={styles.cat}>
              {product.categories?.map((cat, i) => (
                <span key={i}>
                  {cat}
                  {i < product.categories.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
            <div className={styles.number}>
              <div>
                <span>Available: {product.stock}</span>
                {isCustomer && (
                  <div>
                    <label htmlFor="quantity">Quantity: </label>
                    <input id="quantity" type="text" value={quantity} onChange={handleQuantityChange} className={styles.quantityInput} />
                  </div>
                )}
              </div>
              <span>${product.price}</span>
            </div>
          </div>

          {isCustomer && (isLoading ? <button disabled>Processing...</button> : <button onClick={handleUpdateItem}>{cartItem ? "Update Cart" : "Add to Cart"}</button>)}
        </div>
      </div>
    </div>
  );
}

export default Page;
