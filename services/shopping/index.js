const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const Shop = require("./controller");

const PORT = process.env.PORT || 4003;

const app = express();
app.use(cors());
app.use(bodyParser.json({limit: '500mb'}));

app.use("/shop",Shop);

app.listen(PORT, () => console.log(`*** Shopping cart is running on ${PORT} ***`));
