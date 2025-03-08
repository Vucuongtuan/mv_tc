import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <main className="flex flex-col justify-center items-center">
      <Image
        src={"/not-found.svg"}
        alt="Trang không tồn tại"
        width={400}
        height={400}
        className=""
      />
      <h2 className="py-2 text-xl">Trang không tồn tại</h2>
      <Link href="/" className="hover:text-red-600">
        <u>Về trang chủ</u>
      </Link>
    </main>
  );
}
