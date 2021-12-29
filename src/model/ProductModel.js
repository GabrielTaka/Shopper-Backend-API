const mongoose = require('../config/database');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    id: { type: Number, required: true},
    name: { type: String, required: true},
    price: { type: Number, required: true},
    qty_stock: { type: Number, required: true},
});

module.exports = mongoose.model('Product', ProductSchema);