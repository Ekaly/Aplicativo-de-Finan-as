// TransactionContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, TransactionType } from '../types/transaction';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';

interface TransactionContextProps {
  transactions: Transaction[];
  addTransaction: (title: string, amount: number, type: TransactionType, description?: string) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, updatedTransaction: Partial<Transaction>) => void;
  income: number;
  expenses: number;
  balance: number;
}

const TransactionContext = createContext<TransactionContextProps>({} as TransactionContextProps);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const TransactionProvider = ({ children }: Props) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load transactions from AsyncStorage on mount
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const saved = await AsyncStorage.getItem('transactions');
        if (saved) {
          const parsed = JSON.parse(saved);
          // Validate data (basic check)
          if (Array.isArray(parsed)) {
            setTransactions(parsed);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar transações:', error);
      }
    };
    loadTransactions();
  }, []);

  // Save transactions to AsyncStorage whenever they change
  useEffect(() => {
    const saveTransactions = async () => {
      try {
        await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
      } catch (error) {
        console.error('Erro ao salvar transações:', error);
      }
    };
    saveTransactions();
  }, [transactions]);

  const addTransaction = (title: string, amount: number, type: TransactionType, description?: string) => {
    const newTransaction: Transaction = {
      id: uuidv4(),
      title,
      amount,
      type,
      date: new Date().toISOString(),
      description,
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const updateTransaction = (id: string, updatedTransaction: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id ? { ...transaction, ...updatedTransaction } : transaction
      )
    );
  };

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        income,
        expenses,
        balance,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};