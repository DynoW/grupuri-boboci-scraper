const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const url = 'http://admitere.edu.ro/Pages/CandInJud.aspx?jud=4&alfa=1';
  let data = [];

  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 30000));
  async function getTableData() {
    const tableContent = await page.evaluate(() => {
      const table = document.querySelector('.mainTable');
      const rows = table ? table.querySelectorAll('tr') : [];

      const extractRowData = (row) => {
        const cells = row.querySelectorAll('td, th');
        
        const rowData = {};
        Array.from(cells).forEach((cell, index) => {
          switch (index) {
            case 0: id = "index"; break;
            case 1: id = "n"; break;
            case 2: id = "jp"; break;
            case 3: id = "s"; break;
            case 4: id = "rlm"; break;
            case 5: id = "madm"; break;
            case 6: id = "mev"; break;
            case 7: id = "nro"; break;
            case 8: id = "nmate"; break;
            case 9: id = "lm"; break;
            case 10: id = "nlm"; break;
            case 11: id = "mabs"; break;
            case 12: id = "h"; break;
            case 13: id = "sp"; break;
          }
          rowData[id] = cell.innerText;
        });
        return rowData;
      };

      return Array.from(rows).map((row) => extractRowData(row));
    });

    tableContent.shift();
    console.log(tableContent)
    data = data.concat(tableContent);
  }

  async function isNextPagePresent() {
    return await page.evaluate(() => {
      const nextButton = document.getElementById('ContentPlaceHolderBody_ImageButtonDR1');
      return nextButton !== null;
    });
  }

  async function clickNextPage() {
    await page.evaluate(() => {
      const nextButton = document.getElementById('ContentPlaceHolderBody_ImageButtonDR1');
      nextButton.click();
    });
  }

  await getTableData();

  while (await isNextPagePresent()) {
    await clickNextPage();
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    await getTableData();
  }

  await browser.close();

  const jsonString = JSON.stringify(data);
  const filePath = 'candidate.json';

  fs.writeFile(filePath, jsonString, (err) => {
    if (err) {
      console.error('Error writing JSON to file:', err);
    } else {
      console.log('JSON data saved to file:', filePath);
    }
  });
})();
