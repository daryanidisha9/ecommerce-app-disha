const db = require('./db');

// ✅ GET /api/products - Smart Search with filters, category, sort, pagination
exports.getAllProducts = async (req, res) => {
  let { page = 1, limit = 100, category, sort, priceMin, priceMax, search } = req.query;

  try {
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (search) {
      const lowerSearch = search.toLowerCase();
      const keyword = `%${lowerSearch}%`;

      const isBoy = lowerSearch.includes("boy");
      const isGirl = lowerSearch.includes("girl");
      const isTshirt = lowerSearch.includes("tshirt") || lowerSearch.includes("t-shirt") || lowerSearch.includes("tee");

      if (isTshirt) {
        query += ' AND LOWER(subcategory) = ?';
        params.push("tshirts");
      }

      if (isBoy) {
        query += ' AND LOWER(category) = ?';
        params.push("boys");
      }

      if (isGirl) {
        query += ' AND LOWER(category) = ?';
        params.push("girls");
      }

      // Fallback generic search if no match keywords
      if (!isBoy && !isGirl && !isTshirt) {
        query += `
          AND (
            LOWER(name) LIKE ? OR
            LOWER(subcategory) LIKE ? OR
            LOWER(category) LIKE ?
          )`;
        params.push(keyword, keyword, keyword);
      }
    }

    if (category && !params.includes(category)) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (priceMin) {
      query += ' AND price >= ?';
      params.push(priceMin);
    }

    if (priceMax) {
      query += ' AND price <= ?';
      params.push(priceMax);
    }

    if (sort === 'price_asc') {
      query += ' ORDER BY price ASC';
    } else if (sort === 'price_desc') {
      query += ' ORDER BY price DESC';
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    console.log("📦 Final SQL:", query);
    console.log("📦 Params:", params);

    const [results] = await db.query(query, params);

    console.log(`✅ Products fetched: ${results.length}`);
    res.json(results);
  } catch (error) {
    console.error('❌ Server/DB error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// ✅ GET /api/products/:id - Get single product by ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM products WHERE id = ?';

  try {
    const [results] = await db.query(query, [id]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(results[0]);
  } catch (err) {
    console.error('❌ DB Error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};
