import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <main className="h-auto min-h-[91vh] flex justify-center items-center">
      <div className="">
        <Image
          src={"/empty.svg"}
          alt="Danh sách không có phim nào"
          height={300}
          width={300}
        />
        <span className="text-2xl"> Danh sách không có phim nào</span>
        <p className="w-full text-center py-2">
          <Link
            href="/"
            className="text-red-600 hover:text-black hover:dark:text-white"
          >
            Về trang chủ
          </Link>
        </p>
      </div>
    </main>
  );
}
