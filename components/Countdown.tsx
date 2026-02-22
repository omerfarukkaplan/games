"use client";
import { useEffect, useState } from "react";

export default function Countdown({ end }: { end: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const diff =
        new Date(end).getTime() - new Date().getTime();

      if (diff <= 0) {
        setTime("Ended");
        return;
      }

      const hours = Math.floor(diff / 1000 / 60 / 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [end]);

  return <div>{time}</div>;
}