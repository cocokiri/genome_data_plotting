const flatten = (arr) => arr.reduce((flat, toFlatten) => flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten), [])
console.log('this', this)


//could have been a function, but es6 modules work strangle with .this inside a function body
class DataHandler {
    constructor() {
        this.flatData = [];
        this.data = [];
    }
    addFile(newData){
        this.flatData = [...this.flatData, ...newData]
        this.data.push(newData)
        return this;
    }  
}

// const f = new DataHandler()
// console.log(f)
// f.addFile([2,2,2,2])
// f.addFile([5,5])
// console.log(f)



/*this was painful. TODO: get 3rd party lib*/
const dumb_ndJsonTransform = (rawText) => rawText.split('\n').map(entry => JSON.parse(`[${entry}]`)).map(el => el[0])

export {
    DataHandler,
    flatten,
    dumb_ndJsonTransform
}