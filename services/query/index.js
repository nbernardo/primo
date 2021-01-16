const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const QueryController = require("./controller");

const PORT = process.env.PORT || 4004;
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/query", QueryController)

app.listen(PORT, () => console.log(`*** Query Service running on ${PORT}`));