// src/models/reservationModel.js
const prisma = require('./prisma')

module.exports = {
  findAll() {
    return prisma.reservation.findMany({
      include: {
        product: {
          include: {
            store: true // <-- ESSENCIAL para pegar sellerId do produto
          }
        },
        buyer: true,
        seller: true,
      }
    })
  },

  findById(id) {
    return prisma.reservation.findUnique({
      where: { id: Number(id) },
      include: {
        product: {
          include: {
            store: true // <-- necessário no GET /reservations/:id também
          }
        },
        buyer: true,
        seller: true,
      }
    })
  },

  create(data) {
    return prisma.reservation.create({
      data,
      include: {
        product: {
          include: {
            store: true // <-- para retornar a loja junto na criação
          }
        },
        buyer: true,
        seller: true,
      }
    })
  },

  update(id, data) {
    return prisma.reservation.update({
      where: { id: Number(id) },
      data,
      include: {
        product: {
          include: {
            store: true // <-- manter consistência
          }
        },
        buyer: true,
        seller: true,
      }
    })
  },

  remove(id) {
    return prisma.reservation.delete({
      where: { id: Number(id) }
    })
  }
}
