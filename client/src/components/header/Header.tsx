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
        <div>
          <Link href="/rooms">Rooms</Link>
        </div>
        <div>
          <Link href="/products">Products</Link>
        </div>
        <div>
          <Link href="/categories">Categories</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
