import express from 'express'
import bodyParser from 'body-parser';
import { port } from './config.js'
import { collector, dataParser } from './collector/collector.js';
import RMSE from './calc/index.js'
import nodeSchedule from 'node-schedule'

import szmb_forecast from './assets/szmb_forecast.json' assert { type: "json" };
const obsData= szmb_forecast // 模拟 szmb预报气温做实况数据

let job = nodeSchedule.scheduleJob('0 */3 * * *', () => {
    collector();
});

const app = express();
app.use(bodyParser.json());
app.post('/api', async (req, res) => {
    const { username, userData } = req.body;
    const score = RMSE(userData, dataParser(obsData, "maxT"));
    // await clientMongodb(username, score);
    res.json({ score });
});

app.get('/szmb_forecast', async (req, res) => {
    res.json(szmb_forecast);
});

app.listen(port, () => {
    collector();
    console.log(`Server is running on http://localhost:${port}`);
});

process.on('exit', () => {
    job.cancel();
});

