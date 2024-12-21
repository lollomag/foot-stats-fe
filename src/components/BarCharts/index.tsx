"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { month: "Gennaio", desktop: 186 },
  { month: "Febbaraio", desktop: 200 },
  { month: "Marzo", desktop: 180 },
  { month: "Aprilw", desktop: 73 },
  { month: "Maggio", desktop: 177 },
  { month: "Giugno", desktop: 145 },
  { month: "Luglio", desktop: 30 },
  { month: "Agosto", desktop: 99 },
  { month: "Settembre", desktop: 134 },
  { month: "Ottobre", desktop: 111 },
  { month: "Novembre", desktop: 80 },
  { month: "Dicembre", desktop: 40 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#166534",
  },
} satisfies ChartConfig

export function BarCharts() {
  return (
    <>
      <Card className="w-100">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Gennaio - Dicembre 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total visitors for the last year
          </div>
        </CardFooter>
      </Card>
    </>
  )
}
