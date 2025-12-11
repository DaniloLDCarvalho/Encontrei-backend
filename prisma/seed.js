const { PrismaClient } = require('@prisma/client')

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')
  const prisma = new PrismaClient()

  try {
    // Limpar prepared statements
    try {
      await prisma.$executeRaw`DEALLOCATE ALL;`
    } catch (e) {
      // Ignorar erro se não houver prepared statements
    }
    
    await sleep(1000)
    // ============ LIMPEZA DE DADOS ============
    console.log('🗑️  Limpando dados existentes...')
    await prisma.orderItem.deleteMany()
    await sleep(100)
    await prisma.order.deleteMany()
    await sleep(100)
    await prisma.reservationItem.deleteMany()
    await sleep(100)
    await prisma.reservation.deleteMany()
    await sleep(100)
    await prisma.cartItem.deleteMany()
    await sleep(100)
    await prisma.review.deleteMany()
    await sleep(100)
    await prisma.productSearch.deleteMany()
    await sleep(100)
    await prisma.productVariant.deleteMany()
    await sleep(100)
    await prisma.product.deleteMany()
    await sleep(100)
    await prisma.store.deleteMany()
    await sleep(100)
    await prisma.address.deleteMany()
    await sleep(100)
    await prisma.sellerProfile.deleteMany()
    await sleep(100)
    await prisma.buyerProfile.deleteMany()
    await sleep(100)
    await prisma.user.deleteMany()

    await sleep(500)

    // ============ CRIAÇÃO DE USUÁRIOS ============
    console.log('👥 Criando usuários...')
    
    const mariana = await prisma.user.create({
      data: {
        name: 'Mariana Souza',
        email: 'mariana.souza@gmail.com',
        password: 'senha123',
        phone: '(81) 98888-0001',
        userType: 'buyer',
        buyerProfile: {
          create: {
            preferences: JSON.stringify({ categories: ['Moda', 'Acessórios'] }),
            rating: 4.8,
            totalReviews: 12
          }
        }
      }
    })
    await sleep(100)

    const joao = await prisma.user.create({
      data: {
        name: 'João Lima',
        email: 'joao.lima@gmail.com',
        password: 'senha123',
        phone: '(81) 98888-0004',
        userType: 'buyer',
        buyerProfile: {
          create: {
            preferences: JSON.stringify({ categories: ['Eletrônicos'] }),
            rating: 4.5,
            totalReviews: 8
          }
        }
      }
    })
    await sleep(100)

    const ana = await prisma.user.create({
      data: {
        name: 'Ana Costa',
        email: 'ana.costa@modamei.com',
        password: 'senha123',
        phone: '(81) 98888-0002',
        userType: 'seller',
        sellerProfile: {
          create: {
            cpfCnpj: '123.456.789-00',
            businessName: 'Ana Costa Modas',
            businessSegment: 'Moda Feminina Casual',
            about: 'Loja especializada em roupas femininas modernas e confortáveis',
            rating: 4.9,
            totalReviews: 45,
            verified: true
          }
        }
      }
    })
    await sleep(100)

    const donaMaria = await prisma.user.create({
      data: {
        name: 'Dona Maria',
        email: 'donamaria.boutique@gmail.com',
        password: 'senha123',
        phone: '(81) 98888-0003',
        userType: 'seller',
        sellerProfile: {
          create: {
            cpfCnpj: '987.654.321-00',
            businessName: 'Boutique da Maria',
            businessSegment: 'Moda Festa',
            about: 'Especialista em roupas para festas, eventos e ocasiões especiais',
            rating: 4.7,
            totalReviews: 23,
            verified: true
          }
        }
      }
    })

    await sleep(500)

    // ============ CRIAÇÃO DE ENDEREÇOS ============
    console.log('📍 Criando endereços...')
    
    const address1 = await prisma.address.create({
      data: {
        userId: mariana.id,
        street: 'Rua das Flores',
        number: '123',
        complement: 'Apto 45',
        city: 'Recife',
        state: 'PE',
        zipCode: '50010-000',
        isDefault: true
      }
    })
    await sleep(100)

    const address2 = await prisma.address.create({
      data: {
        userId: joao.id,
        street: 'Avenida Boa Viagem',
        number: '456',
        city: 'Recife',
        state: 'PE',
        zipCode: '51010-130',
        isDefault: true
      }
    })

    const addresses = [address1, address2]

    await sleep(500)

    // ============ CRIAÇÃO DE LOJAS ============
    console.log('🏪 Criando lojas...')
    
    const storeAna = await prisma.store.create({
      data: {
        sellerId: ana.id,
        name: 'Ana Costa Modas',
        description: 'Loja de moda feminina casual com peças exclusivas',
        distance: 5000,
        latitude: -8.0515,
        longitude: -34.8811,
        rating: 4.9,
        totalReviews: 45
      }
    })
    await sleep(100)

    const storeMaria = await prisma.store.create({
      data: {
        sellerId: donaMaria.id,
        name: 'Boutique da Maria',
        description: 'Especialista em roupas para festas e eventos',
        distance: 10000,
        latitude: -8.0520,
        longitude: -34.8820,
        rating: 4.7,
        totalReviews: 23
      }
    })

    const stores = [storeAna, storeMaria]

    await sleep(500)

    // ============ CRIAÇÃO DE PRODUTOS ============
    console.log('📦 Criando produtos...')
    
    const vestidoFloral = await prisma.product.create({
      data: {
        storeId: storeAna.id,
        name: 'Vestido Floral Curto',
        description: 'Vestido leve em algodão com estampa floral, perfeito para o verão',
        category: 'Vestido',
        price: 89.90,
        discount: 10,
        stock: 12,
        image: 'https://via.placeholder.com/300?text=Vestido+Floral',
        variants: {
          create: [
            { size: 'P', color: 'Azul', colorHex: '#0066cc', sku: 'VFC-AZ-P', stock: 3 },
            { size: 'M', color: 'Azul', colorHex: '#0066cc', sku: 'VFC-AZ-M', stock: 4 },
            { size: 'G', color: 'Rosa', colorHex: '#ff69b4', sku: 'VFC-RS-G', stock: 5 }
          ]
        }
      }
    })
    await sleep(100)

    const blusaOmbro = await prisma.product.create({
      data: {
        storeId: storeAna.id,
        name: 'Blusa Ombro a Ombro',
        description: 'Blusa tendência com corte ombro a ombro',
        category: 'Blusas',
        price: 59.90,
        stock: 20,
        image: 'https://via.placeholder.com/300?text=Blusa+Ombro',
        variants: {
          create: [
            { size: 'P', color: 'Branco', colorHex: '#ffffff', sku: 'BOO-BR-P', stock: 10 },
            { size: 'M', color: 'Preto', colorHex: '#000000', sku: 'BOO-PT-M', stock: 10 }
          ]
        }
      }
    })
    await sleep(100)

    const conjuntoSocial = await prisma.product.create({
      data: {
        storeId: storeMaria.id,
        name: 'Conjunto Social Feminino',
        description: 'Conjunto elegante para eventos corporativos e formais',
        category: 'Conjunto',
        price: 149.90,
        stock: 8,
        image: 'https://via.placeholder.com/300?text=Conjunto+Social',
        variants: {
          create: [
            { size: 'M', color: 'Preto', colorHex: '#000000', sku: 'CSF-PT-M', stock: 4 },
            { size: 'G', color: 'Preto', colorHex: '#000000', sku: 'CSF-PT-G', stock: 4 }
          ]
        }
      }
    })
    await sleep(100)

    const vestidoFesta = await prisma.product.create({
      data: {
        storeId: storeMaria.id,
        name: 'Vestido Festa Longo',
        description: 'Vestido sofisticado para festas e ocasiões especiais',
        category: 'Festa',
        price: 229.90,
        discount: 15,
        stock: 5,
        image: 'https://via.placeholder.com/300?text=Vestido+Festa',
        variants: {
          create: [
            { size: 'M', color: 'Vermelho', colorHex: '#ff0000', sku: 'VFL-VM-M', stock: 2 },
            { size: 'M', color: 'Azul', colorHex: '#0066cc', sku: 'VFL-AZ-M', stock: 3 }
          ]
        }
      }
    })

    const products = [vestidoFloral, blusaOmbro, conjuntoSocial, vestidoFesta]

    await sleep(500)

    // ============ BUSCAR VARIANTES ============
    console.log('🔍 Buscando variantes dos produtos...')
    
    const variantsVestidoFloral = await prisma.productVariant.findMany({
      where: { productId: vestidoFloral.id }
    })
    await sleep(100)
    
    const variantsBlusaOmbro = await prisma.productVariant.findMany({
      where: { productId: blusaOmbro.id }
    })
    await sleep(100)
    
    const variantsConjuntoSocial = await prisma.productVariant.findMany({
      where: { productId: conjuntoSocial.id }
    })
    await sleep(100)
    
    const variantsVestidoFesta = await prisma.productVariant.findMany({
      where: { productId: vestidoFesta.id }
    })

    await sleep(500)

    // ============ CRIAÇÃO DE ITENS DO CARRINHO ============
    console.log('🛒 Adicionando itens ao carrinho...')
    
    await prisma.cartItem.create({
      data: {
        userId: mariana.id,
        productId: vestidoFloral.id,
        quantity: 1,
        variantId: variantsVestidoFloral[0].id
      }
    })
    await sleep(100)

    await prisma.cartItem.create({
      data: {
        userId: joao.id,
        productId: conjuntoSocial.id,
        quantity: 1,
        variantId: variantsConjuntoSocial[0].id
      }
    })

    await sleep(500)

    // ============ CRIAÇÃO DE RESERVAS ============
    console.log('📋 Criando reservas...')
    
    await prisma.reservation.create({
      data: {
        productId: vestidoFloral.id,
        buyerId: mariana.id,
        sellerId: ana.id,
        visitDate: new Date('2025-12-20'),
        status: 'pending',
        notes: 'Cliente solicitou provar na loja',
        items: {
          create: {
            variantId: variantsVestidoFloral[0].id,
            quantity: 1
          }
        }
      }
    })
    await sleep(100)

    await prisma.reservation.create({
      data: {
        productId: vestidoFesta.id,
        buyerId: joao.id,
        sellerId: donaMaria.id,
        visitDate: new Date('2025-12-21'),
        status: 'confirmed',
        notes: 'Reserva confirmada para retirada em 24h',
        items: {
          create: {
            variantId: variantsVestidoFesta[0].id,
            quantity: 1
          }
        }
      }
    })

    await sleep(500)

    // ============ CRIAÇÃO DE PEDIDOS ============
    console.log('🎁 Criando pedidos...')
    
    await prisma.order.create({
      data: {
        orderId: '#1001',
        storeId: storeAna.id,
        buyerId: mariana.id,
        sellerId: ana.id,
        total: 89.90,
        status: 'confirmed',
        paymentMethod: 'credit_card',
        addressId: addresses[0].id,
        notes: 'Pedido prioritário',
        items: {
          create: {
            productId: vestidoFloral.id,
            variantId: variantsVestidoFloral[1].id,
            quantity: 1,
            price: 89.90
          }
        }
      }
    })
    await sleep(100)

    await prisma.order.create({
      data: {
        orderId: '#1002',
        storeId: storeMaria.id,
        buyerId: joao.id,
        sellerId: donaMaria.id,
        total: 229.90,
        status: 'in_preparation',
        paymentMethod: 'pix',
        addressId: addresses[1].id,
        items: {
          create: {
            productId: vestidoFesta.id,
            variantId: variantsVestidoFesta[0].id,
            quantity: 1,
            price: 229.90,
            discount: 34.49
          }
        }
      }
    })

    await sleep(500)

    // ============ CRIAÇÃO DE AVALIAÇÕES ============
    console.log('⭐ Criando avaliações...')
    
    await prisma.review.create({
      data: {
        productId: vestidoFloral.id,
        userId: mariana.id,
        rating: 5,
        comment: 'Produto excelente! Chegou rápido e bem embalado.'
      }
    })
    await sleep(100)

    await prisma.review.create({
      data: {
        productId: conjuntoSocial.id,
        userId: joao.id,
        rating: 4,
        comment: 'Ótima qualidade, mas o tamanho foi um pouco apertado.'
      }
    })
    await sleep(100)

    await prisma.review.create({
      data: {
        storeId: storeAna.id,
        userId: mariana.id,
        rating: 5,
        comment: 'Atendimento perfeito! Recomendo!'
      }
    })

    console.log('✅ Seed completo com sucesso!')
  } catch (e) {
    console.error('❌ Erro durante seed:', e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
