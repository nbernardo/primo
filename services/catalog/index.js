const app = require("express")();
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 4002;

app.use(bodyParser.json());
app.use(require("cors")());
app.use("/catalog", require("./controller"));

app.listen(PORT, () => console.log(`** Catalog Service ** is running on ${PORT}`));