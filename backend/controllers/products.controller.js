const { v4: uuidv4 } = require('uuid');
const { products } = require('../data/store');

// Получить все товары
exports.getAllProducts = (req, res) => {
  res.status(200).json(products);
};

// Получить товар по ID
exports.getProductById = (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.status(200).json(product);
};

// Создать товар
exports.createProduct = (req, res) => {
  const { title, category, description, price } = req.body;
  if (!title || !category || !price) {
    return res.status(400).json({ message: 'Title, category, and price are required' });
  }

  const newProduct = {
    id: uuidv4(),
    title,
    category,
    description: description || '',
    price: Number(price),
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
};

// Обновить товар
exports.updateProduct = (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const { title, category, description, price } = req.body;
  const product = products[productIndex];

  // Обновляем поля, если они переданы
  product.title = title || product.title;
  product.category = category || product.category;
  product.description = description || product.description;
  product.price = price !== undefined ? Number(price) : product.price;

  products[productIndex] = product;
  res.status(200).json(product);
};

// Удалить товар
exports.deleteProduct = (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products.splice(productIndex, 1);
  res.status(204).send();
};