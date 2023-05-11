const express = require("express");
const { connectDb } = require("./config/dbConnection");
const { errorHandler } = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;
connectDb();
app.use(express.json());
app.use("/api/contacts", require("./routes/contactRoutes")); //middleware
app.use("/api/users", require("./routes/userRoutes")); //middleware
app.use(errorHandler);
// app.get("/api/contacts",(req,res) =>{
//     res.status(200).json({message : "Get all contacts"})
// })
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
