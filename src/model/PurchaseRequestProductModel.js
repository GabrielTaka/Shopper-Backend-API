const mongoose = require('../config/database');
const ProductModel = require('./ProductModel');
const Schema = mongoose.Schema;

const PurchaseRequestProductSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    purchaseRequest: { type: Schema.Types.ObjectId, ref: 'PurchaseRequest' },
    quantity: { type: Number, required: true},
    amount_of_product: { type: Number, required: true},
    
});

module.exports = mongoose.model('PurchaseRequestProduct', PurchaseRequestProductSchema);