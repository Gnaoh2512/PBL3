import React from "react";
import styles from "styles/header.module.scss";
import Search from "./Search";
import Link from "next/link";
import User from "components/header/User";

function Header({ categories }: { categories: string[] }) {
  return (
    <header className={styles.wrapper}>
      <div className={styles.upper}>
        <Link href="/" className={styles.logo}>
          Nesture
        </Link>
        <Search categories={categories} />
        <div className={styles.utilsWrapper}>
          <User />
        </div>
      </div>
      <div className={styles.lower}>
        <div>
          <Link href="/rooms">Rooms</Link>
        </div>
        <div>
          <Link href="/products">Products</Link>
        </div>
        <div>
          <Link href="/news">News</Link>
        </div>
        <div>
          <Link href="/discounts">Special deals</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
