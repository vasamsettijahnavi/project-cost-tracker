"use client"

import { useState } from "react"
import type { Item } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"

interface ItemsListProps {
  items: Item[]
  onItemUpdated: (itemId: string, name: string, cost: number) => Promise<void>
  onItemDeleted: (itemId: string) => Promise<void>
  isLoading: boolean
}

export function ItemsList({ items, onItemUpdated, onItemDeleted, isLoading }: ItemsListProps) {
  const [editItem, setEditItem] = useState<Item | null>(null)
  const [editName, setEditName] = useState("")
  const [editCost, setEditCost] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleEditClick = (item: Item) => {
    setEditItem(item)
    setEditName(item.name)
    setEditCost(item.cost.toString())
    setIsDialogOpen(true)
  }

  const handleUpdateItem = async () => {
    if (!editItem) return

    if (!editName.trim() || !editCost.trim() || Number.parseFloat(editCost) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid name and cost",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const costValue = Number.parseFloat(editCost)
      await onItemUpdated(editItem.id, editName, costValue)
      setIsDialogOpen(false)

      toast({
        title: "Success",
        description: "Item updated successfully",
      })
    } catch (error) {
      console.error("Error updating item:", error)
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Direct delete function without confirmation
  const handleDelete = async (itemId: string) => {
    try {
      console.log("Deleting item with ID:", itemId)
      await onItemDeleted(itemId)

      toast({
        title: "Success",
        description: "Item deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting item:", error)
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Items List</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">Loading items...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No items added yet. Add your first item above.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Cost (₹)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">{item.cost.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditClick(item)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
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
              <DialogTitle>Edit Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Item Name</Label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter item name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cost">Cost (₹)</Label>
                <Input
                  id="edit-cost"
                  type="number"
                  value={editCost}
                  onChange={(e) => setEditCost(e.target.value)}
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
              <Button onClick={handleUpdateItem} disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
