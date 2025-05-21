import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import { Input } from "@/components/ui/input"
  import { Button } from "@/components/ui/button"
  import { Label } from "@/components/ui/label"
  import { useState } from "react"
  
  type Frequency = "daily" | "weekly" | "workdays"
  type ItemType = "recurring" | "one-time"
  
  type ExpenseItem = {
    id: number
    name: string
    cost: number
    type: ItemType
    frequency?: Frequency
    durationWeeks?: number
  }
  
  const getFrequencyMultiplier = (frequency: Frequency): number => {
    switch (frequency) {
      case "daily":
        return 7
      case "workdays":
        return 5
      case "weekly":
        return 1
      default:
        return 0
    }
  }
  
  export default function BudgetApp() {
    const [budgetWeeks, setBudgetWeeks] = useState("4")
    const [totalBudget, setTotalBudget] = useState("100000")
  
    const [itemName, setItemName] = useState("")
    const [itemCost, setItemCost] = useState("")
    const [itemType, setItemType] = useState<ItemType | "">("")
    const [frequency, setFrequency] = useState<Frequency | "">("")
    const [durationWeeks, setDurationWeeks] = useState("")
  
    const [items, setItems] = useState<ExpenseItem[]>([])
    const [editId, setEditId] = useState<number | null>(null)
  
    const handleAddItem = () => {
      if (!itemName || !itemCost || !itemType) return
  
      const newItem: ExpenseItem = {
        id: editId ?? Date.now(),
        name: itemName,
        cost: Number(itemCost),
        type: itemType,
        frequency: itemType === "recurring" ? (frequency || undefined) as Frequency : undefined,
        durationWeeks:
          itemType === "recurring"
            ? Number(durationWeeks || budgetWeeks)
            : undefined,
      }
  
      if (editId) {
        // ✨ Update item
        setItems((prev) =>
          prev.map((item) => (item.id === editId ? newItem : item))
        )
      } else {
        // ✨ Add new item
        setItems([...items, newItem])
      }
  
      // Reset form
      setItemName("")
      setItemCost("")
      setItemType("")
      setFrequency("")
      setDurationWeeks("")
      setEditId(null)
    }
  
    const handleDelete = (id: number) => {
      setItems((prev) => prev.filter((item) => item.id !== id))
    }
  
    const handleEdit = (item: ExpenseItem) => {
      setItemName(item.name)
      setItemCost(item.cost.toString())
      setItemType(item.type)
      setFrequency(item.frequency || "")
      setDurationWeeks(item.durationWeeks?.toString() || "")
      setEditId(item.id)
    }
  
    const totalExpenses = items.reduce((sum, item) => {
      if (item.type === "recurring" && item.frequency && item.durationWeeks) {
        const multiplier = getFrequencyMultiplier(item.frequency)
        return sum + item.cost * multiplier * item.durationWeeks
      } else {
        return sum + item.cost
      }
    }, 0)
  
    const remaining = Number(totalBudget) - totalExpenses
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-800">🧾 Simple Budget Planner</h1>
          <p className="text-slate-500 text-sm mt-2">Plan your spending clearly & simply</p>
        </header>
  
        <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            {/* Budget Settings */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold text-slate-700 mb-6">1. Budget Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Budget Period (in weeks)</Label>
                  <Input
                    type="number"
                    value={budgetWeeks}
                    onChange={(e) => setBudgetWeeks(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Total Budget (K)</Label>
                  <Input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value)}
                  />
                </div>
              </div>
            </section>
  
            {/* Add Item */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-6">
                {editId ? "✏️ Edit Expense Item" : "2. Add Expense Item"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <Label>Item Name</Label>
                  <Input
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Cost (K)</Label>
                  <Input
                    type="number"
                    value={itemCost}
                    onChange={(e) => setItemCost(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={itemType} onValueChange={setItemType}>
                    <SelectTrigger className="bg-white border shadow-sm"> {/* ✨ Fix: visible dropdown */}
                      <SelectValue placeholder="Recurring or One-time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recurring">Recurring</SelectItem>
                      <SelectItem value="one-time">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
  
              {/* Recurring inputs (conditional display) */}
              {itemType === "recurring" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Frequency</Label>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger className="bg-white border shadow-sm">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="workdays">Workdays</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Duration (in weeks)</Label>
                    <Input
                      type="number"
                      value={durationWeeks}
                      onChange={(e) => setDurationWeeks(e.target.value)}
                    />
                  </div>
                </div>
              )}
  
              <div className="mt-6 flex gap-4">
                <Button onClick={handleAddItem}>
                  {editId ? "✅ Update Item" : "➕ Add Item"}
                </Button>
                {editId && (
                  <Button variant="secondary" onClick={() => {
                    setItemName("")
                    setItemCost("")
                    setItemType("")
                    setFrequency("")
                    setDurationWeeks("")
                    setEditId(null)
                  }}>
                    Cancel
                  </Button>
                )}
              </div>
            </section>
          </div>
  
          {/* RIGHT COLUMN */}
          <div className="space-y-8">
            {/* Planned Items */}
            <section className="bg-white p-6 rounded-lg shadow h-[400px] overflow-y-auto"> {/* ✨ Fix: Scrollable */}
              <h2 className="text-2xl font-semibold mb-4">3. Planned Items</h2>
              {items.length === 0 ? (
                <p className="text-slate-400">No items yet.</p>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => {
                    const totalCost =
                      item.type === "recurring" && item.frequency && item.durationWeeks
                        ? item.cost * getFrequencyMultiplier(item.frequency) * item.durationWeeks
                        : item.cost
  
                    return (
                      <li key={item.id} className="border p-4 rounded bg-slate-50">
                        <div className="flex justify-between font-medium">
                          <span>{item.name}</span>
                          <span className="text-slate-700 font-bold">K{totalCost.toLocaleString()}</span>
                        </div>
                        <div className="text-sm text-slate-500 mt-1">
                          {item.type === "recurring" && item.frequency && item.durationWeeks ? (
                            <span>
                              Recurring: K{item.cost} × {getFrequencyMultiplier(item.frequency)} × {item.durationWeeks} weeks
                            </span>
                          ) : (
                            "One-time expense"
                          )}
                        </div>
                        <div className="mt-2 flex gap-2 text-sm">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                          <Button variant="destructive" size="sm" className="bg-red-600" onClick={() => handleDelete(item.id)}>Delete</Button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>
  
            {/* Summary */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-4">4. Summary</h2>
              <div className="text-lg text-slate-700">
                <p>Total Planned Expenses: <span className="font-bold">K{totalExpenses.toLocaleString()}</span></p>
                <p className="mt-2">Remaining Budget: <span className={`font-bold ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>K{remaining.toLocaleString()}</span></p>
              </div>
            </section>
          </div>
        </main>
      </div>
    )
  }
  