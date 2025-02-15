"use client"
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { useState } from "react";

export default function PlayerStatsFilter({id}: {id: string}) {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState("Generale");

  const availableYears = ["Generale", "2025", "2024", "2023", "2022", ]; 
  const handleYearChange = (value: string) => {
    router.push(`?year=${value}`);
    setSelectedYear(value);
  };

  return (
    <div className="my-4">
        <label className="block text-lg font-medium mb-2">Seleziona Anno:</label>
        <Select onValueChange={handleYearChange} value={selectedYear}>
          <SelectTrigger className="w-[200px]">
            {selectedYear}
          </SelectTrigger>
          <SelectContent>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
  )
}