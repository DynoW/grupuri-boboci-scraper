const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const idElev = 'B10127373';
  const url = 'http://admitere.edu.ro/Pages/RezultateCautare.aspx?Jud=4&Cod=' + idElev;

  await page.goto(url);
  
  await page.waitForSelector('.mainTable');

  async function getTableData() {
    const tableContent = await page.evaluate(() => {
      const table = document.querySelector('.mainTable');
      const rows = table ? table.querySelectorAll('tr') : [];
        
      const extractRowText = (row) => {
        const cells = row.querySelectorAll('td, th');
        return Array.from(cells).map(cell => cell.textContent.trim());
      };
        
      return Array.from(rows).map(row => extractRowText(row));
    });

    const data = tableContent[1];
    
    console.log(data);
  }

  await getTableData();

  await browser.close();
})();
