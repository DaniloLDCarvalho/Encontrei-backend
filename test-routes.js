/**
 * Testes das Rotas do Backend Encontrei
 * Executar com: node test-routes.js
 */

const http = require('http')

const BASE_URL = 'http://localhost:5000'

// Cores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
}

function log(color, text) {
  console.log(`${colors[color]}${text}${colors.reset}`)
}

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path)
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const req = http.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: data ? JSON.parse(data) : null,
          })
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: data,
          })
        }
      })
    })

    req.on('error', reject)

    if (body) {
      req.write(JSON.stringify(body))
    }
    req.end()
  })
}

async function runTests() {
  log('blue', '\n=== TESTES DAS ROTAS DO BACKEND ===\n')

  let passed = 0
  let failed = 0

  // ============ TESTE: Health Check ============
  try {
    log('yellow', '📍 GET /')
    const res = await makeRequest('GET', '/')
    if (res.status === 200) {
      log('green', `✓ Status: ${res.status} - ${res.body.message}`)
      passed++
    } else {
      log('red', `✗ Status: ${res.status}`)
      failed++
    }
  } catch (err) {
    log('red', `✗ Erro: ${err.message}`)
    failed++
  }

  // ============ TESTE: Listar Users ============
  try {
    log('yellow', '📍 GET /users')
    const res = await makeRequest('GET', '/users')
    if (res.status === 200 && Array.isArray(res.body)) {
      log('green', `✓ Status: ${res.status} - ${res.body.length} usuários encontrados`)
      passed++
    } else {
      log('red', `✗ Status: ${res.status}`)
      failed++
    }
  } catch (err) {
    log('red', `✗ Erro: ${err.message}`)
    failed++
  }

  // ============ TESTE: Get User por ID ============
  try {
    log('yellow', '📍 GET /users/13')
    const res = await makeRequest('GET', '/users/13')
    if (res.status === 200) {
      log('green', `✓ Status: ${res.status} - Usuário: ${res.body.name}`)
      passed++
    } else if (res.status === 404) {
      log('yellow', `⚠ Status: ${res.status} - Usuário não encontrado`)
      passed++
    } else {
      log('red', `✗ Status: ${res.status}`)
      failed++
    }
  } catch (err) {
    log('red', `✗ Erro: ${err.message}`)
    failed++
  }

  // ============ TESTE: Listar Stores ============
  try {
    log('yellow', '📍 GET /stores')
    const res = await makeRequest('GET', '/stores')
    if (res.status === 200 && Array.isArray(res.body)) {
      log('green', `✓ Status: ${res.status} - ${res.body.length} lojas encontradas`)
      passed++
    } else {
      log('red', `✗ Status: ${res.status}`)
      failed++
    }
  } catch (err) {
    log('red', `✗ Erro: ${err.message}`)
    failed++
  }

  // ============ TESTE: Get Store por ID ============
  try {
    log('yellow', '📍 GET /stores/2')
    const res = await makeRequest('GET', '/stores/2')
    if (res.status === 200) {
      log('green', `✓ Status: ${res.status} - Loja: ${res.body.name}`)
      passed++
    } else if (res.status === 404) {
      log('yellow', `⚠ Status: ${res.status} - Loja não encontrada`)
      passed++
    } else {
      log('red', `✗ Status: ${res.status}`)
      failed++
    }
  } catch (err) {
    log('red', `✗ Erro: ${err.message}`)
    failed++
  }

  // ============ TESTE: Listar Products ============
  try {
    log('yellow', '📍 GET /products')
    const res = await makeRequest('GET', '/products')
    if (res.status === 200 && Array.isArray(res.body)) {
      log('green', `✓ Status: ${res.status} - ${res.body.length} produtos encontrados`)
      passed++
    } else {
      log('red', `✗ Status: ${res.status}`)
      failed++
    }
  } catch (err) {
    log('red', `✗ Erro: ${err.message}`)
    failed++
  }

  // ============ TESTE: Get Product por ID ============
  try {
    log('yellow', '📍 GET /products/1')
    const res = await makeRequest('GET', '/products/1')
    if (res.status === 200) {
      log('green', `✓ Status: ${res.status} - Produto: ${res.body.name}`)
      passed++
    } else if (res.status === 404) {
      log('yellow', `⚠ Status: ${res.status} - Produto não encontrado`)
      passed++
    } else {
      log('red', `✗ Status: ${res.status}`)
      failed++
    }
  } catch (err) {
    log('red', `✗ Erro: ${err.message}`)
    failed++
  }

  // ============ TESTE: Listar Reservations ============
  try {
    log('yellow', '📍 GET /reservations')
    const res = await makeRequest('GET', '/reservations')
    if (res.status === 200 && Array.isArray(res.body)) {
      log('green', `✓ Status: ${res.status} - ${res.body.length} reservas encontradas`)
      passed++
    } else {
      log('red', `✗ Status: ${res.status}`)
      failed++
    }
  } catch (err) {
    log('red', `✗ Erro: ${err.message}`)
    failed++
  }

  // ============ TESTE: Get Reservation por ID ============
  try {
    log('yellow', '📍 GET /reservations/1')
    const res = await makeRequest('GET', '/reservations/1')
    if (res.status === 200) {
      log('green', `✓ Status: ${res.status}`)
      passed++
    } else if (res.status === 404) {
      log('yellow', `⚠ Status: ${res.status} - Reserva não encontrada`)
      passed++
    } else {
      log('red', `✗ Status: ${res.status}`)
      failed++
    }
  } catch (err) {
    log('red', `✗ Erro: ${err.message}`)
    failed++
  }

  // ============ TESTE: Create Product ============
  try {
    log('yellow', '📍 POST /products')
    const newProduct = {
      storeId: 2,  // Usar store ID existente
      name: 'Teste Produto',
      description: 'Produto de teste',
      category: 'Teste',
      price: 99.99,
      stock: 10,
    }
    const res = await makeRequest('POST', '/products', newProduct)
    if (res.status === 201) {
      log('green', `✓ Status: ${res.status} - Produto criado: ${res.body.name}`)
      passed++
    } else {
      log('red', `✗ Status: ${res.status} - ${res.body.error}`)
      failed++
    }
  } catch (err) {
    log('red', `✗ Erro: ${err.message}`)
    failed++
  }

  // ============ TESTE: Update Product ============
  try {
    log('yellow', '📍 PUT /products/1')
    const updateData = {
      name: 'Produto Atualizado',
      price: 199.99,
    }
    const res = await makeRequest('PUT', '/products/1', updateData)
    if (res.status === 200) {
      log('green', `✓ Status: ${res.status} - Produto atualizado`)
      passed++
    } else if (res.status === 404) {
      log('yellow', `⚠ Status: ${res.status} - Produto não encontrado`)
      passed++
    } else {
      log('red', `✗ Status: ${res.status}`)
      failed++
    }
  } catch (err) {
    log('red', `✗ Erro: ${err.message}`)
    failed++
  }

  // ============ TESTE: Create Reservation ============
  try {
    log('yellow', '📍 POST /reservations')
    const newReservation = {
      productId: 1,
      buyerId: 13,
      visitDate: new Date().toISOString(),
      notes: 'Teste de reserva',
    }
    const res = await makeRequest('POST', '/reservations', newReservation)
    if (res.status === 201) {
      log('green', `✓ Status: ${res.status} - Reserva criada`)
      passed++
    } else {
      log('red', `✗ Status: ${res.status} - ${res.body.error}`)
      failed++
    }
  } catch (err) {
    log('red', `✗ Erro: ${err.message}`)
    failed++
  }

  // ============ RESUMO ============
  log('blue', '\n=== RESUMO ===')
  log('green', `✓ Testes aprovados: ${passed}`)
  log('red', `✗ Testes falhados: ${failed}`)
  log('blue', `Total: ${passed + failed}\n`)

  if (failed === 0) {
    log('green', '🎉 Todos os testes passaram!')
  } else {
    log('red', `⚠ ${failed} teste(s) falharam`)
  }
}

// Delay para dar tempo do servidor iniciar
setTimeout(() => {
  runTests().catch((err) => {
    log('red', `Erro ao executar testes: ${err.message}`)
    process.exit(1)
  })
}, 2000)
