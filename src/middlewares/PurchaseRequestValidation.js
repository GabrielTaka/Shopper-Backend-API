const PurchaseRequestValidation = async (req, res, next) => {
  const { user_name, delivery_date } = req.body;
  if (!user_name) return res.status(400).json({ error: 'Nome do usuário é obrigatório.' });
  else if (!delivery_date) return res.status(400).json({ error: 'Data de entrega é obrigatória.' });
  else next();
}

module.exports = PurchaseRequestValidation;