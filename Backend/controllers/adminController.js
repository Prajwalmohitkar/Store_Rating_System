//This is adminController
const pool = require('../db');
const bcrypt = require('bcryptjs');

const getDashboardStats = async (req, res) => {
  try {
    const [userRows] = await pool.execute('SELECT COUNT(*) AS totalUsers FROM users');
    const [storeRows] = await pool.execute('SELECT COUNT(*) AS totalStores FROM stores');
    const [ratingRows] = await pool.execute('SELECT COUNT(*) AS totalRatings FROM ratings');

    const stats = {
      totalUsers: userRows[0].totalUsers,
      totalStores: storeRows[0].totalStores,
      totalRatings: ratingRows[0].totalRatings,
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const addStore = async (req, res) => {
  const { name, address, ownerEmail } = req.body;
  try {
    const [ownerRows] = await pool.execute(
      'SELECT id FROM users WHERE email = ? AND role_id = (SELECT id FROM roles WHERE role_name = "Store Owner")',
      [ownerEmail]
    );
    if (ownerRows.length === 0) {
      return res.status(400).json({ message: 'Owner with specified email and role not found' });
    }
    const ownerId = ownerRows[0].id;

    await pool.execute(
      'INSERT INTO stores (name, address, owner_id) VALUES (?, ?, ?)',
      [name, address, ownerId]
    );
    res.status(201).json({ message: 'Store added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const addUpdateUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  try {
    const [existingUser] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [roleRows] = await pool.execute('SELECT id FROM roles WHERE role_name = ?', [role]);
    const roleId = roleRows[0].id;

    await pool.execute(
      'INSERT INTO users (name, email, password, address, role_id) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, roleId]
    );
    res.status(201).json({ message: 'User added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllStoresAdmin = async (req, res) => {
  try {
    const [stores] = await pool.execute(
      `SELECT s.id, s.name, s.address, u.name AS owner_name, AVG(r.rating) AS overall_rating
       FROM stores s
       JOIN users u ON s.owner_id = u.id
       LEFT JOIN ratings r ON s.id = r.store_id
       GROUP BY s.id, s.name, s.address, u.name`
    );
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  const { search = '' } = req.query;
  const searchTerm = `%${search}%`;

  try {
    let query = `
      SELECT u.id, u.name, u.email, u.address, r.role_name AS role,
      (SELECT AVG(r2.rating) FROM ratings r2 WHERE r2.store_id = s.id) AS ratings
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN stores s ON u.id = s.owner_id
    `;
    const params = [];

    if (search) {
      query += ` WHERE u.name LIKE ? OR u.email LIKE ? OR u.address LIKE ? OR r.role_name LIKE ?`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    query += ` GROUP BY u.id, u.name, u.email, u.address, r.role_name, s.id`;
    
    const [users] = await pool.execute(query, params);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getDashboardStats, addStore, addUpdateUser, getAllStoresAdmin, getAllUsers };
