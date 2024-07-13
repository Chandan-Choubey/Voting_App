import dotenv from "dotenv";
import { app } from "./app.js";
import connectDb from "./src/db/index.js";

dotenv.config({ path: "./.env" });

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

connectDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Error: " + err);
  });
