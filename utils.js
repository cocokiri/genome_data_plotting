
const DataHandler = () => {
    this.allData = [];
    this.data = [];
    this.addFile = (newData) => {
        this.allData = [...this.data, ...newData]
        this.data = [flatten(...this.data), newData]
        return this;
    }
    return this;
}

/*this was painful. TODO: get 3rd party lib*/
const dumb_ndJsonTransform = (rawText) => rawText.split('\n').map(entry => JSON.parse(`[${entry}]`)).map(el => el[0])

const flatten = (arr) => arr.reduce((flat, toFlatten) => flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten), [])
export {
    DataHandler,
    flatten,
    dumb_ndJsonTransform
}