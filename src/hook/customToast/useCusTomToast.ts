"use client";
import { useToast } from "@/components/ui/use-toast";

export default function useCusTomToast({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const { toast } = useToast();
  return toast({
    title: title,
    description: description,
  });
}
