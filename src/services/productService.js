// src/services/productService.js
const productModel = require("../models/productModel");
const { PrismaClientKnownRequestError } = require("@prisma/client/runtime/library");
const { spawn } = require("child_process");

module.exports = {
  async create(data) {
    if (!data.name || !data.storeId) {
      throw new Error("Nome e storeId são obrigatórios.");
    }

    return productModel.create(data);
  },

  async getAll() {
    return productModel.findAll();
  },

  async getById(id) {
    const product = await productModel.findById(id);
    if (!product) throw new Error("Produto não encontrado");
    return product;
  },

  async update(id, data) {
    const existing = await productModel.findById(id);
    if (!existing) throw new Error("Produto não encontrado");
    return productModel.update(id, data);
  },

  async delete(id) {
    try {
      return await productModel.remove(id);
    } catch (error) {
      // Se o delete falhar por foreign key (reservas)
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2003") {
        throw new Error("Não é possível remover: o produto possui reservas vinculadas.");
      }
      throw error;
    }
  }
};

buscarProdutos: async (query) => {
  const products = await productModel.findAll();

  const produtosEngine = products.map((p) => {
    const tamanhos = (p.sizes || "")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    return {
      id: p.id,
      categoria: (p.category || "").toLowerCase(),
      cor: (p.colors || "").toLowerCase(),
      tamanhos,
      texto: `${p.name}, categoria ${p.category}, cores ${p.colors}, tamanhos ${p.sizes}`,
    };
  });

  const payload = JSON.stringify({
    query,
    produtos: produtosEngine,
  });

  // Inicia o codigo Python
  const result = await new Promise((resolve, reject) => {
    const pythonProcess = spawn("python3", ["search_engine.py"]);

    let stdoutData = "";
    let stderrData = "";

    pythonProcess.stdin.write(payload);
    
    pythonProcess.stdin.end();

    pythonProcess.stdout.on("data", (chunk) => {
      stdoutData += chunk.toString();
    });

    pythonProcess.stderr.on("data", (chunk) => {
      stderrData += chunk.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderrData));
      }

      try {
        resolve(JSON.parse(stdoutData));
      } catch (e) {
        reject(new Error("Resposta inválida do Python"));
      }
    });
  });

  return result;
},


