import { Collection } from 'discord.js';
import {MongoClient} from 'mongodb'
import puppeteer from "puppeteer";

export class Kafka {
    private db_url: string;
    public db: any;

    constructor(db_url: string)
    {
        this.db_url = db_url;
    }

    async start()
    {

        this.db = await dbConnection(this.db_url)

        const doc = await this.db.collection('users').findOne();
    
        console.log(doc)

        console.log("Started Kafka succesfully.")
    }

    async find()
    {
        console.log(this.db);
    }

    async scrapeData(uid: string, character: string) {
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        await page.goto(`https://brelshaza.com/hsr/${uid}?character=${character}&render=true`);
        
        await new Promise(r => setTimeout(r, 8000));
        let element = await page.$('#link-var')
        let value = await page.evaluate(el => el?.textContent, element)
        
        await browser.close();
        return value;
      }


}

async function dbConnection(db_url: string)
{
    const client = new MongoClient(db_url);
    await client.connect()

    const db = client.db('kafka')

    return db;

}