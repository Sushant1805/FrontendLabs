const express = require('express')
const router = express.Router()
const {createSubmission,getSubmission} = require('../Controllers/submission-controller')

router.post('/',createSubmission)
router.get('/:userId/:problemId',getSubmission)

module.exports = router