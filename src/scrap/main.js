import puppeteer from "puppeteer";
import fs from "fs";
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
      let array = value;
      const getRandomObjects = (arr, num = 3) => {
        const shuffled = arr.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
      };
      let values = getRandomObjects(array);
      console.log("here are values==================>>>>", values);
      for (const searchItem of values) {
        console.log(`🌍 Navigating to: ${searchItem.url}`);

        await page.goto(searchItem.url, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });
        let allProducts = new Set();
        let lastScrollHeight = 0;
        while (true) {
          // const productNames = await page.evaluate(() => {
          //   return Array.from(document.querySelectorAll(".e-xahufp")).map(
          //     (el) => el.textContent.trim()
          //   );
          // });
          // console.log(`productNames`,productNames);
          //    const productDivs = await page.evaluate(() => {
          //   return Array.from(document.querySelectorAll(".e-13udsys")).map(el => el.outerHTML);
          // });
          // console.log(`🧱 .e-13udsys elements found:`, productDivs.length);
          // console.log(productDivs.slice(0, 3)); // Preview first 3
          const products = await page.evaluate(() => {
            function parseSrcset(srcset) {
              // This regex matches URLs with optional descriptors like '1.5x' ignoring commas inside parentheses
              const regex =
                /([^,\s]+?\([^)]*?\)[^,\s]*|[^,\s]+)(?:\s+[0-9\.]+x)?/g;
              const matches = [];
              let match;
              while ((match = regex.exec(srcset)) !== null) {
                matches.push(match[1]);
              }
              return matches;
            }

            return Array.from(
              document.querySelectorAll('[aria-label="Product"]')
            ).map((product) => {
              const nameEl =
                product.querySelector(".e-xahufp") ||
                product.querySelector("h2") ||
                product.querySelector("a");
              const name = nameEl ? nameEl.textContent.trim() : null;

              const priceEl = product.querySelector(".e-1ip314g");
              const price = priceEl ? priceEl.textContent.trim() : null;

              const img = product.querySelector("img");
              let imageUrls = [];
              if (img) {
                const srcset = img.getAttribute("srcset");
                if (srcset) {
                  imageUrls = parseSrcset(srcset).slice(0, 2);
                } else if (img.src) {
                  imageUrls = [img.src];
                }
              }

              return {
                name,
                price,
                imageOne: imageUrls[0] || null,
                imageTwo: imageUrls[1] || null,
              };
            });
          });

          const cleanedData = products.map((item) => {
            // Extract a more readable name (basic example)
            let name = item.name || "";
            // Remove price info and "Current price" prefix from name
            name = name
              .replace(/Current price:\s*\$\d+\.\d+|\$\d+/g, "")
              .trim();

            // Format price — insert dot before last 2 digits
            let price = item.price || "";
            if (/^\$\d+$/.test(price)) {
              const numeric = price.replace("$", "");
              price = `$${numeric.slice(0, -2)}.${numeric.slice(-2)}`;
            }

            return {
              name,
              price,
              imageOne: item.imageOne,
              imageTwo: item.imageTwo,
            };
          });

          // console.log(cleanedData);
          // const dataToWrite = JSON.stringify(products, null, 2);
          // fs.appendFile("products.txt", dataToWrite + "\n", (err) => {
          //   if (err) {
          //     console.error("Error appending to file", err);
          //   } else {
          //     console.log("✅ Data appended to products.txt");
          //   }
          // });

          cleanedData.forEach((item) => allProducts.add(item));
          // console.log("🛒 Scraped Products (so far):", Array.from(allProducts));
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
            name: item.name,
            price: item.price,
            imageOne: item.imageOne,
            imageTwo: item.imageTwo,
            categoryName: searchItem?.category,
            // productName: item,
            subcategoryName: searchItem?.subcategory,
          };
        });
        console.log(`result========>`, result);
        // await saveCategorySubCategory(result);
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
