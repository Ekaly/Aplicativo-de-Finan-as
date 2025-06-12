// shareReport.ts
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { shareAsync } from 'expo-sharing';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  description?: string; // Added optional description field
}

// Utility function to truncate text with ellipsis
const truncateText = (text: string | undefined, maxLength: number) => {
  if (!text) return 'Sem descrição';
  return text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text;
};

export async function gerarRelatorioFinanceiroPDF(
  income: number,
  expenses: number,
  balance: number,
  transactions: Transaction[]
) {
  const html = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; }
          h2 { margin-top: 20px; }
          p { font-size: 16px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 14px; }
          th { background-color: #f4f4f4; }
          .income { color: green; }
          .expense { color: red; }
        </style>
      </head>
      <body>
        <h1>Resumo Financeiro</h1>
        <p><strong>Ganhos:</strong> R$ ${income.toFixed(2)}</p>
        <p><strong>Despesas:</strong> R$ ${expenses.toFixed(2)}</p>
        <p><strong>Saldo:</strong> R$ ${balance.toFixed(2)}</p>

        <h2>Transações</h2>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Título</th>
              <th>Descrição</th>
              <th>Tipo</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            ${transactions
              .map(
                t => `
                <tr>
                  <td>${new Date(t.date).toLocaleDateString('pt-BR')}</td>
                  <td>${t.title}</td>
                  <td>${truncateText(t.description, 50)}</td>
                  <td class="${t.type}">${t.type === 'income' ? 'Ganho' : 'Despesa'}</td>
                  <td>R$ ${t.amount.toFixed(2)}</td>
                </tr>
              `
              )
              .join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html });

    if (await Sharing.isAvailableAsync()) {
      await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } else {
      alert('Compartilhamento não está disponível neste dispositivo');
    }
  } catch (error) {
    console.error('Erro ao gerar ou compartilhar o PDF:', error);
    alert('Ocorreu um erro ao gerar o relatório. Tente novamente.');
  }
}