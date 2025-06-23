import puppeteer from "puppeteer";

export async function scrapeHAC({ username, password, user_id, district }) {
  console.log("🔐 Logging into HAC:", username);

  const loginURLs = {
    FISD: "https://hac.friscoisd.org/HomeAccess/Account/LogOn",
    PISD: "https://hac.pisd.edu/HomeAccess/Account/LogOn",
    CFISD: "https://hac.csdhcp.cfisd.net/HomeAccess/Account/LogOn",
    HISD: "https://hac.houstonisd.org/HomeAccess/Account/LogOn",
    KATY: "https://hac.katyisd.org/HomeAccess/Account/LogOn",
    HCPS: "https://hac.hillsboroughschools.org/HomeAccess/Account/LogOn"
  };

  const loginURL = loginURLs[district] || loginURLs.FISD;

  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();

  try {
    await page.goto(loginURL, { waitUntil: "domcontentloaded" });
    await page.type("#LogOnDetails_UserName", username);
    await page.type("#LogOnDetails_Password", password);
    await Promise.all([
      page.click("#login"),
      page.waitForNavigation({ waitUntil: "domcontentloaded" }),
    ]);

    const baseURL = loginURL.replace("/Account/LogOn", "");
    await page.goto(`${baseURL}/Content/Student/Assignments.aspx`, { waitUntil: "domcontentloaded" });

    const data = await page.evaluate(() => {
      const result = { transcripts: [], assignments: [] };
      const sections = document.querySelectorAll(".AssignmentClass");

      sections.forEach((section) => {
        const title = section.querySelector(".sg-header-heading")?.textContent.trim();
        if (!title) return;

        const gpa_weight = title.includes("AP") ? 1.2 : title.includes("Honors") ? 1.1 : 1.0;
        const termMatch = title.match(/\b(Fall|Spring|S1|S2|Q[1-4])\b/i);
        const term = termMatch ? termMatch[0] : "Unknown";

        section.querySelectorAll("table tbody tr").forEach((row) => {
          const tds = row.querySelectorAll("td");
          if (tds.length < 5) return;

          const [_, nameEl, catEl, scoreEl] = tds;
          const name = nameEl.textContent.trim();
          const category = catEl.textContent.trim();
          const score = scoreEl.textContent.trim();

          if (name && score) {
            result.assignments.push({ course_title: title, term, gpa_weight, name, category, score });
          }
        });

        result.transcripts.push({ course_title: title, term, gpa_weight });
      });

      return result;
    });

    await browser.close();
    return data;
  } catch (err) {
    await browser.close();
    throw err;
  }
}
