"use client";
import React, { useState, useEffect, useRef } from "react";

export default function StatCounter({ target, suffix = "+" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let observer;
    let frameId;

    if (ref.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const start = 0;
              const end = parseInt(target);
              const duration = 2000;
              let startTime = null;

              const animate = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                setCount(Math.floor(progress * (end - start) + start));
                if (progress < 1) {
                  frameId = requestAnimationFrame(animate);
                } else {
                  setCount(end);
                }
              };

              frameId = requestAnimationFrame(animate);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(ref.current);
    }

    return () => {
      if (observer) observer.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}
