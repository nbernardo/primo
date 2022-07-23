const app = require("express")();
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT || 4002;

app.use(fileUpload({
    createParentPath: true,
}))
app.use(bodyParser.json({limit: '25mb'}));
app.use(require("cors")());
app.use("/catalog", require("./controller"));

app.listen(PORT, () => console.log(`** Catalog Service ** is running on ${PORT}`));