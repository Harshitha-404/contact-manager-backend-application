const express = require("express");
//const validateToken = require("../middleware/validateTokenHandler");
const app = express.Router();
const {
  registeredUser,
  loginUser,
  currentUser,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");
app.post("/register", registeredUser);

app.post("/login", loginUser);

app.get("/current", validateToken, currentUser);

module.exports = app;
