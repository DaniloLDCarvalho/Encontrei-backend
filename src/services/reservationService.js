// src/services/reservationService.js
const reservationModel = require('../models/reservationModel')
const productModel = require('../models/productModel')
const prisma = require('../models/prisma') // mesmo prisma que você usa no reservationModel

module.exports = {
  listReservations: () => reservationModel.findAll(),

  async createReservation(data) {
    // 1) validar produto
    const product = await productModel.findById(data.productId)
    if (!product) {
      throw new Error('Produto não encontrado')
    }

    // 2) buscar loja pelo storeId do produto
    const store = await prisma.store.findUnique({
      where: { id: Number(product.storeId) }
    })

    if (!store) {
      throw new Error('Loja associada ao produto não encontrada')
    }

    const sellerId = store.sellerId

    // 3) criar reserva
    return reservationModel.create({
      productId: Number(data.productId),
      buyerId: Number(data.buyerId),
      sellerId,
      date: new Date(data.date),
      status: 'AGUARDANDO_RETIRADA',
      note: data.note || null,
    })
  },

  async getById(id) {
    const reservation = await reservationModel.findById(id)
    if (!reservation) throw new Error('Reserva não encontrada')
    return reservation
  },

  async updateReservation(id, data) {
    const existing = await reservationModel.findById(id)
    if (!existing) throw new Error('Reserva não encontrada')

    const updates = {}
    if (data.status !== undefined) updates.status = data.status
    if (data.date !== undefined) updates.date = new Date(data.date)
    if (data.note !== undefined) updates.note = data.note

    return reservationModel.update(id, updates)
  },

  async deleteReservation(id) {
    try {
      return await reservationModel.remove(id)
    } catch (error) {
      const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library')
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new Error('Não é possível remover: existem recursos vinculados à reserva.')
      }
      throw error
    }
  }
}
