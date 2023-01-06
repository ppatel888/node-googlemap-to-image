import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
const { chromium } = require('playwright');

const app = express();
let browser;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const generateImageBuffer = async () => {
    // Setup
    browser = await chromium.launch();
    const page = await browser.newPage();  
    // The actual interesting bit
    await page.goto('https://www.google.com/maps/@40.7513564,-73.9951074,15.25z');  
    const buffer = await page.screenshot();
    await browser.close();
    return buffer;
}

app.get('/image', (req,res) => {
  try{
    generateImageBuffer().then(buffer => {
    const base64Buffer = Buffer.from(buffer.toString('base64'), "base64");
    fs.writeFileSync(`map${Date.now()}.jpg`, base64Buffer);
    res.send('Image conversion succeeded');
  });
}catch(ex){
    console.log(ex);
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);
