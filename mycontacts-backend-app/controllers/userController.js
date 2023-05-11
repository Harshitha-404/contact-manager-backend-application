const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//@desc = Register the user
//@route = POST /api/users/register
//@access public

const registeredUser = asyncHandler(async (req, res) => {
  console.log(req.body, "req.body---------");
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const userdetails = await User.findOne({ email });
  console.log(userdetails, "userdetails======");
  if (userdetails) {
    res.status(400);
    throw new Error("User already present.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword, "hashedPassword------");

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  console.log(user, "user----");
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data not valid");
  }
  res.json({ message: "Register the user" });
});

//@desc = login the user
//@route = POST /api/users/login
//@access public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(404);
    throw new Error("All fields are mandatory");
  }

  const user = await User.findOne({ email });
  //compare user password with the hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Email or Password is not valid");
  }

  // res.json({ message: "Login the user" });
});

//@desc = get the current user
//@route = get /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registeredUser, loginUser, currentUser };
