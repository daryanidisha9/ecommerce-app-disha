const fs = require('fs');
console.log('FILES:', fs.readdirSync(__dirname));
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv'); 

dotenv.config();

const authRoutes = require('./authroute');
const productRoutes = require('./productroute');
const cartRoutes = require('./cartroute');
const orderRoutes = require('./orderroute');
const paymentRoutes = require('./paymentroute');

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

