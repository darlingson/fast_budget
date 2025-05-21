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
  
  export default function BudgetApp() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-800">🧾 Simple Budget Planner</h1>
          <p className="text-slate-500 text-sm mt-2">Plan your spending clearly & simply</p>
        </header>
  
        <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            {/* Budget Setup */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold text-slate-700 mb-6">1. Budget Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-slate-600">Budget Period (in weeks)</Label>
                  <Input type="number" placeholder="e.g. 4" className="mt-1" />
                </div>
                <div>
                  <Label className="text-slate-600">Total Budget (K)</Label>
                  <Input type="number" placeholder="e.g. 100000" className="mt-1" />
                </div>
              </div>
            </section>
  
            {/* Add Item */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold text-slate-700 mb-6">2. Add Expense Item</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <Label className="text-slate-600">Item Name</Label>
                  <Input type="text" placeholder="e.g. Transport" className="mt-1" />
                </div>
                <div>
                  <Label className="text-slate-600">Cost (K)</Label>
                  <Input type="number" placeholder="e.g. 2000" className="mt-1" />
                </div>
                <div>
                  <Label className="text-slate-600">Type</Label>
                  <Select>
                    <SelectTrigger className="mt-1 bg-white border border-slate-300 shadow-sm">
                      <SelectValue placeholder="Recurring or One-time" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-slate-200 shadow-md">
                      <SelectItem value="recurring">Recurring</SelectItem>
                      <SelectItem value="one-time">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-slate-600">Frequency (if recurring)</Label>
                  <Select>
                    <SelectTrigger className="mt-1 bg-white border border-slate-300 shadow-sm">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-slate-200 shadow-md">
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="workdays">Workdays</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-slate-600">Duration (in weeks)</Label>
                  <Input type="number" placeholder="e.g. 4" className="mt-1" />
                </div>
              </div>
  
              <div className="mt-6">
                <Button className="w-full md:w-auto">➕ Add Item</Button>
              </div>
            </section>
          </div>
  
          {/* RIGHT COLUMN */}
          <div className="space-y-8">
            {/* Planned Items */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold text-slate-700 mb-4">3. Planned Items</h2>
              <div className="text-slate-400">No items yet.</div>
            </section>
  
            {/* Summary */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold text-slate-700 mb-4">4. Summary</h2>
              <div className="text-lg text-slate-700">
                <p>Total Planned Expenses: <span className="font-bold">K0</span></p>
                <p className="mt-2">Remaining Budget: <span className="font-bold text-green-600">K0</span></p>
              </div>
            </section>
          </div>
        </main>
      </div>
    )
  }
  