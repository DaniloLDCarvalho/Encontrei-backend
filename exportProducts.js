// exportProducts.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  // 1) Buscar todos os produtos do banco
  const products = await prisma.product.findMany();

  console.log(`Encontrados ${products.length} produtos.`);

  // 2) Salvar em JSON (dataset bruto)
  fs.writeFileSync(
    'products_dataset.json',
    JSON.stringify(products, null, 2),
    'utf-8'
  );

  console.log('Arquivo products_dataset.json criado com sucesso!');

  // 3) (Opcional) Salvar em CSV simples
  const csvHeader = 'id,storeId,name,category,price,stock,sizes,colors\n';

  const csvRows = products.map((p) => {
    // garantir que não quebre o CSV por causa de vírgulas
    const safeName = `"${(p.name || '').replace(/"/g, '""')}"`;
    const safeCategory = `"${(p.category || '').replace(/"/g, '""')}"`;
    const safeSizes = `"${(p.sizes || '').replace(/"/g, '""')}"`;
    const safeColors = `"${(p.colors || '').replace(/"/g, '""')}"`;

    return [
      p.id,
      p.storeId,
      safeName,
      safeCategory,
      p.price,
      p.stock,
      safeSizes,
      safeColors,
    ].join(',');
  });

  const csvContent = csvHeader + csvRows.join('\n');

  fs.writeFileSync('products_dataset.csv', csvContent, 'utf-8');

  console.log('Arquivo products_dataset.csv criado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
