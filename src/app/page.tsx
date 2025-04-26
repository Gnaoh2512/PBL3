import Image from "next/image";
import styles from "./page.module.scss";
import { rooms } from "./rooms/page";
import Link from "next/link";
import { norm, url } from "utils/pathFormat";

const popularCategories = [
  {
    title: "Organization in the bathroom",
    img: "/img/pop-bathroom.jpeg",
    href: "bathroom/organization-in-the-bathroom",
  },
  {
    title: "Living room furniture",
    img: "/img/pop-livingroom.jpeg",
    href: "livingroom/living-room-furniture",
  },
  {
    title: "Cookware",
    img: "/img/pop-cookware.jpeg",
    href: "kitchen/cookware",
  },
  {
    title: "Plants, plant pots & gardening",
    img: "/img/pop-gardening.jpeg",
    href: "outdoor/plants-plant-pots-gardening",
  },
  {
    title: "Lounge and relax furniture",
    img: "/img/pop-lounge.jpeg",
    href: "livingroom/lounge-and-relax-furniture",
  },
];

export default async function Home() {
  return (
    <div id="root">
      <div className={styles.hero}>
        <div className={styles.left}>
          <div className={styles.des}>
            <span>Your Dream Patio Awaits!</span>
            <p>Stylish and affordable</p>
            <button>Explore Now</button>
          </div>
          <Image src="/img/hero_1.webp" alt="hero1" width={500} height={500} />
        </div>
        <div className={styles.right}>
          <Image src="/img/hero_2.webp" alt="hero2" width={500} height={500} />
        </div>
      </div>
      <div className={styles.rooms}>
        {rooms.map((item, i) => (
          <div className={styles.item} key={i}>
            <Link href={`/rooms/${url(item)}`}>
              <Image src={`/img/${norm(item)}.webp`} alt={`/img/${norm(item)}`} width={200} height={200} />
              <div className={styles.name}>{item}</div>
            </Link>
          </div>
        ))}
      </div>
      <div className={styles.popular}>
        {popularCategories.map((item, i) => (
          <div className={styles.item} key={i}>
            <Link href={`/rooms/${item.href}`}>
              <Image src={item.img} alt={item.img} width={300} height={300} />
              <div className={styles.name}>{item.title}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
