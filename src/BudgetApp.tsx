import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./components/ui/select"
import { Button } from "./components/ui/button"
import { Label } from "./components/ui/label"
import { useState } from "react"
import { Input } from "./components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import html2pdf from "html2pdf.js"
import { useRef } from "react"

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
    const exportRef = useRef(null)

    const handleExportPDF = async () => {
        try {
            console.log("Exporting PDF...");
            if (!exportRef.current) return;
    
            // Create a hidden simplified layout for PDF export
            const printLayout = document.createElement("div");
            printLayout.style.display = "none"; // Changed visibility to display: none
    
            // Create the simplified layout
            const header = document.createElement("h1");
            header.innerText = "Budget Summary";
            printLayout.appendChild(header);
    
            // Add budget details
            const budgetDetails = document.createElement("p");
            budgetDetails.innerHTML = `Total Budget: K${totalBudget} | Period: ${budgetWeeks} weeks`;
            printLayout.appendChild(budgetDetails);
    
            // Add each item in a simple list
            const itemList = document.createElement("ul");
            items.forEach((item) => {
                const listItem = document.createElement("li");
                const totalCost =
                    item.type === "recurring" && item.frequency && item.durationWeeks
                        ? item.cost * getFrequencyMultiplier(item.frequency) * item.durationWeeks
                        : item.cost;
                listItem.innerHTML = `${item.name} - K${totalCost.toLocaleString()}`;
                itemList.appendChild(listItem);
            });
            printLayout.appendChild(itemList);
    
            // Add summary (total expenses and remaining budget)
            const summary = document.createElement("p");
            summary.innerHTML = `Total Expenses: K${totalExpenses.toLocaleString()} | Remaining Budget: K${remaining.toLocaleString()}`;
            printLayout.appendChild(summary);
    
            // Append the hidden layout to the body and then export it
            document.body.appendChild(printLayout);
    
            const opt = {
                margin: 0.5,
                filename: "budget-summary.pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
            };
    
            const worker = html2pdf().set(opt).from(printLayout);
            await worker.toPdf().get("pdf").then((pdf:any) => {
                pdf.save();
            });
    
            // Clean up by removing the hidden layout from the DOM
            document.body.removeChild(printLayout);
        } catch (error) {
            console.error(error);
        }
    };
    


    const [budgetWeeks, setBudgetWeeks] = useState("")
    const [totalBudget, setTotalBudget] = useState("")

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
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6"
            >
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-slate-800">🧾 Simple Budget Planner</h1>
                    <p className="text-slate-500 text-sm mt-2">Plan your spending clearly & simply</p>
                </header>
                <div className="text-right mb-4">
                    <Button onClick={()=>handleExportPDF()} className="bg-indigo-600 text-white">📄 Export to PDF</Button>
                </div>
                <div ref={exportRef}>
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
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBudgetWeeks(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Total Budget (K)</Label>
                                    <Input
                                        type="number"
                                        value={totalBudget}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTotalBudget(e.target.value)}
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
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setItemName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Cost (K)</Label>
                                    <Input
                                        type="number"
                                        value={itemCost}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setItemCost(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Type</Label>
                                    <Select value={itemType} onValueChange={(value) => setItemType(value as ItemType)}>
                                        <SelectTrigger className="bg-white border shadow-sm"> {/* ✨ Fix: visible dropdown */}
                                            <SelectValue placeholder="Recurring or One-time" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={"recurring" as ItemType}>Recurring</SelectItem>
                                            <SelectItem value={"one-time" as ItemType}>One-time</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Recurring inputs (conditional display) */}
                            {itemType === "recurring" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label>Frequency</Label>
                                        <Select value={frequency} onValueChange={(value) => setFrequency(value as Frequency)}>
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
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDurationWeeks(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 flex gap-4">
                                <motion.div
                                    whileHover={{
                                        scale: 1.05,
                                        transition: { duration: 0.2, ease: 'easeOut' }
                                    }}
                                    whileTap={{
                                        scale: 0.95,
                                        transition: { duration: 0.1, ease: 'easeIn' }
                                    }}
                                >
                                    <Button onClick={handleAddItem}
                                        className={`${
                                            editId ? 'bg-yellow-500' : 'bg-green-500'
                                        } text-white px-6 py-3 rounded-lg shadow-md transition-all duration-200 ease-in-out`}>
                                        {editId ? "✅ Update Item" : "➕ Add Item"}
                                    </Button>
                                </motion.div>
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
                                <AnimatePresence>
                                    <motion.ul
                                        className="space-y-4"
                                        initial="hidden"
                                        animate="visible"
                                        variants={{
                                            visible: {
                                                transition: { staggerChildren: 0.1 }
                                            }
                                        }}
                                    >
                                        {items.map((item) => {
                                            const totalCost =
                                                item.type === "recurring" && item.frequency && item.durationWeeks
                                                    ? item.cost * getFrequencyMultiplier(item.frequency) * item.durationWeeks
                                                    : item.cost

                                            return (
                                                <motion.li
                                                    key={item.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                                    className="border p-4 rounded bg-slate-50"
                                                >
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
                                                </motion.li>
                                            )
                                        })}
                                    </motion.ul>
                                </AnimatePresence>
                            )}
                        </section>

                        {/* Summary */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className="bg-white p-6 rounded-lg shadow"
                        >
                            <h2 className="text-2xl font-semibold mb-4">4. Summary</h2>
                            <div className="text-lg text-slate-700">
                                <p>Total Planned Expenses: <span className="font-bold">K{totalExpenses.toLocaleString()}</span></p>
                                <p className="mt-2">Remaining Budget: <span className={`font-bold ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>K{remaining.toLocaleString()}</span></p>
                            </div>
                        </motion.section>
                    </div>
                </main>
                </div>
                <footer className="text-center text-gray-500 text-sm mt-4 border-t pt-4">
                    App by Darlingson
                </footer>
            </motion.div>
        </div>
    )
}
