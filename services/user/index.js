const app = require("express")();
const User = require("./controller")
const cors = require("cors");
const bodyParser = require("body-parser"); 

const PORT = process.env.PORT || 4001

app.use(cors());
app.use(bodyParser.json());

app.use("/user",User);

app.listen(PORT, () => console.log(`*** User *** service running on ${PORT}`));