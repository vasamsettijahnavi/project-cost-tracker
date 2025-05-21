"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Plus } from "lucide-react"

interface AddOtherCostFormProps {
  onCostAdded: (description: string, amount: number) => Promise<string>
}

export function AddOtherCostForm({ onCostAdded }: AddOtherCostFormProps) {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!description.trim() || !amount.trim() || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid description and amount",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const amountValue = Number.parseFloat(amount)
      await onCostAdded(description, amountValue)

      // Reset form
      setDescription("")
      setAmount("")

      toast({
        title: "Success",
        description: "Cost added successfully",
      })
    } catch (error) {
      console.error("Error adding cost:", error)
      toast({
        title: "Error",
        description: "Failed to add cost",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Other Cost</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cost-description">Description</Label>
              <Input
                id="cost-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter cost description"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost-amount">Amount (₹)</Label>
              <Input
                id="cost-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            {isSubmitting ? "Adding..." : "Add Cost"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
