const puppeteer = require("puppeteer");

async function scrapeHAC({ username, password }) {
  console.log("🟢 scrapeHAC function called with:", username, password);
  return {
    transcripts: [
      {
        course_name: "Test Course",
        final_grade: 95,
        gpa_weight: 5.0,
        credits: 1.0,
        term: "Current",
      },
    ],
    assignments: [
      {
        course_name: "Test Course",
        assignment_name: "Homework 1",
        grade: 100,
        category: "Homework",
        weight: 1.0,
        date_submitted: "2025-06-12",
      },
    ],
  };
}

module.exports = { scrapeHAC };
