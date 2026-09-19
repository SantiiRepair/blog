/**
 * IndexNow Submission Script for santiirepair.dev
 * Notifies Bing, Yandex, and IndexNow partners immediately of updated URLs.
 */
const https = require("node:https");

const host = "santiirepair.dev";
const key = "e8f49a21b3c74900a6e4d58097b61f25";
const keyLocation = `https://${host}/${key}.txt`;

const urlList = [
  `https://${host}/`,
  `https://${host}/trips`,
  `https://${host}/favorites`
];

const payload = JSON.stringify({
  host,
  key,
  keyLocation,
  urlList
});

const options = {
  hostname: "api.indexnow.org",
  port: 443,
  path: "/indexnow",
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload)
  }
};

console.log("Submitting URLs to IndexNow API for instant indexing...");

const req = https.request(options, (res) => {
  console.log(`IndexNow response code: ${res.statusCode} ${res.statusMessage}`);
  res.on("data", (d) => {
    process.stdout.write(d);
  });
  res.on("end", () => {
    if (res.statusCode === 200 || res.statusCode === 202) {
      console.log("\nSuccess: URLs submitted to IndexNow search engines!");
    } else {
      console.log(`\nNote: Search engines returned status ${res.statusCode}.`);
    }
  });
});

req.on("error", (error) => {
  console.error("IndexNow submission error:", error.message);
});

req.write(payload);
req.end();
