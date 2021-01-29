const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const CommandHandler = require("./controller");

const PORT = process.env.PORT || 4005;
const app = express();

app.use(cors());
app.use(bodyParser.json({limit: '500mb'}));
app.use("/event", CommandHandler);

app.listen(PORT, () => console.log(`*** Command Service *** is running on ${PORT}`));