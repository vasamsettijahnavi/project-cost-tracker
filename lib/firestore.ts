import { db } from "./firebase"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore"
import type { Item, OtherCost } from "./types"

// Items CRUD operations
export async function getItems(userId: string): Promise<Item[]> {
  const itemsRef = collection(db, "users", userId, "items")
  const q = query(itemsRef, orderBy("createdAt", "desc"))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      name: data.name,
      cost: data.cost,
      createdAt: (data.createdAt as Timestamp).toDate(),
    }
  })
}

export async function addItem(userId: string, name: string, cost: number): Promise<string> {
  const itemsRef = collection(db, "users", userId, "items")
  const docRef = await addDoc(itemsRef, {
    name,
    cost,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export async function updateItem(userId: string, itemId: string, name: string, cost: number): Promise<void> {
  const itemRef = doc(db, "users", userId, "items", itemId)
  await updateDoc(itemRef, {
    name,
    cost,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteItem(userId: string, itemId: string): Promise<void> {
  const itemRef = doc(db, "users", userId, "items", itemId)
  await deleteDoc(itemRef)
}

// Other Costs CRUD operations
export async function getOtherCosts(userId: string): Promise<OtherCost[]> {
  const costsRef = collection(db, "users", userId, "otherCosts")
  const q = query(costsRef, orderBy("createdAt", "desc"))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      description: data.description,
      amount: data.amount,
      createdAt: (data.createdAt as Timestamp).toDate(),
    }
  })
}

export async function addOtherCost(userId: string, description: string, amount: number): Promise<string> {
  const costsRef = collection(db, "users", userId, "otherCosts")
  const docRef = await addDoc(costsRef, {
    description,
    amount,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export async function updateOtherCost(
  userId: string,
  costId: string,
  description: string,
  amount: number,
): Promise<void> {
  const costRef = doc(db, "users", userId, "otherCosts", costId)
  await updateDoc(costRef, {
    description,
    amount,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteOtherCost(userId: string, costId: string): Promise<void> {
  const costRef = doc(db, "users", userId, "otherCosts", costId)
  await deleteDoc(costRef)
}
