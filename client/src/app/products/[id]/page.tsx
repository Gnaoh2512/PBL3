"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import callAPI from "utils/callAPI";
import { Product } from "types";
import styles from "./page.module.scss";
import { useAuth } from "../../../providers/AuthProvider";

function Page() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartQuantity, setCartQuantity] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const isCustomer = user?.role === "customer";

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      const data = await callAPI<{ product: Product }>(`${process.env.NEXT_PUBLIC_API_URL}/data/products/${id}`);
      setProduct(data.product);
    };
    fetchProduct();
  }, [id]);

  const fetchItem = useCallback(async () => {
    const quantity = await callAPI<number | null>(`${process.env.NEXT_PUBLIC_API_URL}/customer/cart/${id}`);

    setCartQuantity(quantity || null);
    setQuantity(quantity || 1);
  }, [id]);

  useEffect(() => {
    if (!isCustomer) return;

    fetchItem();
  }, [isCustomer, fetchItem]);

  const handleUpdateItem = async () => {
    if (!isCustomer) return alert("Only customers can add items to cart.");
    if (!product || isNaN(Number(quantity))) return;
    if (cartQuantity && Number(quantity) === cartQuantity) return alert("Select different quantity to update");

    setIsLoading(true);
    try {
      const response = await callAPI<{ message: string }>(`${process.env.NEXT_PUBLIC_API_URL}/customer/cart`, {
        method: "POST",
        body: {
          productId: product.id,
          quantity: quantity,
        },
      });
      alert(response.message);
      fetchItem();
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!product) return;

    const newQuantity = Number(event.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 1 && newQuantity <= product?.stock) {
      setQuantity(newQuantity);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading product...</div>;
  }

  if (!product) {
    return <div className={styles.loading}>Product doesnt exist</div>;
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

          {isCustomer && (isLoading ? <button disabled>Processing...</button> : <button onClick={handleUpdateItem}>{cartQuantity ? "Update quantity" : "Add to Cart"}</button>)}
        </div>
      </div>
    </div>
  );
}

export default Page;
