"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useParams, useRouter, useSearchParams } from "next/navigation";
const formSchema = z.object({
  type: z.string().optional(),
  category: z.string().optional(),
  country: z.string().optional(),
  year: z.string().optional(),
});

interface IFormLocProps {
  _id: string;
  name: string;
  slug: string;
}
const type: { name: string; value: string }[] = [
  {
    name: "phim-moi",
    value: "Phim mới",
  },
  { name: "phim-bo", value: "Phim bộ" },
  { name: "phim-le", value: "Phim lẻ" },
  { name: "hoat-hinh", value: "Phim hoạt hình" },
  { name: "tv-shows", value: "Tv Shows" },
  { name: "phim-bo-dang-chieu", value: "Phim đang chiếu" },
  { name: "phim-bo-hoan-thanh", value: "Phim bộ đẫ hoàn thành" },
  { name: "phim-sap-chieu", value: "Phim sắp chiếu" },
];
function getYears() {
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let i = currentYear + 2; i >= 2010; i--) {
    years.push(i.toString());
  }

  return years;
}

export default function FormLoc({
  category,
  country,
  params,
}: {
  category: IFormLocProps[];
  country: IFormLocProps[];
  params: string;
}) {
  const routers = useRouter();
  const year = getYears();
  const searchParams = useSearchParams();
  
  // Initialize form with current URL parameters
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: params || "phim-moi",
      category: searchParams.get("category") || "",
      country: searchParams.get("country") || "",
      year: searchParams.get("year") || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    routers.push(
      `/loc-phim/${
        values.type ?? "phim-moi"
      }?sort_field=modified.time&category=${values.category ?? ""}&country=${
        values.country ?? ""
      }&year=${values.year ?? ""}&page=1`
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" relative h-auto min-h-[80px] max-h-[270px]  mb-2 border-2  rounded-md p-2"
      >
        <div className="flex flex-wrap">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="mr-1">
                <FormLabel>Loại phim : </FormLabel>
                <select
                  id=""
                  className=" outline-none py-2 px-4 max-width-[100px] rounded-md"
                  {...field}
                >
                  {" "}
                  <option value={""}>---Chọn---</option>
                  {type.map((type) => (
                    <option value={type.name} key={type.name}>
                      {type.value}
                    </option>
                  ))}
                </select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="mr-1">
                <FormLabel>Thể loại phim : </FormLabel>
                <select
                  id=""
                  className=" outline-none py-2 px-4 max-width-[100px] rounded-md"
                  {...field}
                >
                  {" "}
                  <option value={""}>---Chọn---</option>
                  {category.map((category) => (
                    <option value={category.slug} key={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="mr-1">
                <FormLabel>Quốc gia : </FormLabel>
                <select
                  id=""
                  className=" outline-none py-2 px-4 max-width-[100px] rounded-md"
                  {...field}
                >
                  {" "}
                  <option value={""}>---Chọn---</option>
                  {country.map((country) => (
                    <option value={country.slug} key={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem className="mr-1">
                <FormLabel>Năm phát hành : </FormLabel>
                <select
                  id=""
                  className=" outline-none py-2 px-4 max-width-[100px] rounded-md"
                  {...field}
                >
                  <option value={""}>---Chọn---</option>
                  {year.map((year: string) => (
                    <option value={year} key={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </FormItem>
            )}
          />
        </div>
        <Button className="px-2 absolute bottom-1 right-1">Lọc phim</Button>
      </form>
    </Form>
  );
}
