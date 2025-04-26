import React from "react";
import styles from "./page.module.scss";
import Image from "next/image";
import Link from "next/link";
import { norm, url } from "utils/pathFormat";

export const rooms = ["Bedroom", "Living room", "Outdoor", "Kitchen", "Bathroom", "Hallway"];

const description =
  "Looking for inspiration? At Nesture you'll find everything you need for any corner of your house. Wide and comfortable beds for your bedroom, cozy sofas, dining room tables and chairs, kitchen furniture and many items, furniture and decoration that are so functional and beautiful that you'll turn your home into that place you've always dreamed of.";

function ContentPage() {
  return (
    <div id="rooms">
      <div className={styles.heading}>Rooms</div>
      <div className={styles.description}>{description}</div>
      <div className={styles.list}>
        {rooms.map((item, i) => (
          <div className={styles.item} key={i}>
            <Link href={`/rooms/${url(item)}`}>
              <div className={styles.imgWrapper}>
                <Image src={`/img/${norm(item)}.webp`} alt={item} width={300} height={200} />
              </div>
              <p>{item}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContentPage;
