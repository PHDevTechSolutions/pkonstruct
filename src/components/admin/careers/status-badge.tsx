"use client"

import { Badge } from "@/components/ui/badge"
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS, type ApplicationStatus } from "@/types/careers"

interface StatusBadgeProps {
  status: ApplicationStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge 
      className={`${APPLICATION_STATUS_COLORS[status]} ${className}`}
    >
      {APPLICATION_STATUS_LABELS[status]}
    </Badge>
  )
}
