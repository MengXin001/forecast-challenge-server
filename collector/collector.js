
import axios from 'axios'
import fs from 'fs'
import { szmb_forecast_url } from '../config.js'

async function collector() {
    try {
        const response = await axios.get(szmb_forecast_url[0]);
        const weatherData = response.data;
        const extractedData = weatherData.daynew.map(day => {
            return {
                maxT: day.maxT,
                minT: day.minT,
                forecastTime: day.reportTime.slice(0, 10)
            };
        });
        fs.writeFile('./assets/szmb_forecast.json', JSON.stringify(extractedData, null, 2), err => {
            if (err) {
                console.error('获取数据错误: ', err);
            } else {
                console.log(`${(new Date()).toString()} 获取数据成功`);
            }
        });
    } catch (error) {
        console.error('获取数据错误: ', error);
    }
}

export { collector }