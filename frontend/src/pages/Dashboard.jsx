import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import API from "../api";

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  IndianRupee,
} from "lucide-react";

import Navbar from "../Components/Navbar";
import ExpenseChart from "../Components/ExpenseChart";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await API.get("/expenses");

        setExpenses(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch expenses:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Total expenses
  const totalExpenses = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount),
    0
  );

  // Example fixed income for college project
  const totalIncome = 50000;

  const currentBalance = totalIncome - totalExpenses;

  // Category chart data
  const categoryData = Object.values(
    expenses.reduce((result, expense) => {
      const category = expense.category;

      if (!result[category]) {
        result[category] = {
          name: category,
          value: 0,
        };
      }

      result[category].value += Number(
        expense.amount
      );

      return result;
    }, {})
  );


  // Monthly expense chart data
const monthlyData = Object.values(
  expenses.reduce((result, expense) => {
    const date = new Date(expense.date);

    const month = date.toLocaleString("en-IN", {
      month: "short",
    });

    const year = date.getFullYear();

    const key = `${year}-${date.getMonth()}`;

    if (!result[key]) {
      result[key] = {
        month: `${month} ${year}`,
        amount: 0,
      };
    }

    result[key].amount += Number(expense.amount);

    return result;
  }, {})
);

  // Latest 5 expenses
  const recentExpenses = [...expenses]
    .sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    )
    .slice(0, 5);

  const stats = [
    {
      title: "Total Income",
      value: totalIncome,
      icon: TrendingUp,
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      title: "Total Expenses",
      value: totalExpenses,
      icon: TrendingDown,
      bg: "bg-red-50",
      text: "text-red-600",
    },
    {
      title: "Current Balance",
      value: currentBalance,
      icon: Wallet,
      bg: "bg-indigo-50",
      text: "text-indigo-600",
    },
  ];

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-sm font-medium text-indigo-600">
            Expense Dashboard
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Good morning, {user.name || "User"} 👋
          </h1>

          <p className="mt-2 text-slate-500">
            Here's an overview of your finances.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="mb-8 grid gap-5 md:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.title}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.1,
                }}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      {stat.title}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                      ₹
                      {stat.value.toLocaleString(
                        "en-IN"
                      )}
                    </h2>
                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.text}`}
                  >
                    <Icon size={22} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="mb-8">
          <ExpenseChart
  monthlyData={monthlyData}
  categoryData={categoryData}
/>
        </div>

        {/* Recent Expenses */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-100 p-5">
            <h2 className="font-bold text-slate-900">
              Recent Expenses
            </h2>

            <p className="text-sm text-slate-500">
              Your latest transactions
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500">
              Loading expenses...
            </div>
          ) : recentExpenses.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-medium text-slate-700">
                No expenses yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Add your first expense to see it here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentExpenses.map((expense) => (
                <motion.div
                  key={expense._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-5 transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <IndianRupee size={19} />
                    </div>

                    <div>
                      <h3 className="font-medium text-slate-800">
                        {expense.title}
                      </h3>

                      <p className="text-xs text-slate-500">
                        {expense.category} •{" "}
                        {new Date(
                          expense.date
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                  </div>

                  <p className="font-semibold text-red-500">
                    - ₹
                    {Number(
                      expense.amount
                    ).toLocaleString("en-IN")}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

export default Dashboard;