const { PrismaClient } = require('@prisma/client')

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  console.log('Seeding database...')

  // limpando dados existentes
  await prisma.reservation.deleteMany().catch(()=>{})
  await prisma.product.deleteMany().catch(()=>{})
  await prisma.store.deleteMany().catch(()=>{})
  await prisma.user.deleteMany().catch(()=>{})

  // Usuários
  const users = await Promise.all([
    prisma.user.create({ data: { name: 'Mariana Souza', email: 'mariana.souza@gmail.com', password: 'senha123', phone: '(81) 98888-0001', userType: 'COMPRADOR', createdAt: new Date('2025-02-10') } }),
    prisma.user.create({ data: { name: 'Ana Costa', email: 'ana.costa@modamei.com', password: 'senha123', phone: '(81) 98888-0002', userType: 'VENDEDOR', createdAt: new Date('2025-02-11') } }),
    prisma.user.create({ data: { name: 'Dona Maria MEI', email: 'donamaria.boutique@gmail.com', password: 'senha123', phone: '(81) 98888-0003', userType: 'VENDEDOR', createdAt: new Date('2025-02-12') } }),
    prisma.user.create({ data: { name: 'João Lima', email: 'joao.lima@gmail.com', password: 'senha123', phone: '(81) 98888-0004', userType: 'COMPRADOR', createdAt: new Date('2025-02-12') } })
  ])

  const [mariana, ana, donaMaria, joao] = users

  // Lojas
  const lojas = await Promise.all([
    prisma.store.create({ data: { sellerId: ana.id, name: 'Ana Costa Modas', cpfCnpj: '123.456.789-00', segment: 'Moda Feminina Casual', distance: '5km' } }),
    prisma.store.create({ data: { sellerId: donaMaria.id, name: 'Boutique da Maria', cpfCnpj: '987.654.321-00', segment: 'Moda Festa + Conjuntinhos', distance: '10km' } })
  ])

  const [lojaAna, lojaMaria] = lojas

  // Produtos
  const products = await Promise.all([
    // === 25 PRODUTOS DA LOJA ANA ===
  prisma.product.create({ data: { storeId: lojaAna.id, name: 'Vestido Midi Preto', category: 'Vestido', price: 129.90, stock: 15, sizes: 'P, M, G', colors: 'Preto' } }),
  prisma.product.create({ data: { storeId: lojaAna.id, name: 'Calça Jeans Mom Azul Clara', category: 'Calça', price: 119.90, stock: 20, sizes: '36, 38, 40', colors: 'Azul Claro' } }),
  prisma.product.create({ data: { storeId: lojaAna.id, name: 'Cropped Branco Algodão', category: 'Blusa', price: 49.90, stock: 25, sizes: 'P, M, G', colors: 'Branco' } }),
  prisma.product.create({ data: { storeId: lojaAna.id, name: 'Camisa Social Azul Clara', category: 'Camisa', price: 89.90, stock: 18, sizes: 'P, M, G', colors: 'Azul Claro' } }),
  prisma.product.create({ data: { storeId: lojaAna.id, name: 'Saia Lápis Preta', category: 'Saia', price: 79.90, stock: 14, sizes: 'P, M, G', colors: 'Preto' } }),
  prisma.product.create({ data: { storeId: lojaAna.id, name: 'Short Jeans Cintura Alta', category: 'Short', price: 69.90, stock: 22, sizes: '36, 38, 40, 42', colors: 'Azul Jeans' } }),
  prisma.product.create({ data: { storeId: lojaAna.id, name: 'Jaqueta Jeans Oversized', category: 'Jaqueta', price: 159.90, stock: 12, sizes: 'P, M, G', colors: 'Azul Escuro' } }),
  prisma.product.create({ data: { storeId: lojaAna.id, name: 'Regata Cinza Mescla', category: 'Regata', price: 39.90, stock: 28, sizes: 'P, M, G', colors: 'Cinza' } }),
  prisma.product.create({ data: { storeId: lojaAna.id, name: 'Vestido Longo Floral', category: 'Vestido', price: 139.90, stock: 10, sizes: 'P, M, G', colors: 'Floral Rosa' } }),
  prisma.product.create({ data: { storeId: lojaAna.id, name: 'Tênis Casual Branco', category: 'Tênis', price: 159.90, stock: 16, sizes: '34, 35, 36, 37, 38, 39', colors: 'Branco' } }),
  prisma.product.create({ data: { storeId: lojaAna.id, name: 'Calça Jogger Preta', category: 'Calça', price: 99.90, stock: 20, sizes: 'P, M, G', colors: 'Preto' } }),
  prisma.product.create({ data: { storeId: lojaAna.id, name: 'Cropped Canelado Preto', category: 'Blusa', price: 49.90, stock: 18, sizes: 'P, M, G', colors: 'Preto' } }),
  prisma.product.create({ data: { storeId: lojaAna.id, name: 'Blusa Rosa Clara', category: 'Blusa', price: 54.90, stock: 25, sizes: 'P, M, G', colors: 'Rosa Claro' } }),
  prisma.product.create({ data: { storeId: lojaAna.id, name: 'Macacão Pantacourt Terracota', category: 'Macacão', price: 149.90, stock: 10, sizes: 'P, M, G', colors: 'Terracota' } }),
  prisma.product.create({ data: { storeId: lojaAna.id, name: 'Blazer Bege Feminino', category: 'Blazer', price: 179.90, stock: 8, sizes: 'P, M, G', colors: 'Bege' } }),
  prisma.product.create({ data: { storeId: lojaAna.id, name: 'Top Fitness Preto', category: 'Top', price: 39.90, stock: 22, sizes: 'P, M, G', colors: 'Preto' } }),
  prisma.product.create({ data: { storeId: lojaAna.id, name: 'Legging Preta Compressão', category: 'Calça', price: 89.90, stock: 15, sizes: 'P, M, G', colors: 'Preto' } }),
  prisma.product.create({ data: { storeId: lojaAna.id, name: 'Blusa Tricô Gola Alta Bege', category: 'Blusa', price: 79.90, stock: 12, sizes: 'P, M, G', colors: 'Bege' } }),
  prisma.product.create({ data: { storeId: lojaAna.id, name: 'Calça Alfaiataria Preta', category: 'Calça', price: 119.90, stock: 10, sizes: '36, 38, 40, 42', colors: 'Preto' } }),
  prisma.product.create({ data: { storeId: lojaAna.id, name: 'Sandália Dourada Rasteira', category: 'Sandália', price: 69.90, stock: 18, sizes: '34, 35, 36, 37, 38, 39', colors: 'Dourado' } }),
  prisma.product.create({ data: { storeId: lojaAna.id, name: 'Sandália Salto Preto', category: 'Sandália', price: 109.90, stock: 12, sizes: '34, 35, 36, 37, 38, 39', colors: 'Preto' } }),
  prisma.product.create({ data: { storeId: lojaAna.id, name: 'Bolsa Transversal Preta', category: 'Bolsa', price: 89.90, stock: 20, sizes: 'Único', colors: 'Preto' } }),
  prisma.product.create({ data: { storeId: lojaAna.id, name: 'Chinelo Slide Preto', category: 'Chinelo', price: 39.90, stock: 26, sizes: '34, 35, 36, 37, 38, 39', colors: 'Preto' } }),
  prisma.product.create({ data: { storeId: lojaAna.id, name: 'Vestido Tubinho Vermelho', category: 'Vestido', price: 139.90, stock: 8, sizes: 'P, M, G', colors: 'Vermelho' } }),
  prisma.product.create({ data: { storeId: lojaAna.id, name: 'Vestido Jeans Feminino', category: 'Vestido', price: 119.90, stock: 14, sizes: 'P, M, G', colors: 'Jeans' } }),

  // === 25 PRODUTOS DA LOJA MARIA ===
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Camiseta Feminina Branca', category: 'Camiseta', price: 49.90, stock: 23, sizes: 'P, M, G', colors: 'Branco' } }),
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Jaqueta Corta-Vento Azul', category: 'Jaqueta', price: 159.90, stock: 10, sizes: 'P, M, G', colors: 'Azul Marinho' } }),
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Moletom Rosa Oversized', category: 'Moletom', price: 89.90, stock: 16, sizes: 'P, M, G', colors: 'Rosa' } }),
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Saia Plissada Bege', category: 'Saia', price: 79.90, stock: 18, sizes: 'P, M, G', colors: 'Bege' } }),
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Top Faixa Branco', category: 'Top', price: 39.90, stock: 20, sizes: 'P, M, G', colors: 'Branco' } }),
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Calça Flare Preta', category: 'Calça', price: 109.90, stock: 14, sizes: '36, 38, 40, 42', colors: 'Preto' } }),
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Vestido Listrado Azul', category: 'Vestido', price: 99.90, stock: 12, sizes: 'P, M, G', colors: 'Listrado Azul' } }),
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Camiseta Preta Oversized', category: 'Camiseta', price: 59.90, stock: 22, sizes: 'P, M, G', colors: 'Preto' } }),
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Calça Cargo Verde Militar', category: 'Calça', price: 129.90, stock: 10, sizes: '36, 38, 40', colors: 'Verde Militar' } }),
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Short Saia Preto Academia', category: 'Short', price: 54.90, stock: 18, sizes: 'P, M, G', colors: 'Preto' } }),
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Tênis Esportivo Preto', category: 'Tênis', price: 159.90, stock: 14, sizes: '34, 35, 36, 37, 38, 39', colors: 'Preto' } }),
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Blusa Ombro a Ombro Rosa', category: 'Blusa', price: 59.90, stock: 24, sizes: 'P, M, G', colors: 'Rosa' } }),
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Cardigan Cinza Mescla', category: 'Cardigan', price: 89.90, stock: 12, sizes: 'P, M, G', colors: 'Cinza' } }),
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Legging Azul Marinho', category: 'Calça', price: 79.90, stock: 17, sizes: 'P, M, G', colors: 'Azul Marinho' } }),
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Blusa Social Manga Bufante', category: 'Blusa', price: 69.90, stock: 18, sizes: 'P, M, G', colors: 'Branco' } }),
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Cropped Tie Dye Colorido', category: 'Blusa', price: 49.90, stock: 20, sizes: 'P, M, G', colors: 'Colorido' } }),
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Camisa Preta Feminina', category: 'Camisa', price: 79.90, stock: 16, sizes: 'P, M, G', colors: 'Preto' } }),
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Vestido Renda Branco', category: 'Vestido', price: 129.90, stock: 10, sizes: 'P, M, G', colors: 'Branco' } }),
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Moletom Preto Capuz', category: 'Moletom', price: 89.90, stock: 18, sizes: 'P, M, G', colors: 'Preto' } }),
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Bolsa Nude Elegante', category: 'Bolsa', price: 99.90, stock: 15, sizes: 'Único', colors: 'Nude' } }),
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Top Vermelho Festa', category: 'Top', price: 39.90, stock: 20, sizes: 'P, M, G', colors: 'Vermelho' } }),
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Saia Jeans Curta Azul Clara', category: 'Saia', price: 69.90, stock: 22, sizes: '34, 36, 38', colors: 'Azul Claro' } }),
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Tênis Chunky Branco', category: 'Tênis', price: 169.90, stock: 14, sizes: '34, 35, 36, 37, 38, 39', colors: 'Branco' } }),
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Vestido Floral Preto', category: 'Vestido', price: 139.90, stock: 12, sizes: 'P, M, G', colors: 'Preto Floral' } }),
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Blusa Verde Oliva', category: 'Blusa', price: 54.90, stock: 18, sizes: 'P, M, G', colors: 'Verde Oliva' } }),
  prisma.product.create({ data: { storeId: lojaMaria.id, name: 'Vestido Festa Longo', category: 'Festa', price: 229.90, stock: 5, sizes: 'M', colors: 'Vermelho, Azul' } })
  ])

  // Reservas
  await prisma.reservation.create({ data: { productId: products[0].id, buyerId: mariana.id, sellerId: lojaAna.sellerId, date: new Date('2025-02-15'), status: 'AGUARDANDO_RETIRADA', note: 'Cliente solicitou provar na loja' } })
  await prisma.reservation.create({ data: { productId: products[3].id, buyerId: joao.id, sellerId: lojaMaria.sellerId, date: new Date('2025-02-15'), status: 'CONFIRMADA', note: 'Reserva válida por 24h' } })
  await prisma.reservation.create({ data: { productId: products[1].id, buyerId: mariana.id, sellerId: lojaAna.sellerId, date: new Date('2025-02-16'), status: 'CANCELADA', note: 'Cliente desistiu' } })
  await prisma.reservation.create({ data: { productId: products[2].id, buyerId: joao.id, sellerId: lojaMaria.sellerId, date: new Date('2025-02-17'), status: 'EXPIRADA', note: 'Não retirou no prazo' } })

  console.log('Seed completo')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
