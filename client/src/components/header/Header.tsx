import React from "react";
import styles from "styles/header.module.scss";
import Search from "./Search";
import Link from "next/link";
import Utils from "./Utils";

function Header() {
  return (
    <header className={styles.wrapper}>
      <div className={styles.upper}>
        <Link href="/" className={styles.logo}>
          Nesture
        </Link>
        <Search />
        <div className={styles.utilsWrapper}>
          <Utils />
        </div>
      </div>
      <div className={styles.lower}>
        <Link href="/rooms">
          <div>Rooms</div>
        </Link>
        <Link href="/products">
          <div>Products</div>
        </Link>
        <Link href="/categories">
          <div>Categories</div>
        </Link>
      </div>
    </header>
  );
}

export default Header;
