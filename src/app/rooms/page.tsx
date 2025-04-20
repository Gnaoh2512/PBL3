import React from "react";
import styles from "styles/rooms.module.scss";
import Image from "next/image";
import Link from "next/link";

const data = [
  { name: "Bedroom furniture", img: "/img/bedroom.webp", href: "/bedroom" },
  { name: "Living room", img: "/img/livingroom.webp", href: "/livingroom" },
  { name: "Outdoor", img: "/img/outdoor.webp", href: "/outdoor" },
  { name: "Kitchen", img: "/img/kitchen.webp", href: "/kitchen" },
  { name: "Bathroom", img: "/img/bathroom.webp", href: "/bathroom" },
  { name: "Hallway", img: "/img/hallway.webp", href: "/hallway" },
];

const description =
  "Looking for inspiration? At IKEA you'll find everything you need for any corner of your house. Wide and comfortable beds for your bedroom, cozy sofas, dining room tables and chairs, kitchen furniture and many items, furniture and decoration that are so functional and beautiful that you'll turn your home into that place you've always dreamed of.";

function ContentPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.heading}>Rooms</div>
      <div className={styles.description}>{description}</div>
      <div className={styles.list}>
        {data.map((item, i) => (
          <div className={styles.item} key={i}>
            <Link href={`/rooms/${item.href}`}>
              <div className={styles.imgWrapper}>
                <Image src={item.img} alt={item.name} width={300} height={200} />
              </div>
              <p>{item.name}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContentPage;
