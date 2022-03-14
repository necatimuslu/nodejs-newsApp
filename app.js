const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
dotenv = require("dotenv/config");
const app = express();

const userRoutes = require("./router/user");
const linkRoutes = require("./router/link");

app.use(cors());
app.use("*", cors());

app.use(morgan("dev"));
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoutes);
app.use("/link", linkRoutes);

const db = process.env.DB;
mongoose
  .connect(db, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongoDB ye başarılı şekilde bağlanıldı"));
const port = process.env.PORT;
app.listen(port, () =>
  console.log(`nodejs server ${port} portundan ayaklandı`)
);
