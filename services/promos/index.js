const app = require("express")();
const Promo = require("./controller")
const cors = require("cors");
const bodyParser = require("body-parser"); 

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

app.use("/promo",Promo);

app.listen(PORT, () => console.log(`*** Promo *** service running on ${PORT}`));