import * as React from "react"
import { cn } from "@/lib/utils"

const Grid = React.forwardRef(({ className, cols = 1, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "grid gap-4",
      {
        "grid-cols-1": cols === 1,
        "grid-cols-2": cols === 2,
        "grid-cols-3": cols === 3,
        "grid-cols-4": cols === 4,
        "grid-cols-1 md:grid-cols-2": cols === "1-2",
        "grid-cols-1 md:grid-cols-3": cols === "1-3",
        "grid-cols-1 md:grid-cols-4": cols === "1-4",
        "grid-cols-1 md:grid-cols-2 lg:grid-cols-3": cols === "1-2-3",
        "grid-cols-1 md:grid-cols-2 lg:grid-cols-4": cols === "1-2-4"
      },
      className
    )}
    {...props}
  />
))
Grid.displayName = "Grid"

const GridItem = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
GridItem.displayName = "GridItem"

export { Grid, GridItem }