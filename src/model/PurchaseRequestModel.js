const mongoose = require('../config/database');
const Schema = mongoose.Schema;

const PurchaseRequest = new Schema({
  user_name: { type: String, required: true },
  delivery_date: { type: Date, required: true },
  total_amount: { type: Number, required: true},
  purchaseRequestProducts: [{ type: Schema.Types.ObjectId, ref: 'PurchaseRequestProduct' }]
});

module.exports = mongoose.model('PurchaseRequest', PurchaseRequest);