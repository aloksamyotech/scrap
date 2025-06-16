// for (const product of products) {
//             if (!product.productUrl) continue;

//             const productPageUrl = `https://www.instacart.com${product.productUrl}`;
//             console.log(`🔗 Visiting product page: ${productPageUrl}`);

//             try {
//               await page.goto(productPageUrl, {
//                 waitUntil: "domcontentloaded",
//                 timeout: 60000,
//               });

//               // Wait for the image carousel to be present
//               await page.waitForSelector(".e-sry5x7 ul.e-grl6el", { timeout: 10000 });

//               // Optional: Wait for detail sections if they exist
//               try {
//                 await page.waitForSelector(".e-1d3w5wq", { timeout: 5000 });
//               } catch (e) {
//                 console.log("ℹ️ Detail sections not found, continuing...");
//               }

//               // 👇 Extract all <img> tags inside <li class="e-1s9gh2j">
//               const productDetail = await page.evaluate(() => {
//                 const imageList = [];

//                 // Go through all <li> elements in the carousel
//                 const liElements = document.querySelectorAll('li.e-1s9gh2j');
//                 liElements.forEach(li => {
//                   const imgs = li.querySelectorAll('img');
//                   imgs.forEach(img => {
//                     const src = img.getAttribute('src');
//                     if (src) imageList.push(src);
//                   });
//                 });

//                 // Also optionally include the main zoomed image
//                 const mainImage = document.querySelector('.ic-image-zoomer img');
//                 if (mainImage && mainImage.getAttribute('src')) {
//                   const mainSrc = mainImage.getAttribute('src');
//                   if (!imageList.includes(mainSrc)) {
//                     imageList.unshift(mainSrc); // Add at beginning
//                   }
//                 }

//                 // Extract detail sections by title
//                 function getSectionText(title) {
//                   const section = Array.from(document.querySelectorAll('.e-1d3w5wq')).find(sec => {
//                     const heading = sec.querySelector('h2');
//                     return heading && heading.textContent.trim().toLowerCase() === title.toLowerCase();
//                   });
//                   if (section) {
//                     return Array.from(section.querySelectorAll('p'))
//                       .map(p => p.textContent.trim())
//                       .join(' ');
//                   }
//                   return null;
//                 }


//                 function getWarningText() {
//                   const section = Array.from(document.querySelectorAll('div')).find(div => {
//                     const h2 = div.querySelector('h2');
//                     return h2 && h2.textContent.trim().toLowerCase() === 'warnings';
//                   });

//                   if (section) {
//                     return Array.from(section.querySelectorAll('p'))
//                       .map(p => p.textContent.trim())
//                       .join(' ');
//                   }
//                   return null;
//                 }

//                 function getSize() {
//                   const sizeEl = document.querySelector('.e-k008qs .e-f17zur');
//                   return sizeEl ? sizeEl.textContent.trim() : null;
//                 }



//                 // Return structured data
//                 return {
//                   allImages: imageList,
//                   details: getSectionText('Details'),
//                   ingredients: getSectionText('Ingredients'),
//                   directions: getSectionText('Directions'),
//                   warnings: getWarningText(),
//                   size: getSize(),
//                 };
//               });

//               // Log and store
//               console.log(`🖼️ Found ${productDetail.allImages.length} images`);
//               console.log(`📝 Extracted detail:`, productDetail);

//               product.allImages = productDetail.allImages;
//               product.detail = productDetail.details;
//               product.ingredients = productDetail.ingredients;
//               product.directions = productDetail.directions;

//             } catch (error) {
//               console.warn(`⚠️ Failed to scrape product page ${productPageUrl}`, error);
//             }

//             // 🕓 Optional delay to avoid rate-limiting
//             await delay(2000);
//           }




export default scrapeProductDetails = async (productUrl, page) => {
    if (!productUrl) throw new Error("No productUrl provided");

    const productPageUrl = `https://www.instacart.com${productUrl}`;
    console.log(`🔗 Visiting product page: ${productPageUrl}`);

    try {
        await page.goto(productPageUrl, {
            waitUntil: "domcontentloaded",
            timeout: 60000,
        });

        // Wait for the image carousel to be present
        await page.waitForSelector(".e-sry5x7 ul.e-grl6el", { timeout: 10000 });

        // Optional: wait for detail sections if they exist
        try {
            await page.waitForSelector(".e-1d3w5wq", { timeout: 5000 });
        } catch {
            console.log("ℹ️ Detail sections not found, continuing...");
        }

        // Extract product details
        const productDetail = await page.evaluate(() => {
            const imageList = [];

            const liElements = document.querySelectorAll('li.e-1s9gh2j');
            liElements.forEach(li => {
                li.querySelectorAll('img').forEach(img => {
                    const src = img.getAttribute('src');
                    if (src) imageList.push(src);
                });
            });

            const mainImage = document.querySelector('.ic-image-zoomer img');
            if (mainImage) {
                const mainSrc = mainImage.getAttribute('src');
                if (mainSrc && !imageList.includes(mainSrc)) {
                    imageList.unshift(mainSrc);
                }
            }

            function getSectionText(title) {
                const section = Array.from(document.querySelectorAll('.e-1d3w5wq')).find(sec => {
                    const heading = sec.querySelector('h2');
                    return heading && heading.textContent.trim().toLowerCase() === title.toLowerCase();
                });
                if (section) {
                    return Array.from(section.querySelectorAll('p'))
                        .map(p => p.textContent.trim())
                        .join(' ');
                }
                return null;
            }

            function getWarningText() {
                const section = Array.from(document.querySelectorAll('div')).find(div => {
                    const h2 = div.querySelector('h2');
                    return h2 && h2.textContent.trim().toLowerCase() === 'warnings';
                });
                if (section) {
                    return Array.from(section.querySelectorAll('p'))
                        .map(p => p.textContent.trim())
                        .join(' ');
                }
                return null;
            }

            function getSize() {
                const sizeEl = document.querySelector('.e-k008qs .e-f17zur');
                return sizeEl ? sizeEl.textContent.trim() : null;
            }

            return {
                allImages: imageList,
                details: getSectionText('Details'),
                ingredients: getSectionText('Ingredients'),
                directions: getSectionText('Directions'),
                warnings: getWarningText(),
                size: getSize(),
            };
        });

        console.log(`🖼️ Found ${productDetail.allImages.length} images`);
        console.log(`📝 Extracted details:`, productDetail);

        return productDetail;

    } catch (error) {
        console.warn(`⚠️ Failed to scrape product page ${productPageUrl}`, error);
        return null;
    }
}
