"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import callAPI from "utils/callAPI";
import { Product } from "types";
import styles from "./page.module.scss";

type res = {
  mainProduct: Product;
  relatedProducts: Product[];
};

function Page() {
  const { id } = useParams();
  const [product, setProduct] = useState<res | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const data = await callAPI<res>(`${process.env.NEXT_PUBLIC_API_URL}/data/products/${id}`);
        setProduct(data);
        console.log(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  return (
    <div id="product">
      <div className={styles.main}>
        <div className={styles.imgWrapper}>
          <img src={`${process.env.NEXT_PUBLIC_API_URL}/img/${product?.mainProduct.id}_1.webp`} alt="main" />
          <img src={`${process.env.NEXT_PUBLIC_API_URL}/img/${product?.mainProduct.id}_2.webp`} alt="main" />
        </div>
        <div className={styles.des}>
          <div className={styles.wrapper}>
            <p className={styles.brand}>{product?.mainProduct.brand}</p>
            <p className={styles.cat}>
              {product?.mainProduct.categories?.map((cat, i) => (
                <span key={i}>
                  {cat}
                  {i < product?.mainProduct.categories.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
            <p className={styles.number}>
              <span>Available: {product?.mainProduct.stock}</span>
              <span>${product?.mainProduct.price}</span>
            </p>
          </div>
          <button>Add to cart</button>
        </div>
      </div>
    </div>
  );
}

export default Page;
