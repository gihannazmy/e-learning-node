const express = require('express');
const router = express.Router();
const {
  createInstructor,
  getInstructors,
  getInstructor,
  updateInstructor,
  deleteInstructor
} = require('../controllers/instructorController');

router.post('/', createInstructor);
router.get('/', getInstructors);
router.get('/:id', getInstructor);
router.put('/:id', updateInstructor);
router.delete('/:id', deleteInstructor);

module.exports = router;