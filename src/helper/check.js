import puppeteer from "puppeteer";
import {
  findOtpNumber,
  generateNewURL,
  getRandomWebsites,
  getRawData,
  postProductData,
} from "../helper/helper.js";
import { Auth } from "../helper/model.js";
import { extractImageUrls } from "../helper/test.js";
import { response } from "express";
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
    // await page.goto("https://www.instacart.com/store/razco-foods-supermarket/collections/dairy");
    // await new Promise(resolve => setTimeout(resolve, 100000));
    const dummyScrap = async () => {
      const dummyPages = getRandomWebsites();
      for (const item of dummyPages) {
        try {
          console.log(`🌍 Navigating to: ${item}`);
          await page.goto(item, {
            waitUntil: "domcontentloaded",
            timeout: 60000,
          });
          await new Promise((resolve) => setTimeout(resolve, 5000));
        } catch (error) {
          console.warn(`⚠️ Warning: Skipping ${item} due to timeout.`);
        }
      }
    };

    const newScrap = async (num = 0) => {
      const values = [
        {
          category: "dairy",
          url: "https://www.instacart.com/store/razco-foods-supermarket/collections/dairy",
        },
      ];

      for (const searchItem of values) {
        console.log(`🌍 Navigating to: ${searchItem.url}`);
        await page.goto(searchItem.url, { waitUntil: "domcontentloaded", timeout: 60000 });

        // Wait for product elements to appear
        await page.waitForSelector(".e-147kl2c", { timeout: 10000 });

        // Extract product names
        const productNames = await page.evaluate(() => {
          return Array.from(document.querySelectorAll(".e-147kl2c")).map((el) => el.textContent.trim());
        });

        console.log("🛒 Scraped Products:", productNames);

        // You can now process the scraped data, such as saving it to a database
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


