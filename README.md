# Aplicativo de Finanças

Um aplicativo de controle financeiro pessoal desenvolvido em React Native. Permite gerenciar transações (ganhos e despesas), gerar relatórios em PDF, e visualizar gráficos de resumo financeiro.

## Funcionalidades
- Adicionar, editar e excluir transações com confirmação de exclusão.
- Suporte a descrições nas transações, exibidas em relatórios PDF com truncamento (elipse).
- Persistência de dados com AsyncStorage.
- Gráficos de ganhos e despesas usando react-native-chart-kit.

## Tecnologias
- React Native
- Expo
- AsyncStorage
- react-native-chart-kit
- expo-print, expo-sharing
- react-native-vector-icons
- date-fns, uuid

## Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/Ekaly/Aplicativo-de-Finan-as.git

2. Instale as dependências:
   ```bash
   npm install

3. Inicie o projeto:
   ```bash
   npx expo start
