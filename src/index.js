const express = require('express');
const cors = require('cors');
const server = express();
server.use(express.json());
server.use(cors());

const ProductRoutes = require('./routes/ProductRoutes');
const PurchaseRequestRoutes = require('./routes/PurchaseRequestRoutes');
const PurchaseRequestProductRoutes = require('./routes/PurchaseRequestProductRoutes');

server.use('/product', ProductRoutes);
server.use('/purchaseRequest', PurchaseRequestRoutes);
server.use('/purchaseRequestProduct', PurchaseRequestProductRoutes);

server.listen(3000, () => {
    console.log("Api online")
});
