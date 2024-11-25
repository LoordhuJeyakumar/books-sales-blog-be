import mongoose from "mongoose";
import app from "./app.js";

const port = process.env.PORT || 3333;

/* const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
) */

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log(`connected to db `))
  .catch((e) => console.log(e));

app.listen(port, () => {
  console.log(`Express server is running at http://localhost:${port}`);
});
