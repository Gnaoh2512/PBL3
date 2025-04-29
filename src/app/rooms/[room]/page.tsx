"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import callAPI from "utils/callAPI";
import styles from "../page.module.scss";
import Link from "next/link";
import Image from "next/image";
import { cap, norm, url } from "utils/pathFormat";
import { RoomCategory } from "types";

const descriptions = {
  bedroom: "Create your personal retreat with cozy bedroom essentials — from soft textiles to smart storage.",
  livingroom: "Furnish your living space for comfort and connection with inviting furniture and decor.",
  kitchen: "Make every meal more enjoyable with smart kitchen tools, cookware, and storage solutions.",
  bathroom: "Turn routines into rituals with sleek storage, calming lighting, and spa-inspired accessories.",
  outdoor: "Transform your outdoor area into a relaxing oasis with durable furniture and garden accessories.",
  hallway: "Keep your entryway organized and stylish with practical storage and welcoming decor.",
};

type RoomKey = keyof typeof descriptions;
const isRoomKey = (key: string): key is RoomKey => key in descriptions;

function Page() {
  const params = useParams();
  const room = params.room as string;
  const [roomCategories, setRoomCategories] = useState<RoomCategory[]>([]);

  const normalized = norm(room);
  const description = isRoomKey(normalized) ? descriptions[normalized] : "Explore beautifully designed pieces for every room in your home.";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await callAPI<RoomCategory[]>(`${process.env.NEXT_PUBLIC_API_URL}/data/rooms/${room}`);
        setRoomCategories(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    if (room) {
      fetchCategories();
    }
  }, [room]);

  return (
    <div id="room">
      <div className={styles.heading}>{cap(room)}</div>
      <div className={styles.description}>{description}</div>
      <div className={styles.list}>
        {roomCategories?.map((item, i) => (
          <div className={styles.item} key={i}>
            <Link href={`/rooms/${normalized}/${url(item.name)}`}>
              <div className={styles.imgWrapper}>
                <Image src={`/img/roomCategory/${item.id}.webp`} alt={item.name} width={300} height={200} />
              </div>
              <p>{item.name}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;
