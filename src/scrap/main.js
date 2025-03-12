import puppeteer from "puppeteer";
import {
  findOtpNumber,
  generateNewURL,
  getRandomWebsites,
  getRawData,
  postProductData,
  saveCategorySubCategory,
} from "../helper/helper.js";
import { Auth } from "../helper/model.js";
import { extractImageUrls } from "../helper/test.js";
import { response } from "express";
import { value } from "../helper/values.js";

export async function scrapeInstacart(searchURL) {
  console.log(`🚀 Launching Puppeteer to scrape: ${searchURL}`);
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
      ],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    page.setDefaultNavigationTimeout(60000);
    const newScrap = async (num = 0) => {
      let array = value
      const getRandomObjects = (arr, num = 3) => {
        const shuffled = arr.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
      };
      let values = getRandomObjects(array)
      console.log("here are values==================>>>>",values)
      for (const searchItem of values) {
        console.log(`🌍 Navigating to: ${searchItem.url}`);
        await page.goto(searchItem.url, { waitUntil: "domcontentloaded", timeout: 60000 });
        let allProducts = new Set();
        let lastScrollHeight = 0;
        while (true) {
          const productNames = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".e-147kl2c")).map((el) => el.textContent.trim());
          });
          productNames.forEach((item) => allProducts.add(item));
          console.log("🛒 Scraped Products (so far):", Array.from(allProducts));
          let newScrollHeight = await page.evaluate(() => {
            window.scrollBy(0, window.innerHeight);
            return document.body.scrollHeight;
          });
          await new Promise((resolve) => setTimeout(resolve, 1500));
          if (newScrollHeight === lastScrollHeight) {
            console.log("✅ Reached the bottom of the page. Stopping...");
            break;
          }
          lastScrollHeight = newScrollHeight;
        }
        const result = Array.from(allProducts).map((item) => {
          return {
            categoryName: searchItem?.category,
            productName: item,
            subcategoryName: searchItem?.subcategory
          };
        });
        await saveCategorySubCategory(result)
      }
    };


    while (true) {
      await newScrap();
    }
  } catch (error) {
    console.error("❌ Error during scraping:", error);
  } finally {
    console.log("🔴 Closing Puppeteer...");
    await Auth.updateOne({ otp: 0 });
  }
}


