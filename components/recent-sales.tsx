import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface RecentSale {
  id: string
  name: string
  email: string
  amount: string
  avatar?: string
  initials: string
}

interface RecentSalesProps {
  orders: any[]
  limit?: number
}

export function RecentSales({ orders, limit = 5 }: RecentSalesProps) {
  // Transform orders into recent sales format
  const recentSales: RecentSale[] = orders
    .slice(0, limit) // Get most recent orders
    .map(order => {
      const user = order.order_user || {}
      const firstName = user.full_name?.split(' ')[0] || 'Customer'
      const lastName = user.full_name?.split(' ')[1] || ''
      const initials = `${firstName[0]}${lastName[0] || ''}`.toUpperCase()

      return {
        id: order.id,
        name: user.full_name || 'Customer',
        email: user.email || 'No email',
        amount: `+$${order.total_amount.toFixed(2)}`,
        avatar: user.avatar_url || undefined,
        initials
      }
    })

  if (recentSales.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-sm text-muted-foreground">No recent sales data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {recentSales.map((sale) => (
        <div key={sale.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={sale.avatar} alt="Avatar" />
            <AvatarFallback>{sale.initials}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.name}</p>
            <p className="text-sm text-muted-foreground">{sale.email}</p>
          </div>
          <div className="ml-auto font-medium">{sale.amount}</div>
        </div>
      ))}
    </div>
  )
}