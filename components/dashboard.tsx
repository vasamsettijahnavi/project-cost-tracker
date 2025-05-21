"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useItems, useOtherCosts } from "@/lib/mock-storage"
import { useAuthContext } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ItemsList } from "@/components/items-list"
import { OtherCostsList } from "@/components/other-costs-list"
import { AddItemForm } from "@/components/add-item-form"
import { AddOtherCostForm } from "@/components/add-other-cost-form"
import { LogOut } from "lucide-react"

export default function Dashboard() {
  const { user, logout } = useAuthContext()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("items")

  const { items, loading: itemsLoading, addItem, updateItem, deleteItem } = useItems(user?.id || "anonymous")
  const {
    costs: otherCosts,
    loading: costsLoading,
    addOtherCost,
    updateOtherCost,
    deleteOtherCost,
  } = useOtherCosts(user?.id || "anonymous")

  const totalItemsCost = items.reduce((sum, item) => sum + item.cost, 0)
  const totalOtherCosts = otherCosts.reduce((sum, cost) => sum + cost.amount, 0)
  const totalProjectCost = totalItemsCost + totalOtherCosts

  const handleSignOut = () => {
    logout()
    router.push("/login")
  }

  // Handle item deletion with useCallback to prevent unnecessary re-renders
  const handleDeleteItem = useCallback(
    async (itemId: string) => {
      console.log("Dashboard: Deleting item with ID:", itemId)
      await deleteItem(itemId)
    },
    [deleteItem],
  )

  // Handle other cost deletion with useCallback
  const handleDeleteOtherCost = useCallback(
    async (costId: string) => {
      console.log("Dashboard: Deleting cost with ID:", costId)
      await deleteOtherCost(costId)
    },
    [deleteOtherCost],
  )

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Cost Tracker</h1>
          <p className="text-muted-foreground">Welcome, {user.name || user.email}</p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalItemsCost.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Other Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalOtherCosts.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Project Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalProjectCost.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="otherCosts">Other Costs</TabsTrigger>
        </TabsList>
        <TabsContent value="items" className="space-y-4">
          <AddItemForm onItemAdded={addItem} />
          <ItemsList
            items={items}
            onItemUpdated={updateItem}
            onItemDeleted={handleDeleteItem}
            isLoading={itemsLoading}
          />
        </TabsContent>
        <TabsContent value="otherCosts" className="space-y-4">
          <AddOtherCostForm onCostAdded={addOtherCost} />
          <OtherCostsList
            costs={otherCosts}
            onCostUpdated={updateOtherCost}
            onCostDeleted={handleDeleteOtherCost}
            isLoading={costsLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
