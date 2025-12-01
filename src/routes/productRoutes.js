const express = require('express')
const router = express.Router()
const productService = require('../services/productService')

router.get('/', async (req, res) => {
  try {
    const products = await productService.listProducts()
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/*
router.get('/:id', async (req, res) => {
  try {
    const product = await productService.getProduct(req.params.id)
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
*/

router.get("/buscar", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Parâmetro q é obrigatório" });
  }

  try {
    const result = await productService.buscarProdutos(query);
    return res.json(result);
  } catch (err) {
    console.error("Erro:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router
