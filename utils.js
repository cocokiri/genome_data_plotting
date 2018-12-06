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
    calculate(sample = this.all) {
        const tot_reads = sample.length;
        const calc = {
            tot_reads,
            tot_seqlen: sumField(sample, 'seqlen'),
            avg_qscore: sumField(sample, 'mean_qscore') / tot_reads,
            avg_seqlen: sumField(sample, 'seqlen') / tot_reads,
            qscore_dist: sample.map(d => d.mean_qscore),
            seqlen_dist: sample.map(d => d.seqlen)
        }
        console.log(calc, `from ${sample.length} samples`)
        this.lastCalc = calc;
        return calc;
    }
    clipFieldRange(field, range=[0, 20000]) {
        const [min, max] = range;
        const cleaned = this.all.filter(dat => dat[field] > min && dat[field] < max);
        return cleaned;
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

const DataLoader = async function(path) {
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