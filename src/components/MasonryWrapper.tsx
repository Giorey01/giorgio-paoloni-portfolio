"use client";

import React from "react";
import Masonry from "react-masonry-css";

interface MasonryWrapperProps {
  children: React.ReactNode;
  breakpointCols?: any;
  className?: string;
  columnClassName?: string;
}

export default function MasonryWrapper({
  children,
  breakpointCols,
  className = "",
  columnClassName = "",
}: MasonryWrapperProps) {
  return (
    <Masonry
      breakpointCols={breakpointCols}
      className={className}
      columnClassName={columnClassName}
    >
      {children}
    </Masonry>
  );
}
