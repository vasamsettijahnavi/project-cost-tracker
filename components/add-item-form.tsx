"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Plus } from "lucide-react"

interface AddItemFormProps {
  onItemAdded: (name: string, cost: number) => Promise<string>
}

export function AddItemForm({ onItemAdded }: AddItemFormProps) {
  const [name, setName] = useState("")
  const [cost, setCost] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !cost.trim() || Number.parseFloat(cost) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid name and cost",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const costValue = Number.parseFloat(cost)
      await onItemAdded(name, costValue)

      // Reset form
      setName("")
      setCost("")

      toast({
        title: "Success",
        description: "Item added successfully",
      })
    } catch (error) {
      console.error("Error adding item:", error)
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="item-name">Item Name</Label>
              <Input
                id="item-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter item name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-cost">Cost (₹)</Label>
              <Input
                id="item-cost"
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            {isSubmitting ? "Adding..." : "Add Item"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
