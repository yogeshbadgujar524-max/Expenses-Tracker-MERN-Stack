import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function ExpenseForm({
  onAddExpense,
  onUpdateExpense,
  editingExpense,
  onCancelEdit,
}) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: "",
    paymentMethod: "Cash",
    description: "",
  });

  useEffect(() => {
    if (editingExpense) {
      setForm({
        title: editingExpense.title || "",
        amount: editingExpense.amount || "",
        category: editingExpense.category || "Food",
        date: editingExpense.date
          ? editingExpense.date.split("T")[0]
          : "",
        paymentMethod:
          editingExpense.paymentMethod || "Cash",
        description:
          editingExpense.description || "",
      });
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingExpense) {
      await onUpdateExpense({
        ...form,
        amount: Number(form.amount),
      });
    } else {
      await onAddExpense({
        ...form,
        amount: Number(form.amount),
      });
    }

    setForm({
      title: "",
      amount: "",
      category: "Food",
      date: "",
      paymentMethod: "Cash",
      description: "",
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">
          {editingExpense
            ? "Edit Expense"
            : "Add Expense"}
        </h2>

        <p className="text-sm text-slate-500">
          {editingExpense
            ? "Update your expense details."
            : "Add a new expense to your tracker."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Title */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Title
          </label>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Grocery"
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Amount
          </label>

          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="e.g. 1500"
            min="0"
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Category
          </label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
          >
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Education">
              Education
            </option>
            <option value="Entertainment">
              Entertainment
            </option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Date
          </label>

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        {/* Payment */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Payment Method
          </label>

          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
          >
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Bank Transfer">
              Bank Transfer
            </option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>

          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Optional"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="submit"
          className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          {editingExpense
            ? "Update Expense"
            : "Add Expense"}
        </button>

        {editingExpense && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
      </div>
    </motion.form>
  );
}

export default ExpenseForm;