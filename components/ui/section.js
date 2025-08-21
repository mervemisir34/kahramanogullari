import * as React from "react"
import { cn } from "@/lib/utils"

const Section = React.forwardRef(({ className, variant = "default", ...props }, ref) => (
  <section
    ref={ref}
    className={cn(
      "py-16",
      {
        "bg-background": variant === "default",
        "bg-muted": variant === "muted",
        "bg-primary text-primary-foreground": variant === "primary",
        "bg-secondary text-secondary-foreground": variant === "secondary"
      },
      className
    )}
    {...props}
  />
))
Section.displayName = "Section"

const SectionHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-center mb-12", className)}
    {...props}
  />
))
SectionHeader.displayName = "SectionHeader"

const SectionContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
SectionContent.displayName = "SectionContent"

export { Section, SectionHeader, SectionContent }