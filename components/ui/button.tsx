import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type ButtonVariant = "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"
type ButtonSize = "default" | "xs" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantStyles: Record<ButtonVariant, string> = {
  default:
    "border-primary/20 bg-primary text-primary-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:bg-primary/85 hover:shadow-[0_1px_0_0_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.1)]",
  outline:
    "border-border-subtle bg-transparent text-foreground hover:bg-surface-elevated hover:border-accent/25",
  secondary:
    "border-border bg-surface text-foreground hover:bg-surface-elevated hover:border-border-strong",
  ghost:
    "border-transparent bg-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground",
  destructive:
    "border-destructive/20 bg-destructive text-destructive-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:bg-destructive/85",
  link:
    "border-transparent bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto active:scale-100",
}

const sizeStyles: Record<ButtonSize, string> = {
  default: "h-10 gap-1.5 px-4",
  xs: "h-7 gap-1 rounded-md px-2 text-xs",
  sm: "h-8 gap-1.5 rounded-lg px-3 text-sm",
  lg: "h-11 gap-2 px-5 text-sm",
  icon: "size-10",
  "icon-sm": "size-8 rounded-lg",
  "icon-lg": "size-11",
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-lg border text-sm font-medium whitespace-nowrap outline-none select-none transition-[background,color,border-color,transform] duration-150 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-150 [&_svg]:group-hover:translate-x-0.5 [&_svg:not([class*='size-'])]:size-4",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize }
