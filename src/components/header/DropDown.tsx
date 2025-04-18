import React from "react";
import styles from "styles/header.module.scss";

function DropDown() {
  return (
    <div className={styles.dropDownWrapper}>
      <div className={styles.current}>
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" viewBox="0 0 18 18">
            <rect x="2" y="8" width="14" height="2"></rect>
            <rect x="2" y="13" width="14" height="2"></rect>
            <rect x="2" y="3" width="14" height="2"></rect>
          </svg>
        </span>
      </div>
      <div className={styles.list}></div>
    </div>
  );
}

export default DropDown;
