const router = require("express").Router(); 
module.exports = router; 

router.use("/auth", require("./auth")); 
router.use("/users", require("./users"));
router.use("/recipes", require("./recipes"));
router.use("/comments", require("./comments"));