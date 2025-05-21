"use client"

import { useState, useEffect } from "react"
import type { Item, OtherCost } from "./types"

// Local storage keys
const ITEMS_STORAGE_KEY = "project-cost-tracker-items"
const OTHER_COSTS_STORAGE_KEY = "project-cost-tracker-other-costs"

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15)

// Hook for items
export function useItems(userId: string) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  // Load items from localStorage on mount
  useEffect(() => {
    const storedItems = localStorage.getItem(`${ITEMS_STORAGE_KEY}-${userId}`)
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems)
        // Convert string dates back to Date objects
        const itemsWithDates = parsedItems.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }))
        setItems(itemsWithDates)
      } catch (error) {
        console.error("Error parsing stored items:", error)
      }
    }
    setLoading(false)
  }, [userId])

  // Save items to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(`${ITEMS_STORAGE_KEY}-${userId}`, JSON.stringify(items))
    }
  }, [items, loading, userId])

  // Add an item
  const addItem = async (name: string, cost: number): Promise<string> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const newItem: Item = {
      id: generateId(),
      name,
      cost,
      createdAt: new Date(),
    }

    setItems((prevItems) => [newItem, ...prevItems])
    return newItem.id
  }

  // Update an item
  const updateItem = async (itemId: string, name: string, cost: number): Promise<void> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    setItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, name, cost, updatedAt: new Date() } : item)),
    )
  }

  // Delete an item
  const deleteItem = async (itemId: string): Promise<void> => {
    console.log("Mock Storage: Deleting item with ID:", itemId)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Filter out the item with the matching ID
    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== itemId)
      console.log("Previous items count:", prevItems.length)
      console.log("New items count:", newItems.length)
      return newItems
    })
  }

  return { items, loading, addItem, updateItem, deleteItem }
}

// Hook for other costs
export function useOtherCosts(userId: string) {
  const [costs, setCosts] = useState<OtherCost[]>([])
  const [loading, setLoading] = useState(true)

  // Load costs from localStorage on mount
  useEffect(() => {
    const storedCosts = localStorage.getItem(`${OTHER_COSTS_STORAGE_KEY}-${userId}`)
    if (storedCosts) {
      try {
        const parsedCosts = JSON.parse(storedCosts)
        // Convert string dates back to Date objects
        const costsWithDates = parsedCosts.map((cost: any) => ({
          ...cost,
          createdAt: new Date(cost.createdAt),
        }))
        setCosts(costsWithDates)
      } catch (error) {
        console.error("Error parsing stored costs:", error)
      }
    }
    setLoading(false)
  }, [userId])

  // Save costs to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(`${OTHER_COSTS_STORAGE_KEY}-${userId}`, JSON.stringify(costs))
    }
  }, [costs, loading, userId])

  // Add a cost
  const addOtherCost = async (description: string, amount: number): Promise<string> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const newCost: OtherCost = {
      id: generateId(),
      description,
      amount,
      createdAt: new Date(),
    }

    setCosts((prevCosts) => [newCost, ...prevCosts])
    return newCost.id
  }

  // Update a cost
  const updateOtherCost = async (costId: string, description: string, amount: number): Promise<void> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    setCosts((prevCosts) =>
      prevCosts.map((cost) => (cost.id === costId ? { ...cost, description, amount, updatedAt: new Date() } : cost)),
    )
  }

  // Delete a cost
  const deleteOtherCost = async (costId: string): Promise<void> => {
    console.log("Mock Storage: Deleting cost with ID:", costId)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Filter out the cost with the matching ID
    setCosts((prevCosts) => {
      const newCosts = prevCosts.filter((cost) => cost.id !== costId)
      console.log("Previous costs count:", prevCosts.length)
      console.log("New costs count:", newCosts.length)
      return newCosts
    })
  }

  return { costs, loading, addOtherCost, updateOtherCost, deleteOtherCost }
}
