const flatten = (arr) => arr.reduce((flat, toFlatten) => flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten), [])
console.log('this', this)


//could have been a function, but es6 modules work strangle with .this inside a function body
class DataHandler {
    constructor() {
        this.all = [];
        this.files = [];
        this.lastCalc = {} //do not recalc every click
    }
    addFile(newData) {
        this.all = [...this.all, ...newData]
        this.files.push(newData)
        return this;
    }
    calculate(sample) {
        const calc = {
            tot_reads: sample.length,
            tot_seqlen: sumField(sample, 'seqlen'),
            avg_qual: sumField(sample, 'mean_qscore') / totalreads,
            avg_seqlen: sumField(sample, 'seqlen') / totalreads
        }
        this.lastCalc = calc;
        return calc;
    }
}

function hist(x_values, title, nodeId = 'plot') {
    const trace = {
        title: `Histogram: ${title}`,
        x: x_values,
        type: 'histogram',
    };
    const data = [trace];
    Plotly.newPlot(nodeId, data);
    return data;
}

const sumField = (entries, fieldName) => entries.reduce((acc, val) => acc + val[fieldName], 0)

async function DataLoader(path) {
    try {
        const response = await fetch(path)
        //little roadbump here with ndJson
        var rawText = await response.text()
        return dumb_ndJsonTransform(rawText)

    } catch (error) {
        console.log('error at loading', error)
        return null
    }
}

/*this was painful. TODO: get 3rd party lib*/
const dumb_ndJsonTransform = (rawText) => rawText.split('\n').map(entry => JSON.parse(`[${entry}]`)).map(el => el[0])

export {
    DataHandler,
    sumField,
    hist,
    flatten,
    DataLoader
}