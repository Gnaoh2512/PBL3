"use client";

import React, { useRef, useState } from "react";
import { Scrollbar } from "smooth-scrollbar-react";
import styles from "styles/header.module.scss";

function Search({ categories }: { categories: string[] }) {
  const [filtered, setFiltered] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const results = categories.filter((category) => category.toLowerCase().includes(value));
    setFiltered(value ? results : []);
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      setFiltered([]);
    }
  };

  return (
    <div className={styles.searchWrapper}>
      <div className={styles.searchBar}>
        <input type="text" ref={inputRef} placeholder="Explore our store" onChange={handleInput} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} />
        <button type="button" className={styles.clearBtn} onClick={handleClear}>
          <div style={{ padding: "0.5rem" }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M13.414,12l6.293-6.293a1,1,0,0,0-1.414-1.414L12,10.586,5.707,4.293A1,1,0,0,0,4.293,5.707L10.586,12,4.293,18.293a1,1,0,1,0,1.414,1.414L12,13.414l6.293,6.293a1,1,0,0,0,1.414-1.414Z"></path>
            </svg>
          </div>
        </button>
        <button type="submit" className={styles.searchBtn} aria-label="Search">
          <div style={{ padding: "0.5rem" }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.5 19a8.46 8.46 0 0 0 5.262-1.824l4.865 4.864 1.414-1.414-4.865-4.865A8.5 8.5 0 1 0 10.5 19m0-2a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13"
              ></path>
            </svg>
          </div>
        </button>
      </div>

      <div className={`${styles.searchResult} ${isFocused ? styles.expanded : ""}`}>
        <Scrollbar style={{ maxHeight: "30rem" }} continuousScrolling={false}>
          <div>
            <div className={styles.searchList}>
              {inputRef.current?.value && filtered.length === 0 && <div className={styles.filler}>{`${inputRef.current?.value} doesn't seem to exist`}</div>}
              {filtered.map((item, i) => (
                <div key={i} data-category={item}>
                  {item}
                </div>
              ))}
              {!inputRef.current?.value && <div className={styles.filler}>Discover every corner</div>}
            </div>
          </div>
        </Scrollbar>
      </div>
    </div>
  );
}

export default Search;
