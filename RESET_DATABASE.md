# 🗑️ Como Resetar e Popular o Banco de Dados

## Opção 1: Reset Completo (Recomendado)
Execute este comando para apagar o banco inteiro e recriar as tabelas do zero:

```bash
npx prisma migrate reset
```

**O que faz:**
- ❌ Deleta o banco de dados atual
- ✅ Recria todas as tabelas baseado no schema
- 🌱 Executa automaticamente o seed (popula com dados de exemplo)

**Responda `y` quando perguntado se deseja continuar.**

---

## Opção 2: Reset + Seed Separados
Se preferir fazer em duas etapas:

### Passo 1: Apagar o banco
```bash
npx prisma db push --force-reset
```

### Passo 2: Popular com dados
```bash
npm run prisma:seed
```

---

## Opção 3: Apenas Popular (sem deletar)
Se quiser manter o schema atual e apenas adicionar dados:

```bash
npm run prisma:seed
```

---

## Opção 4: Manual - Sem usar Prisma (SQLite)

Se está usando SQLite (que é seu caso), pode simplesmente:

1. **Deletar o arquivo do banco:**
   ```powershell
   Remove-Item prisma/dev.db -Force
   ```

2. **Recriar as tabelas:**
   ```bash
   npx prisma migrate deploy
   ```

3. **Popular com dados:**
   ```bash
   npm run prisma:seed
   ```

---

## Comandos Úteis

| Comando | O que faz |
|---------|----------|
| `npx prisma migrate reset` | Reset completo + seed |
| `npx prisma migrate dev --name <name>` | Criar nova migration |
| `npx prisma studio` | Abrir interface gráfica do banco |
| `npm run prisma:seed` | Apenas popular dados |
| `npx prisma db push` | Sincronizar schema com DB |

---

## 🎯 Resumo Rápido

Para começar do zero:
```bash
npx prisma migrate reset
```

Isso é tudo! Seu banco estará limpo, com as novas tabelas, e populado com dados de exemplo.
