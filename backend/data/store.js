const users = [
  {
    id: 'admin-1',
    email: 'admin@admin.com',
    first_name: 'Admin',
    last_name: 'User',
    // пароль: Admin123!
    password: '$2b$10$cD3jgsSSNpd59SVmHRWHT.hRcBTwuxUg8gAv5rH1sOvhqPAYXPsY.',
    role: 'admin',
  },
];
const products = [
  {
    id: '1',
    title: 'Ноутбук',
    category: 'Электроника',
    description: 'Мощный ноутбук',
    price: 120000,
  },
  {
    id: '2',
    title: 'Книга',
    category: 'Книги',
    description: 'Полезная книга',
    price: 1500,
  },
];

const refreshTokens = new Set();

module.exports = { users, products, refreshTokens };