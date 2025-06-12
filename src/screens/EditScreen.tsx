// EditScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTransactions } from '../contexts/TransactionContext';

export default function EditScreen({ route, navigation }: any) {
  const { transaction } = route.params;
  const { updateTransaction } = useTransactions();
  const [title, setTitle] = useState(transaction.title);
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [description, setDescription] = useState(transaction.description || '');
  const [type, setType] = useState<'income' | 'expense'>(transaction.type);

  const handleSave = () => {
    if (!title || !amount || isNaN(parseFloat(amount))) {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    updateTransaction(transaction.id, {
      title,
      amount: parseFloat(amount),
      type,
      description: description || undefined,
      date: new Date().toISOString(), // Update date on edit (optional: keep original date)
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Editar Transação</Text>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Ex: Salário, Aluguel"
        placeholderTextColor="#6c757d"
      />
      <Text style={styles.label}>Valor</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={text => setAmount(text.replace(',', '.'))}
        placeholder="Ex: 1000.00"
        placeholderTextColor="#6c757d"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Descrição (opcional)</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Ex: Pagamento mensal"
        placeholderTextColor="#6c757d"
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
      <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.7}>
        <Text style={styles.saveButtonText}>Salvar</Text>
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
  saveButton: {
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
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});