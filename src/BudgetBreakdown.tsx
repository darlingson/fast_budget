import type { ExpenseItem, ItemType, Category } from "./types/ExpenseItem";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"; // Assuming shadcn ui components are in @/components/ui

// Helper function to calculate data for the Category Pie Chart
const getCategoryData = (data: ExpenseItem[]) => {
    const categoryMap = new Map<Category, number>();
    data.forEach(item => {
        categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + item.cost);
    });
    return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
};

// Helper function to calculate data for the Item Type Bar Chart
const getItemTypeData = (data: ExpenseItem[]) => {
    const typeMap = new Map<ItemType, number>();
    data.forEach(item => {
        typeMap.set(item.type, (typeMap.get(item.type) || 0) + item.cost);
    });
    return Array.from(typeMap.entries()).map(([name, value]) => ({ name, value }));
};

// Colors for the Pie Chart slices (you can customize these)
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

export default function BudgetBreakdown({ data }: { data: ExpenseItem[] }) {
    const categoryData = getCategoryData(data);
    const itemTypeData = getItemTypeData(data);

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {/* Category Breakdown Pie Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Spending by Category</CardTitle>
                </CardHeader>
                <CardContent>
                    {categoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {categoryData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `$${value}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-gray-500">No category data available to display.</p>
                    )}
                </CardContent>
            </Card>

            {/* Expense Type Bar Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Cost by Expense Type</CardTitle>
                </CardHeader>
                <CardContent>
                    {itemTypeData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={itemTypeData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(value) => `$${value}`} />
                                <Tooltip formatter={(value) => `$${value}`} />
                                <Legend />
                                <Bar dataKey="value" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-gray-500">No expense type data available to display.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}