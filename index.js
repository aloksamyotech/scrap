import express from "express";
import cors from 'cors'
import 'dotenv/config'
import { scrapeInstacart } from "./src/scrap/main.js";
import connectDB from "./src/helper/db.js";
import { findOtpNumber, getRawData } from "./src/helper/helper.js";
import { Auth } from "./src/helper/model.js";
import { data, extractImageUrls } from "./src/helper/test.js";
import cron from "node-cron";
const app = express();
const PORT = (() => {
  const env = process.env.ENV;
  return env === "development" ? 7200 : 4545;
})();

app.use(express.json());
app.use(cors());
connectDB()
app.get('/alok', async (req, res) => {
  const searchURL = "https://www.instacart.com/login?next=%2Fstore%2F%3FcategoryFilter%3DhomeTabForYou";
  const data = await scrapeInstacart(searchURL);
  res.send(data)
})

app.get("/test",async (req,res)=>{
  const response = extractImageUrls(data)
  res.send(response)
})
// findOtpNumber()
app.listen(PORT, () => {
  console.info(`Server is running at port ${PORT}`);
});
