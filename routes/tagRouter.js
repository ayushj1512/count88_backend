const express = require('express');
const {
  getTags,
  createTag,
  deleteTag,
} = require('../controllers/tagsController');

const router = express.Router();

router.get('/', getTags);
router.post('/', createTag);
router.delete('/:id', deleteTag);

module.exports = router;
