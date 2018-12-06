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
       filenumbers: Array(2).fill(10).map((el, idx) => el + idx) //[10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
   }
   const pathStitcher = (filenumber, meta = DATA_META) => {
       const {
           root,
           preffix,
           suffix
       } = meta;
       return root + preffix + filenumber + suffix.folder + preffix + filenumber + suffix.file
   }
   /*
   EVENTS 
   TODO: abstract hist somehow 
   */
   seq_dist.addEventListener("click", function() {
       hist(DATA.lastCalc.seqlen_dist, "Sequence Length Distribution")
   })
   qscore_dist.addEventListener("click", function() {
       hist(DATA.lastCalc.qscore_dist, "Quality Score Distribution")
   })
   seq_per_range.addEventListener("click", function() {
       DATA.calculate(segment())
       hist(DATA.lastCalc.seqlen_dist, `Sequence Lengths for QualScores Range | ${min.value} -- ${max.value}`)
   })

   //should be in DATAhandler class...
   const segment = (min = 0, max = 20) => DATA.all.filter(data => data.mean_qscore >= min && data.mean_qscore <= max)


   min.addEventListener("change", function(ev) {
       DATA.calculate(DATA.all.filter(data => data.mean_qscore >= min && data.mean_qscore <= max))
       hist(DATA.lastCalc.seqlen_dist, `Sequence Lengths for QualScores Range | ${this.value} -- ${max.value}`)
   })
   max.addEventListener("change", function(ev) {
       console.log(max, min)
       DATA.calculate(segment(parseInt(min.value), parseInt(max.value)))
       hist(DATA.lastCalc.seqlen_dist, `Sequence Lengths for QualScores Range | ${min.value} -- ${max.value}`)
   })


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
       console.log(DATA, 'max', Math.max(...DATA.lastCalc.seqlen_dist))

       hist(DATA.all.map(d => d.seqlen), "Sequence Length Distribution")
   }
   render();



   /* MOCKDATA for reference
         {
             "format_conversion": {
                 "alphabet_conversion": false,
                 "header_corrected": false
             },
             "barcode": "NA",
             "retcode": "PASS",
             "exit_status": "Workflow successful",
             "calibration": false,
             "barcode_detection": {
                 "status": "1",
                 "barcode": "NA",
                 "barcode_score": 0.0
             },
             "start_time": 1497289387,
             "read_id": "5a864e23-d6ce-436e-bd83-a0a80955eeb6",
             "seqlen": 4291,
             "filename": "fastq_runid_b717de22d589c3d70b7e074e2ca3a933006f78c8_10.fastq",
             "runid": "b717de22d589c3d70b7e074e2ca3a933006f78c8",
             "mean_qscore": 12.927,
             "software": {
                 "time_stamp": "2018-Nov-16 11:38:40",
                 "version": "3.10.0",
                 "component": "homogeny"
             }
         } */