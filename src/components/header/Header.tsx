import React from "react";
import styles from "styles/header.module.scss";
import Search from "./Search";
import Link from "next/link";

function Header({ categories }: { categories: string[] }) {
  return (
    <header className={styles.wrapper}>
      <div className={styles.upper}>
        <Link href="/" className={styles.logo}>
          Nesture
        </Link>
        <Search categories={categories} />
        <div className={styles.utilsWrapper}>
          <div>Sign in</div>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.877 12.52q.081-.115.147-.239A6 6 0 0 0 12 4.528a6 6 0 0 0-9.024 7.753q.066.123.147.24l.673.961a6 6 0 0 0 .789.915L12 21.422l7.415-7.025q.44-.418.789-.915zm-14.916.425L12 18.667l6.04-5.722q.293-.279.525-.61l.673-.961a.3.3 0 0 0 .044-.087 4 4 0 1 0-7.268-2.619v.003L12 8.667l-.013.004v-.002l-.006-.064a3.98 3.98 0 0 0-1.232-2.51 4 4 0 0 0-6.031 5.193q.014.045.044.086l.673.961a4 4 0 0 0 .526.61"
              ></path>
            </svg>
          </div>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="m5.766 5-.618-3H1v2h2.518l2.17 10.535L6.18 17h14.307l2.4-12zM7.82 15l-1.6-8h14.227l-1.6 8z"></path>
              <path d="M10.667 20.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m8.333 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"></path>
            </svg>
          </div>
        </div>
      </div>
      <div className={styles.lower}>
        <div>
          <Link href="/rooms">Rooms</Link>
        </div>
        <div>
          <Link href="/categories">Categories</Link>
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
