const express = require("express");
const { fetchAllData } = require("../controllers/dataController");

const router = express.Router();

router.route("/get-all").get(fetchAllData);


module.exports = router;