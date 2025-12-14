const express = require("express");
const router = express.Router();
const productService = require("../services/productService");

// CREATE
router.post("/", async (req, res) => {
  try {
    const product = await productService.create(req.body);
    return res.status(201).json(product);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// SEARCH 
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

// LIST
router.get("/", async (req, res) => {
  try {
    const products = await productService.getAll();
    return res.json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET BY ID
router.get("/:id", async (req, res) => {
  try {
    const product = await productService.getById(req.params.id);
    return res.json(product);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const product = await productService.update(req.params.id, req.body);
    return res.json(product);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// DELETE 
router.delete("/:id", async (req, res) => {
  try {
    await productService.delete(req.params.id);
    return res.json({ message: "Produto removido com sucesso" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;
