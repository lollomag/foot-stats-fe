"use client"
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { useState } from "react";

export default function PlayerStatsFilter() {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState("all");

  const availableYears = [
    {
      value: "all",
      label: "Generale"
    },
    {
      value: "2025",
      label: "2025"
    },
    {
      value: "2024",
      label: "2024"
    },
    {
      value: "2023",
      label: "2023"
    },
    {
      value: "2022",
      label: "2022"
    }
  ];

  const handleYearChange = (value: string) => {
    router.push(`?year=${value}`);
    setSelectedYear(value);
  };

  const getSelected = () => {
    const selecteValue = availableYears.find((item: {value: string, label: string}) => item.value === selectedYear)    
    return selecteValue?.label
  }

  return (
    <div className="my-4">
      <label className="block text-lg font-medium mb-2">Seleziona Anno:</label>
      <Select onValueChange={handleYearChange} value={selectedYear}>
        <SelectTrigger className="w-[200px]">
          {getSelected()}
        </SelectTrigger>
        <SelectContent>
          {availableYears.map((options) => (
            <SelectItem key={options.value} value={options.value.toString()}>
              {options.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}