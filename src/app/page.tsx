"use client";
import styles from "./page.module.css";
import { PeopleListContainer } from "@/views/People/PeopleListContainer";
import Image from "next/image";

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <PeopleListContainer />
        <div className="flex justify-center mt-8">
          <Image
            alt="May the force be with you"
            src="https://i.kym-cdn.com/photos/images/newsfeed/000/747/556/27a.jpg"
            width={200}
            height={200}
          />
        </div>
      </div>
    </main>
  );
}
