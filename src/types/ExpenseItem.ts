export type ExpenseItem = {
    id: number
    name: string
    cost: number
    type: ItemType
    frequency?: Frequency
    durationWeeks?: number
    category: Category
}
export type Frequency = "daily" | "weekly" | "workdays"
export type ItemType = "recurring" | "one-time"
export type Category = "food" | "rent" | "transportation" | "entertainment" | "other"
