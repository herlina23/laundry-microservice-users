const express = require('express')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')

const { index, show, store, update,  authenticate, destroy } = require('../controllers/user')

router.get('/',index)
router.get('/:id',show)
router.post('/',verifyToken,store)
router.post('/login', authenticate)
router.put('/',verifyToken,update)
router.delete('/:id', verifyToken,destroy)

module.exports = router