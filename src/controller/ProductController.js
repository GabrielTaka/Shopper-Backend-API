const ProductModel = require("../model/ProductModel");
const csv = require('csv-parser')
const fs = require('fs')

class ProductController {

  async generateDataBase(req, res) {
    const products = [];
    fs.createReadStream('./src/products_ascii.csv')
      .pipe(csv())
      .on('data', (data) => products.push(data))
      .on('end', () => {
        ProductModel.insertMany(products).then((result) => {
          return res.status(200).json(result);
        }).catch((err) => {
          return res.status(500).json(err);
        })
      })
  }

  async all(req, res) { 
    await ProductModel.find({})
    .then((result) => {
        return res.status(200).json(result);
    }).catch((err) => {
        return res.status(500).json(err);           
    });
  }
}

module.exports = new ProductController();