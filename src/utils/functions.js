export const gaussian = (arr) => {
    let arrLen = arr.length;
    let arrSum = arr.reduce((a, b) => a + b);
    let mu = arrSum / arrLen;
    let sumation = 0;
    arr.forEach((el) => {
        sumation += Math.pow(el - mu, 2);
    });
    let sigSquare = sumation / (arrLen - 1);

    if (sigSquare == 0) return arr[0];

    const probDensityFunction = (rssi) =>
        (1 / (Math.sqrt(sigSquare) * Math.sqrt(2 * Math.PI))) *
        Math.exp(-Math.pow(rssi - mu, 2) / sigSquare);

    let maxProb = 0.0,
        outRssi;

    arr.forEach((rssi) => {
        let prob = probDensityFunction(rssi);
        if (prob > maxProb) {
            outRssi = rssi;
        }
    });

    return outRssi;
};
