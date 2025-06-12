// HomeScreen.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Alert } from 'react-native';
import { useTransactions } from '../contexts/TransactionContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PieChart } from 'react-native-chart-kit';
import { gerarRelatorioFinanceiroPDF, Transaction } from '../utils/shareReport';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen({ navigation }: any) {
  const { transactions, income, expenses, balance, deleteTransaction } = useTransactions();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [showChart, setShowChart] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const confirmDelete = (id: string, title: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza de que deseja excluir a transação "${title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteTransaction(id) },
      ],
      { cancelable: true }
    );
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      if (filter === 'income') return transaction.type === 'income';
      if (filter === 'expense') return transaction.type === 'expense';
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const chartData = [
    {
      name: 'Ganhos',
      population: income,
      color: '#28a745',
      legendFontColor: '#212529',
      legendFontSize: 14,
    },
    {
      name: 'Despesas',
      population: expenses,
      color: '#dc3545',
      legendFontColor: '#212529',
      legendFontSize: 14,
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <Text style={styles.header}>Resumo Financeiro</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 20 }}
      >
        <View style={[styles.summaryCard, styles.incomeCard]}>
          <Text style={styles.summaryIcon}>💰</Text>
          <Text style={styles.summaryLabel}>Ganhos</Text>
          <Text style={styles.summaryValue}>R$ {income.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryCard, styles.expenseCard]}>
          <Text style={styles.summaryIcon}>📉</Text>
          <Text style={styles.summaryLabel}>Despesas</Text>
          <Text style={styles.summaryValue}>R$ {expenses.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryCard, styles.balanceCard]}>
          <Text style={styles.summaryIcon}>⚖️</Text>
          <Text style={styles.summaryLabel}>Saldo</Text>
          <Text style={styles.summaryValue}>R$ {balance.toFixed(2)}</Text>
        </View>
      </ScrollView>

      {(income > 0 || expenses > 0) && (
        <TouchableOpacity
          style={[styles.actionButton, showChart && styles.activeChartButton]}
          onPress={() => setShowChart(!showChart)}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText} numberOfLines={1} ellipsizeMode="tail">
            {showChart ? 'Ocultar Gráfico' : 'Mostrar Gráfico'}
          </Text>
        </TouchableOpacity>
      )}

      {showChart && (income > 0 || expenses > 0) && (
        <View style={styles.chartContainer}>
          <PieChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: () => '#212529',
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={styles.chart}
          />
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Add')}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>Adicionar Transação</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#6c757d' }]}
          onPress={() =>
            gerarRelatorioFinanceiroPDF(income, expenses, balance, transactions as Transaction[])
          }
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>Compartilhar PDF</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>Transações</Text>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.selectedFilter]}
          onPress={() => setFilter('all')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.selectedFilterText]}>
            Todos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'income' && styles.selectedFilter]}
          onPress={() => setFilter('income')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, filter === 'income' && styles.selectedFilterText]}>
            Ganhos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'expense' && styles.selectedFilter]}
          onPress={() => setFilter('expense')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, filter === 'expense' && styles.selectedFilterText]}>
            Despesas
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.transactionCount}>
        Mostrando {filteredTransactions.length} transaç{filteredTransactions.length !== 1 ? 'ões' : 'ão'}
      </Text>

      <FlatList
        data={filteredTransactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isExpanded = expandedItems.has(item.id);
          return (
            <TouchableOpacity
              style={[styles.transaction, item.type === 'income' ? styles.income : styles.expense]}
              onPress={() => toggleExpand(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.transactionHeader}>
                <Text style={styles.transactionTitle}>
                  {item.title} - R$ {item.amount.toFixed(2)} ({item.type === 'income' ? 'Ganho' : 'Despesa'})
                </Text>
                <Text style={styles.transactionDate}>
                  {format(new Date(item.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </Text>
              </View>
              {isExpanded && (
                <View style={styles.expandedContent}>
                  <Text style={styles.transactionDescription}>
                    {item.description || 'Sem descrição disponível'}
                  </Text>
                  <View style={styles.expandedActions}>
                    <TouchableOpacity
                      style={styles.expandedButton}
                      onPress={() => navigation.navigate('Edit', { transaction: item })}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.expandedButtonText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.expandedButton, styles.deleteButton]}
                      onPress={() => confirmDelete(item.id, item.title)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.expandedButtonText}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginVertical: 15,
    textAlign: 'center',
  },
  summaryCard: {
    width: screenWidth * 0.45,
    padding: 20,
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  incomeCard: {
    backgroundColor: '#28a74520',
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  expenseCard: {
    backgroundColor: '#dc354520',
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  balanceCard: {
    backgroundColor: '#007bff20',
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  summaryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginTop: 8,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  chart: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 150,
  },
  activeChartButton: {
    backgroundColor: '#0056b3',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 150,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'nowrap',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  filterButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedFilter: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
  },
  selectedFilterText: {
    color: '#fff',
  },
  transactionCount: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#6c757d',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  transaction: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  income: {
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  expense: {
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  transactionHeader: {
    flexDirection: 'column',
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  transactionDate: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 5,
  },
  expandedContent: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  transactionDescription: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 10,
  },
  expandedActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expandedButton: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    minWidth: 100,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  expandedButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});