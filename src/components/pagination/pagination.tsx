"use client";
import { getMovieByOption } from "@/api/movie.api";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function PaginationLoc({ params }: { params: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [visiblePages, setVisiblePages] = useState<number[]>([]);

  useEffect(() => {
    const get = async () => {
      const res = await getMovieByOption(
        params,
        searchParams.get("category") || "",
        searchParams.get("country") || "",
        searchParams.get("year") || "",
        ""
      );
      const lengthData = res.data.items.length;
      setTotalPages(lengthData);
      setVisiblePages(
        Array.from({ length: Math.min(5, lengthData) }, (_, index) => index + 1)
      );
    };
    get();
  }, []);
  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    setCurrentPage(page);

    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);
    setVisiblePages(
      Array.from(
        { length: endPage - startPage + 1 },
        (_, index) => startPage + index
      )
    );
  }, [searchParams, totalPages]);

  const handleClickPage = (page: number) => {
    router.push(
      `${pathName}?sort_field=modified.time&category=${
        searchParams.get("category") || ""
      }&country=${searchParams.get("country") || ""}&year=${
        searchParams.get("year") || ""
      }&page=${page || 1}`
    );
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => handleClickPage(currentPage - 1)}
          />
        </PaginationItem>
        {visiblePages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={`${pathName}?sort_field=modified.time&category=${
                searchParams.get("category") || ""
              }&country=${searchParams.get("country") || ""}&year=${
                searchParams.get("year") || ""
              }&page=${page || 1}`}
              className={page === currentPage ? "bg-red-500" : ""}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {totalPages > visiblePages.length && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => handleClickPage(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
