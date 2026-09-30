import Expense from "../models/Expense.js";

/*
|--------------------------------------------------------------------------
| Get Expenses
|--------------------------------------------------------------------------
*/

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user.userId,
    }).sort({
      date: -1,
    });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch expenses",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Single Expense
|--------------------------------------------------------------------------
*/

export const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch expense",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Add Expense
|--------------------------------------------------------------------------
*/

export const createExpense = async (req, res) => {
  try {
    const {
      title,
      amount,
      category,
      date,
      paymentMethod,
      description,
    } = req.body;

    if (
      !title ||
      amount === undefined ||
      !category ||
      !date ||
      !paymentMethod
    ) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    const expense = await Expense.create({
      user: req.user.userId,
      title,
      amount,
      category,
      date,
      paymentMethod,
      description,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create expense",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update Expense
|--------------------------------------------------------------------------
*/

export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update expense",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Delete Expense
|--------------------------------------------------------------------------
*/

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete expense",
    });
  }
};