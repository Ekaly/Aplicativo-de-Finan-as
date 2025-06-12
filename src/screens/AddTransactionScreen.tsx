// AddTransactionScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTransactions } from '../contexts/TransactionContext';

export default function AddTransactionScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const { addTransaction } = useTransactions();

  const handleAdd = () => {
    if (!title || !amount || isNaN(parseFloat(amount))) {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    addTransaction(title, parseFloat(amount), type, description || undefined);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nova Transação</Text>
      <Text style={styles.label}>Título</Text>
      <TextInput
        placeholder="Ex: Salário, Aluguel"
        placeholderTextColor="#6c757d"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <Text style={styles.label}>Valor</Text>
      <TextInput
        placeholder="Ex: 1000.00"
        placeholderTextColor="#6c757d"
        value={amount}
        onChangeText={text => setAmount(text.replace(',', '.'))}
        keyboardType="numeric"
        style={styles.input}
      />
      <Text style={styles.label}>Descrição (opcional)</Text>
      <TextInput
        placeholder="Ex: Pagamento mensal"
        placeholderTextColor="#6c757d"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <Text style={styles.label}>Tipo</Text>
      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[styles.typeButton, type === 'income' && styles.selectedIncome]}
          onPress={() => setType('income')}
          activeOpacity={0.7}
        >
          <Text style={[styles.typeText, type === 'income' && styles.selectedText]}>Ganho</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type === 'expense' && styles.selectedExpense]}
          onPress={() => setType('expense')}
          activeOpacity={0.7}
        >
          <Text style={[styles.typeText, type === 'expense' && styles.selectedText]}>Despesa</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAdd} activeOpacity={0.7}>
        <Text style={styles.addButtonText}>Adicionar Transação</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 100, // Prevent buttons from looking cramped
  },
  selectedIncome: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  selectedExpense: {
    backgroundColor: '#dc3545',
    borderColor: '#dc3545',
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  selectedText: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 150, // Consistent with HomeScreen buttons
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});