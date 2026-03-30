const express = require('express');
const router = express.Router();
const controller = require('../controllers/products.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

// Маршруты, доступные всем
router.get('/', controller.getAllProducts);
router.get('/:id', controller.getProductById);

// Маршруты, требующие аутентификации и определенных ролей
router.post('/', authMiddleware, roleMiddleware(['admin', 'seller']), controller.createProduct);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'seller']), controller.updateProduct);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), controller.deleteProduct);

module.exports = router;