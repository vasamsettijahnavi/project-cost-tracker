"use client"

import { useState } from "react"
import type { OtherCost } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"

interface OtherCostsListProps {
  costs: OtherCost[]
  onCostUpdated: (costId: string, description: string, amount: number) => Promise<void>
  onCostDeleted: (costId: string) => Promise<void>
  isLoading: boolean
}

export function OtherCostsList({ costs, onCostUpdated, onCostDeleted, isLoading }: OtherCostsListProps) {
  const [editCost, setEditCost] = useState<OtherCost | null>(null)
  const [editDescription, setEditDescription] = useState("")
  const [editAmount, setEditAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleEditClick = (cost: OtherCost) => {
    setEditCost(cost)
    setEditDescription(cost.description)
    setEditAmount(cost.amount.toString())
    setIsDialogOpen(true)
  }

  const handleUpdateCost = async () => {
    if (!editCost) return

    if (!editDescription.trim() || !editAmount.trim() || Number.parseFloat(editAmount) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid description and amount",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const amountValue = Number.parseFloat(editAmount)
      await onCostUpdated(editCost.id, editDescription, amountValue)
      setIsDialogOpen(false)

      toast({
        title: "Success",
        description: "Cost updated successfully",
      })
    } catch (error) {
      console.error("Error updating cost:", error)
      toast({
        title: "Error",
        description: "Failed to update cost",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Direct delete function without confirmation
  const handleDelete = async (costId: string) => {
    try {
      console.log("Deleting cost with ID:", costId)
      await onCostDeleted(costId)

      toast({
        title: "Success",
        description: "Cost deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting cost:", error)
      toast({
        title: "Error",
        description: "Failed to delete cost",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Other Costs List</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">Loading costs...</div>
        ) : costs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No other costs added yet. Add your first cost above.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount (₹)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costs.map((cost) => (
                <TableRow key={cost.id}>
                  <TableCell>{cost.description}</TableCell>
                  <TableCell className="text-right">{cost.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditClick(cost)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(cost.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Other Cost</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Enter cost description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-amount">Amount (₹)</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateCost} disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
