const express = require('express')
const router = express.Router()
const reservationService = require('../services/reservationService')

router.get('/', async (req, res) => {
  try {
    const reservations = await reservationService.listReservations()
    res.json(reservations)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { productId, buyerId, date, note } = req.body
    if (!productId || !buyerId || !date) return res.status(400).json({ error: 'productId, buyerId e date são obrigatórios' })

    const reservation = await reservationService.createReservation({ productId, buyerId, date, note })
    res.status(201).json(reservation)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const reservation = await reservationService.getById(req.params.id)
    res.json(reservation)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const reservation = await reservationService.updateReservation(req.params.id, req.body)
    res.json(reservation)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await reservationService.deleteReservation(req.params.id)
    res.json({ message: 'Reserva removida com sucesso' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
