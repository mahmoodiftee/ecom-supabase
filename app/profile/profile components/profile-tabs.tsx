"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { useSearchParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileInfo from "./profile-info"
import PurchaseHistory from "./purchase-history"
import PaymentMethods from "./payment-methods"
import LovedItems from "./loved-items"

interface ProfileTabsProps {
  profile: any
  user: User
  lovedItems: any[]
  purchaseHistory: any[]
  paymentMethods: any[]
}

export default function ProfileTabs({ profile, user, lovedItems, purchaseHistory, paymentMethods }: ProfileTabsProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tabParam = searchParams.get("tab")

  const [activeTab, setActiveTab] = useState(
    tabParam === "wishlist"
      ? "wishlist"
      : tabParam === "orders"
        ? "orders"
        : tabParam === "payments"
          ? "payments"
          : "profile",
  )

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/profile?tab=${value}`)
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto mb-3">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <ProfileInfo searchParams={searchParams} profile={profile} user={user} />
      </TabsContent>

      <TabsContent value="wishlist">
        <LovedItems items={lovedItems} userId={user.id} />
      </TabsContent>

      <TabsContent value="orders">
        <PurchaseHistory orders={purchaseHistory} />
      </TabsContent>

      <TabsContent value="payments">
        <PaymentMethods paymentMethods={paymentMethods} />
      </TabsContent>
    </Tabs>
  )
}
