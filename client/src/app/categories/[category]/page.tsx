"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Product } from "types";
import callAPI from "utils/callAPI";
import styles from "../../rooms/[room]/[roomCategory]/page.module.scss";
import Link from "next/link";
import { useParams } from "next/navigation";
import { url } from "utils/pathFormat";

function Page() {
  const params = useParams();
  const categoryName = params.category;

  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [sortMode, setSortMode] = useState<"price" | "stock">("price");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const hasSpecialCharacters = /[^a-zA-Z0-9-_]/.test(categoryName as string);

  useEffect(() => {
    if (hasSpecialCharacters) return;

    const fetchProducts = async () => {
      try {
        const data = await callAPI<Product[]>(`${process.env.NEXT_PUBLIC_API_URL}/data/categories/${url(categoryName as string)}`);
        setRawProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [categoryName, hasSpecialCharacters]);

  const sortedProducts = useMemo(() => {
    return [...rawProducts].sort((a, b) => {
      const valueA = sortMode === "price" ? a.price : a.stock;
      const valueB = sortMode === "price" ? b.price : b.stock;
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    });
  }, [rawProducts, sortMode, sortDirection]);

  const toggleSortMode = () => {
    setSortMode((prev) => (prev === "price" ? "stock" : "price"));
  };

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  if (hasSpecialCharacters) {
    return (
      <div className={styles.error}>
        <h2>Invalid Category Name</h2>
        <p>The category name contains invalid characters.</p>
      </div>
    );
  }

  return (
    <div id="roomCategory">
      <div className={styles.heading}>Products</div>
      <div className={styles.description}>Explore our curated collection of high-quality products...</div>
      <div className={styles.sort}>
        <button onClick={toggleSortMode}>Sort By: {sortMode}</button>
        <button onClick={toggleSortDirection}>Direction: {sortDirection}</button>
      </div>
      <div className={styles.list}>
        {sortedProducts?.map((item, i) => (
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
