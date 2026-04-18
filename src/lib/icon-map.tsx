import {
  Home,
  Building2,
  Factory,
  Hammer,
  Paintbrush,
  HardHat,
  Ruler,
  Truck,
  Hotel,
  Store,
  Warehouse,
  Landmark,
  Castle,
  CheckCircle,
  Award,
  Users,
  Shield,
  Phone,
  Mail,
  Link2,
  LucideIcon
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  home: Home,
  building2: Building2,
  factory: Factory,
  hammer: Hammer,
  paintbrush: Paintbrush,
  hardhat: HardHat,
  ruler: Ruler,
  truck: Truck,
  hotel: Hotel,
  store: Store,
  warehouse: Warehouse,
  landmark: Landmark,
  castle: Castle,
  checkcircle: CheckCircle,
  award: Award,
  users: Users,
  shield: Shield,
  phone: Phone,
  mail: Mail,
  link2: Link2,
}

export function getIcon(iconName: string): LucideIcon {
  const normalizedName = iconName.toLowerCase().replace(/[^a-z]/g, "")
  return iconMap[normalizedName] || Building2
}
