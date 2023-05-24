import express from "express";
import * as dotenv from 'dotenv'
import { Kafka } from "./hsr";
dotenv.config()

const app = express();
const port = process.env.PORT;

const kafka = new Kafka(process.env.DB_URL!)

kafka.start();


app.get('/v2/hsr/getBuild/:uid/:number', async (req, res) => {

    const data: any = await kafka.scrapeData(req.params.uid, req.params.number);

    const imageData = data.replace(/^data:image\/png;base64,/, '');

    const buffer = Buffer.from(imageData, 'base64');

    res.setHeader('Content-Type', 'image/png');

    res.send(Buffer.from(imageData, 'base64'));
  });

app.get('/v2/hsr/getBlob/:uid/:number', async (req, res) => {

    const data: any = await kafka.scrapeData(req.params.uid, req.params.number);

    res.send({data: data});
  });

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });