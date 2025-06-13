const { scrapeHAC } = require("./scrapeHAC");

console.log("Trying to import...");
if (typeof scrapeHAC === "function") {
  console.log("✅ scrapeHAC loaded successfully");
} else {
  console.log("❌ scrapeHAC is NOT a function");
}
