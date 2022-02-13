const express = require("express");

const service = require("./service");

const router = express.Router();

router.use("/service", service);

module.exports = router;
