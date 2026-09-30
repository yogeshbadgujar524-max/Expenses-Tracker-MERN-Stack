import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Trash2,
  IndianRupee,
  Pencil,
} from "lucide-react";

import Navbar from "../Components/Navbar";
import ExpenseForm from "../Components/ExpenseForm";
import API from "../api";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const response = await API.get("/expenses");

      setExpenses(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to load expenses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const addExpense = async (expense) => {
    try {
      const response = await API.post(
        "/expenses",
        expense
      );

      setExpenses((prev) => [
        response.data,
        ...prev,
      ]);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to add expense"
      );
    }
  };

  const deleteExpense = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);

      setExpenses((prev) =>
        prev.filter((expense) => expense._id !== id)
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to delete expense"
      );
    }
  };


  const updateExpense = async (expense) => {
    try {
      const response = await API.put(
        `/expenses/${editingExpense._id}`,
        expense
      );

      setExpenses((prev) =>
        prev.map((item) =>
          item._id === editingExpense._id
            ? response.data
            : item
        )
      );

      setEditingExpense(null);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to update expense"
      );
    }
  };

  const filteredExpenses = expenses.filter((expense) =>
    expense.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-sm font-medium text-indigo-600">
            Transactions
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Your Expenses
          </h1>

          <p className="mt-2 text-slate-500">
            Add and manage your daily expenses.
          </p>
        </motion.div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mb-8">
          <ExpenseForm
            onAddExpense={addExpense}
            onUpdateExpense={updateExpense}
            editingExpense={editingExpense}
            onCancelEdit={() => setEditingExpense(null)}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                All Expenses
              </h2>

              <p className="text-sm text-slate-500">
                {expenses.length} transactions
              </p>
            </div>

            <div className="relative w-full md:w-72">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search expenses..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading expenses...
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <motion.div
                    layout
                    key={expense._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <IndianRupee size={20} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {expense.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {expense.category} •{" "}
                          {expense.paymentMethod}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {new Date(
                            expense.date
                          ).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-5 sm:justify-end">
                      <p className="font-bold text-red-500">
                        - ₹
                        {Number(
                          expense.amount
                        ).toLocaleString("en-IN")}
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setEditingExpense(expense)
                          }
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() =>
                            deleteExpense(expense._id)
                          }
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-10 text-center">
                  <p className="font-medium text-slate-700">
                    No expenses found
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Add your first expense.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Expenses;