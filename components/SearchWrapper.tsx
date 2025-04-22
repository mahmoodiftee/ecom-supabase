"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Search } from "./search";
import { Products } from "@/types/products";

export default function SearchWrapper() {
  const [keyboards, setKeyboards] = useState<Products[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("keyboards").select("*");
      if (data) setKeyboards(data);
    };
    fetchData();
  }, []);

  return <Search keyboards={keyboards} />;
}
