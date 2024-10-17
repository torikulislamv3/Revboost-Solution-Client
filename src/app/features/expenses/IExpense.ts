export interface ExpenseEntry {
  expenseId: string;
  item: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ExpensesState {
  expenses: ExpenseEntry[];
  loading: boolean;
  error: string | null;
}

export interface AddExpensePayload {
  userId: string;
  userEmail: string;
  expenseEntries: ExpenseEntry[];
}