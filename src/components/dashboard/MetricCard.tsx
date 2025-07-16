import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  description?: string
  icon: LucideIcon
  trend?: {
    value: string
    isPositive: boolean
  }
  variant?: "default" | "warm" | "fresh" | "spice"
  className?: string
  style?: React.CSSProperties
}

const variantStyles = {
  default: "border-border",
  warm: "border-primary/20 bg-gradient-to-br from-primary-muted to-background",
  fresh: "border-secondary/20 bg-gradient-to-br from-secondary-muted to-background", 
  spice: "border-accent/20 bg-gradient-to-br from-accent-muted to-background"
}

const iconStyles = {
  default: "text-muted-foreground",
  warm: "text-primary",
  fresh: "text-secondary",
  spice: "text-accent"
}

export function MetricCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  variant = "default",
  className,
  style
}: MetricCardProps) {
  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-subtle hover:-translate-y-1",
        variantStyles[variant],
        className
      )}
      style={style}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={cn("h-4 w-4", iconStyles[variant])} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="flex items-center justify-between mt-1">
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
          {trend && (
            <span className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}