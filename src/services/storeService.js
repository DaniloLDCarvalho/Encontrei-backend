// src/services/storeService.js
const storeModel = require('../models/storeModel')
const prisma = require('../models/prisma')

module.exports = {
  // Lista todas as lojas
  listStores: () => storeModel.findAll(),

  // Cria uma nova loja
  async createStore(data) {
    // 1) validar se o vendedor existe
    const seller = await prisma.user.findUnique({
      where: { id: Number(data.sellerId) }
    })

    if (!seller) {
      throw new Error('Vendedor (sellerId) não encontrado')
    }

    // 2) criar loja
    return storeModel.create({
      sellerId: Number(data.sellerId),
      name: data.name,
      cpfCnpj: data.cpfCnpj,
      segment: data.segment,
      distance: data.distance
    })
  },

  // Busca loja por ID
  async getById(id) {
    const store = await storeModel.findById(id)
    if (!store) throw new Error('Loja não encontrada')
    return store
  },

  // Atualiza loja
  async updateStore(id, data) {
    const existing = await storeModel.findById(id)
    if (!existing) throw new Error('Loja não encontrada')

    const updates = {}

    if (data.name !== undefined) updates.name = data.name
    if (data.cpfCnpj !== undefined) updates.cpfCnpj = data.cpfCnpj
    if (data.segment !== undefined) updates.segment = data.segment
    if (data.distance !== undefined) updates.distance = data.distance

    // Se quiser permitir trocar o seller da loja:
    if (data.sellerId !== undefined) {
      const seller = await prisma.user.findUnique({
        where: { id: Number(data.sellerId) }
      })
      if (!seller) {
        throw new Error('Novo vendedor (sellerId) não encontrado')
      }
      updates.sellerId = Number(data.sellerId)
    }

    return storeModel.update(id, updates)
  },

  // Remove loja
  async deleteStore(id) {
    try {
      return await storeModel.remove(id)
    } catch (error) {
      const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library')
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new Error('Não é possível remover: existem recursos vinculados à loja.')
      }
      throw error
    }
  }
}