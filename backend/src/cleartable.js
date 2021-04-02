const express = require('express');
const router = express.Router();


// get latest rate
router.get('/', (req, res) => {
  res.send('clear the table')
});


module.exports = router;