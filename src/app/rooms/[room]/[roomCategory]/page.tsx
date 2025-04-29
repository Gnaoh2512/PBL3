"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Product } from "types";
import callAPI from "utils/callAPI";
import styles from "./page.module.scss";
import { cap } from "utils/pathFormat";
import Link from "next/link";

function Page() {
  const params = useParams();
  const room = params.room as string;
  const roomCategory = params.roomCategory as string;
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetProducts = async () => {
      try {
        const data = await callAPI<Product[]>(`${process.env.NEXT_PUBLIC_API_URL}/data/rooms/${room}/${roomCategory}`);
        setProducts(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    if (roomCategory) {
      fetProducts();
    }
  }, [roomCategory, room]);

  return (
    <div id="roomCategory">
      <div className={styles.heading}>{cap(roomCategory)}</div>
      <div className={styles.list}>
        {products?.map((item, i) => (
          <div className={styles.item} key={i}>
            <Link href={`/products/${item.id}`}>
              <div className={styles.imgWrapper}>
                <img src={`${process.env.NEXT_PUBLIC_API_URL}/img/${item.id}_1.webp`} alt={item.name} />
                <img src={`${process.env.NEXT_PUBLIC_API_URL}/img/${item.id}_2.webp`} alt={item.name} />
              </div>
              <div className={styles.des}>
                <div className={styles.words}>
                  <p>
                    {item.categories?.map((cat, i) => (
                      <span key={i}>
                        {cat}
                        {i < item.categories.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                  <p>{item.brand}</p>
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
