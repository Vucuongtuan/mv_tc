"use client"

import React from 'react'
import { Button } from "@/components/Commons/Button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const buffer = 1 // Number of pages to show around current page

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)

      if (page > buffer + 2) {
        pages.push('ellipsis-start')
      }

      const start = Math.max(2, page - buffer)
      const end = Math.min(totalPages - 1, page + buffer)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (page < totalPages - buffer - 1) {
        pages.push('ellipsis-end')
      }

      pages.push(totalPages)
    }
    return pages
  }

  const pages = getPageNumbers()

  return (
    <nav 
      className="flex flex-col sm:flex-row justify-center items-center gap-4 py-12 md:py-16" 
      aria-label="Pagination Navigation"
    >
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          aria-label="Previous page"
          className="rounded-full w-9 h-9"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <ul className="flex items-center gap-1.5">
          {pages.map((p, i) => {
            if (typeof p === 'string') {
              return (
                <li key={`ellipsis-${i}`} className="px-1 text-muted-foreground">
                  <MoreHorizontal className="w-4 h-4" />
                </li>
              )
            }

            return (
              <li key={p}>
                <Button
                  variant={p === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onChange(p)}
                  className={`w-9 h-9 p-0 rounded-full font-medium transition-all ${
                    p === page 
                    ? 'shadow-md shadow-primary/20 scale-110' 
                    : 'hover:border-primary/50 hover:text-primary'
                  }`}
                  aria-current={p === page ? "page" : undefined}
                >
                  {p}
                </Button>
              </li>
            )
          })}
        </ul>

        <Button
          variant="outline"
          size="icon"
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
          aria-label="Next page"
          className="rounded-full w-9 h-9"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="text-sm text-muted-foreground font-medium">
        Trang <span className="text-foreground">{page}</span> / {totalPages}
      </div>
    </nav>
  )
}