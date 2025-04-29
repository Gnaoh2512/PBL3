"use client";

import React, { useEffect, useState } from "react";
import { Product } from "types";
import callAPI from "utils/callAPI";
import styles from "../rooms/[room]/[roomCategory]/page.module.scss";
import Link from "next/link";

function Page() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await callAPI<Product[]>(`${process.env.NEXT_PUBLIC_API_URL}/data/products`);
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchProducts();
  }, []);

  // Function to sort products based on selected option
  const sortProducts = (option: string) => {
    const sortedProducts = [...products];
    switch (option) {
      case "price-asc":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "stock-asc":
        sortedProducts.sort((a, b) => a.stock - b.stock);
        break;
      case "stock-desc":
        sortedProducts.sort((a, b) => b.stock - a.stock);
        break;
      default:
        break;
    }
    setProducts(sortedProducts);
  };

  return (
    <div id="roomCategory">
      <div className={styles.heading}>Products</div>
      <div className={styles.description}>
        Explore our curated collection of high-quality products designed to meet your needs. From cutting-edge technology to stylish home essentials, each item is carefully selected for its
        performance, durability, and value. Whether you're upgrading your gadgets or enhancing your living space, our diverse range of products offers something for everyone. Browse through various
        categories and discover items that fit your style, preferences, and budget. Shop now to experience exceptional quality and unbeatable prices!
      </div>
      <div className={styles.sort}>
        <button onClick={() => sortProducts("price-asc")}>Price: Low to High</button>
        <button onClick={() => sortProducts("price-desc")}>Price: High to Low</button>
        <button onClick={() => sortProducts("stock-asc")}>Stock: Low to High</button>
        <button onClick={() => sortProducts("stock-desc")}>Stock: High to Low</button>
      </div>
      <div className={styles.list}>
        {products?.map((item, i) => (
          <div className={styles.item} key={i}>
            <Link href={`/products/${item.id}`}>
              <div className={styles.imgWrapper}>
                <img src={`${process.env.NEXT_PUBLIC_API_URL}/img/${item.id}_1.webp`} alt={item.brand} />
                <img src={`${process.env.NEXT_PUBLIC_API_URL}/img/${item.id}_2.webp`} alt={item.brand} />
              </div>
              <div className={styles.des}>
                <div className={styles.words}>
                  <p className={styles.categories}>{item.categories?.join(", ")}</p>
                  <p className={styles.brand}>{item.brand}</p>
                </div>
                <div className={styles.price}>{`$${item.price}`}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;
