/* General variables */
const PORT = 4000;
const path = require("node:path");

const express = require("express");
const app = express();

const routes = require("./routes/default");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.use(routes);


app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`Server started at port: ${PORT}`)
})