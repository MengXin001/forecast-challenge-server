import express from 'express'
import bodyParser from 'body-parser';
import { port } from './config.js'
import { collector } from './collector/collector.js';
import { dataParser } from './collector/util.js';
import nodeSchedule from 'node-schedule'

import szmb_forecast from './assets/szmb_forecast.json' assert { type: "json" };
const actualTemperatures = szmb_forecast // 模拟 szmb预报气温做实况数据

/**
 * 一些气温指标 
 * 均方根误差
 * 平均绝对误差
 * 卡方(χ2)
*/

/**
 * @param {Array} userData
 * @param {Array} obsData
 * @returns {Array}
 */

function RMSE(userData, obsData) {
    const minLength = Math.min(userData.length, obsData.length);
    const dailyRMSE = [];
    let squaredDifferenceSum = 0;
    for (let i = 0; i < minLength; i++) {
        const x = Math.pow(userData[i] - obsData[i], 2);
        squaredDifferenceSum += x;
        const rmse = Math.sqrt(x);
        dailyRMSE.push(rmse);
    }
    const meanSquaredDifference = squaredDifferenceSum / minLength;
    const totalRMSE = Math.sqrt(meanSquaredDifference);
    return { dailyRMSE, totalRMSE };
}

function Delta(userData, obsData) {
    const minLength = Math.min(userData.length, obsData.length);
    const delta = [];
    for (let i = 0; i < minLength; i++) {
        const x = userData[i] - obsData[i];
        delta.push(x);
    }
    return delta;
}

let job = nodeSchedule.scheduleJob('0 */3 * * *', () => {
    collector();
});

const app = express();
app.use(bodyParser.json());
app.post('/api', async (req, res) => {
    const { username, userTemperatures } = req.body;
    const score = RMSE(userTemperatures, dataParser(actualTemperatures, "maxT"));
    // await clientMongodb(username, score);
    res.json({ score });
});

app.listen(port, () => {
    collector();
    console.log(`Server is running on http://localhost:${port}`);
});

process.on('exit', () => {
    job.cancel();
});

