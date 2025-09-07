const pool = require('../db');

const getAllStores = async (req, res) => {
  const userId = req.user.id;
  const { search = '' } = req.query;
  const searchTerm = `%${search}%`;

  try {
    let query = `
      SELECT s.id, s.name, s.address, s.owner_id, u.name AS owner_name, AVG(r.rating) AS overall_rating, (SELECT rating FROM ratings WHERE user_id = ? AND store_id = s.id) AS submitted_rating
      FROM stores s
      JOIN users u ON s.owner_id = u.id
      LEFT JOIN ratings r ON s.id = r.store_id
    `;
    const params = [userId];

    if (search) {
      query += ` WHERE s.name LIKE ? OR s.address LIKE ?`;
      params.push(searchTerm, searchTerm);
    }

    query += ` GROUP BY s.id, s.name, s.address, s.owner_id`;

    const [stores] = await pool.execute(query, params);
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const rateStore = async (req, res) => {
  const { storeId } = req.params;
  const { rating } = req.body;
  const userId = req.user.id;

  try {
    await pool.execute(
      `INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = ?`,
      [userId, storeId, rating, rating]
    );
    res.status(200).json({ message: 'Rating submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getStoreOwnerDashboard = async (req, res) => {
  const ownerId = req.user.id;
  try {
    const [storeRows] = await pool.execute(
      `SELECT id, name FROM stores WHERE owner_id = ?`,
      [ownerId]
    );

    if (storeRows.length === 0) {
      return res.status(404).json({ message: 'Store not found for this user' });
    }
    const store = storeRows[0];

    const [ratingRows] = await pool.execute(
      `SELECT r.rating, u.name, u.email, u.address
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?`,
      [store.id]
    );

    const averageRating = ratingRows.length > 0
      ? (ratingRows.reduce((sum, r) => sum + r.rating, 0) / ratingRows.length).toFixed(1)
      : 0;

    res.json({ averageRating, ratings: ratingRows });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getAllStores, rateStore, getStoreOwnerDashboard };
