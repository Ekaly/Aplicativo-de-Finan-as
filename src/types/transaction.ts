// transaction.ts
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
  description?: string; // Optional field
}