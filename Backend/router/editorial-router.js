const express = require('express')
const router = express.Router()
const {createEditorial,getEditorialByProblemId,
  updateEditorial,
  deleteEditorial} = require('../Controllers/editorial-controller')

router.post('/',createEditorial);
router.get('/:problemId',getEditorialByProblemId);
router.put('/:problemId',updateEditorial);
router.delete('/:problemId',deleteEditorial);

module.exports = router