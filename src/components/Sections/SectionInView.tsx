"use client";

import React, { useState, useEffect } from "react";
import { useIntersectionObserver } from "@uidotdev/usehooks";

interface SectionInViewProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

const SectionInView: React.FC<SectionInViewProps> = ({ children, fallback }) => {
  const [hasBeenInView, setHasBeenInView] = useState(false);
  
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "300px", 
  });

  useEffect(() => {
    if (entry?.isIntersecting && !hasBeenInView) {
      setHasBeenInView(true);
    }
  }, [entry?.isIntersecting, hasBeenInView]);

  return (
    <div ref={ref} className="min-h-[200px]">
      {hasBeenInView ? children : fallback}
    </div>
  );
};

export default SectionInView;
