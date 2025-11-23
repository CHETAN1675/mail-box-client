import { useEffect, useState, useRef } from "react";
import { DB_URL } from "../firebaseDB";


export default function useFetchMails(box, email) {
  const [mails, setMails] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const prevIdsRef = useRef(""); 

  const key = email ? email.replace(/\./g, "_") : null;

  useEffect(() => {
    if (!key) return;
    let cancelled = false;

    async function loadMails() {
      try {
        const res = await fetch(`${DB_URL}/mails/${box}/${key}.json`);
        const data = await res.json();
        if (!data) {
          if (!cancelled) {
            setMails([]);
            setUnreadCount(0);
          }
          return;
        }

        const arr = Object.entries(data).map(([id, mail]) => ({
          id,
          ...mail,
        }));

        
        arr.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        if (!cancelled) {
          const newIds = arr.map((m) => m.id).join(",");
          if (newIds !== prevIdsRef.current) {
            setMails(arr);
            prevIdsRef.current = newIds;
          }

          if (box === "inbox") {
            const newUnread = arr.filter((m) => m.read !== true).length;
            if (newUnread !== unreadCount) setUnreadCount(newUnread);
          }
        }
      } catch (err) {
        console.error(`Error loading ${box}:`, err);
      }
    }

    loadMails();
    const interval = setInterval(loadMails, 2000); 

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [box, key, unreadCount]);

  return { mails, unreadCount };
}
