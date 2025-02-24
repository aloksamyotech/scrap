export function extractImageUrls(data) {
    const urlRegex = /https:\/\/www\.instacart\.com\/image-server\/\d+x\d+\/filters:fill\(FFF,true\):format\(jpg\)\/[^\s,]+/g;
    return data?.flatMap(item => {
        const matches = item.match(urlRegex);
        return matches ? matches.map(url => url.replace(/,$/, "")) : []; 
    });
}
export const data = []    





