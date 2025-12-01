// src/models/storeModel.js
const prisma = require('./prisma')

module.exports = {
  findAll() {
    return prisma.store.findMany({
      include: {
        seller: true,   // usuário dono da loja
        products: true, // produtos da loja
      }
    })
  },

  findById(id) {
    return prisma.store.findUnique({
      where: { id: Number(id) },
      include: {
        seller: true,
        products: true,
      }
    })
  },

  create(data) {
    return prisma.store.create({
      data,
      include: {
        seller: true,
        products: true,
      }
    })
  },

  update(id, data) {
    return prisma.store.update({
      where: { id: Number(id) },
      data,
      include: {
        seller: true,
        products: true,
      }
    })
  },

  remove(id) {
    return prisma.store.delete({
      where: { id: Number(id) }
    })
  }
}