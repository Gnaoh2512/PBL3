"use client";

import React from "react";
import styles from "./page.module.scss";
import { useCategories } from "../../providers/CategoryProvider";
import { url } from "utils/pathFormat";

function Page() {
  const categories = useCategories();

  // Regex to allow only letters, numbers, spaces, and maybe dashes or underscores if you want
  const isValidCategory = (cat: string) => /^[a-zA-Z0-9\s-_]+$/.test(cat);

  const filteredCategories = categories.filter(isValidCategory);

  const handleClick = (e: React.MouseEvent<HTMLUListElement>) => {
    const target = (e.target as HTMLDivElement).closest(`.${styles.categoryItem}`) as HTMLDivElement;
    const category = target.getAttribute("data-category");
    if (category) {
      window.location.href = `/categories/${url(category)}`;
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Discover Our Furniture Categories</h1>
      <p className={styles.description}>
        Transform your living space with our carefully curated range of furniture. Whether you are looking for cozy sofas, elegant dining sets, or functional storage solutions, our categories help you
        explore products tailored to every room and style.
      </p>
      <ul className={styles.categoryList} onClick={handleClick}>
        {filteredCategories.map((cat, index) => (
          <li key={index} className={styles.categoryItem} data-category={cat} style={{ cursor: "pointer" }}>
            {cat}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Page;
