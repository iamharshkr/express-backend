const express = require("express");
const { fetchEthBalance } = require("../controllers/web3Controller");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/balance/:address").get(isAuthenticatedUser, fetchEthBalance);

module.exports = router;
