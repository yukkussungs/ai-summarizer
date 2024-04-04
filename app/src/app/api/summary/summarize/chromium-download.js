import puppeteer from 'puppeteer';

async function downloadChromium() {
  const revision = await puppeteer.chromiumRevision();
  const executablePath = `/tmp/headless-chromium-${revision}`;
  await puppeteer.download(executablePath);
  console.log(`Chromium downloaded to ${executablePath}`);
}

async function main() {
  await downloadChromium();
}

main();
