import React from "react";

interface EmptyLayoutProps {
  comment?: string;
  color?: string;
}

export default function EmptyLayout({ comment, color }: EmptyLayoutProps) {
  return (
    <div
      className={`fixed top-0 flex items-center justify-center w-full min-h-screen z-0 ${
        color ? `bg-${color}` : null
      }`}
    >
      <p>{comment ? comment : "조회된 내역이 없습니다."}</p>
    </div>
  );
}
