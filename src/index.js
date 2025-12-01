require('dotenv').config()
const express = require('express')

const app = express()
const PORT = process.env.PORT || 5001

// rotas
const userRoutes = require('./routes/userRoutes')
const storeRoutes = require('./routes/storeRoutes')
const productRoutes = require('./routes/productRoutes')
const reservationRoutes = require('./routes/reservationRoutes')

app.use(express.json())

app.get('/', (req, res) => res.send({ message: 'Encontrei Backend - API rodando na porta ' + PORT }))

app.use('/users', userRoutes)
app.use('/stores', storeRoutes)
app.use('/products', productRoutes)
app.use('/reservations', reservationRoutes)

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
