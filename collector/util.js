export const dataParser = (forecastArray, element) =>{
    return forecastArray.map(data => data[element]);
}