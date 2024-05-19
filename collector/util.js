export const dataParser = (forecastArray, element) => {
    return forecastArray.filter(item => item.label === element).map(item => item.value)
}