   import {
       DataHandler,
       DataLoader,
       sumField,
       hist
   } from './utils.js';

   const DATA = new DataHandler();

   //Get NODES
   const [tot_reads, tot_seqlen, avg_qscore, avg_seqlen, seq_dist, qscore_dist, seq_per_range, min, max] = ['tot_reads', 'tot_seqlen', 'avg_qscore', 'avg_seqlen', 'seq_dist', 'qscore_dist', 'seq_per_range', 'min', 'max'].map(id => document.getElementById(id))

   const updateNodes = () => {
       [tot_reads, tot_seqlen, avg_qscore, avg_seqlen].forEach(
           node => {
               node.innerText = DATA.lastCalc[node.id]
           }
       )
   }
   const DATA_META = {
       root: 'data',
       preffix: "/fastq_runid_b717de22d589c3d70b7e074e2ca3a933006f78c8_",
       suffix: {
           folder: '.fastq',
           file: '.fastq.data.json'
       },
       filenumbers: Array(10).fill(10).map((el, idx) => el + idx) //[10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
   }
   const pathStitcher = (filenumber, meta = DATA_META) => {
       const {
           root,
           preffix,
           suffix
       } = meta;
       return root + preffix + filenumber + suffix.folder + preffix + filenumber + suffix.file
   }
   //should be in DATAhandler class...
   const segment = (min = 0, max = 20) => DATA.clipFieldRange('seqlen', [0, 8000]).filter(data => data.mean_qscore >= min && data.mean_qscore <= max)
   const segPlot = () => {
       DATA.calculate(segment(parseInt(min.value), parseInt(max.value)))
       hist(DATA.lastCalc.seqlen_dist, `Sequence Lengths for QualScores Range | ${min.value} -- ${max.value}`)
       updateNodes(); //updates info on segmenting
   }

   /*
   EVENTS 
   TODO: abstract hist and segmenting .... 
   */
   seq_dist.addEventListener("click", function() {
       hist(DATA.lastCalc.seqlen_dist, "Sequence Length Distribution")
   })
   qscore_dist.addEventListener("click", function() {
       hist(DATA.lastCalc.qscore_dist, "Quality Score Distribution")
   })
   seq_per_range.addEventListener("click", segPlot)
   min.addEventListener("change", segPlot)
   max.addEventListener("change", segPlot)


   const render = async () => {
       const paths = DATA_META.filenumbers.map(num => pathStitcher(num));
       for (const path of paths) {
           const fileData = await DataLoader(path);
           fileData.pop(); //yes, bad mutation. Last entry is ndJson undefined
           DATA.addFile(fileData)

           //TODO just for cool loading update animation -- comment out if you want to wait for all data
           DATA.calculate()
           updateNodes();
           hist(fileData.map(d => d.seqlen), "Sequence Length Distribution")
       }
       //so it's not skewed bc of one bad read...
       DATA.calculate(DATA.clipFieldRange('seqlen', [0, 8000]));
    //    console.log(DATA, 'max', Math.max(...DATA.lastCalc.seqlen_dist))
       hist(DATA.lastCalc.seqlen_dist, "Sequence Length Distribution")
   }
   render();