const productModel = require('../models/productModel');
const { spawn } = require("child_process");

module.exports = {
  listProducts: () => productModel.findAllWithStore(),

  getProduct: (id) => productModel.findById(id),

  createProduct: (data) => productModel.create(data),

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
};
