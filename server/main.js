require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ENV } = require("./src/constants/config");
const app = express();


const { authRoutes } = require("./src/routes/index");

app.use('/api/auth', authRoutes);
app.use(cors());
app.use(express.json())

app.listen(ENV.PORT, () => {
 console.log(`server is running on ${ENV.PORT} port`);
}); 