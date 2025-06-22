const express = require('express');
const router = express.Router();

const {
  createQuery,
  getAllQueries,
  updateQueryStatus,
} = require('../controllers/queryController');

// POST: Submit a new query
router.post('/', createQuery);

// GET: Get all queries
router.get('/', getAllQueries);

// PATCH: Update query status by ID
router.patch('/:id/status', updateQueryStatus);

module.exports = router;
