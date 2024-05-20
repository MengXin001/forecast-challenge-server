
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

export default { RMSE, Delta }