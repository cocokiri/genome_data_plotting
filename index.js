   import {
       DataHandler,
       DataLoader,
       sumField,
       hist
   } from './utils.js';

   const DATA = new DataHandler();

   //Get NODES
   const [tot_reads, tot_seqlen, avg_qscore, avg_seqlen, seq_dist, qscore_dist, seq_per_range] = ['tot_reads', 'tot_seqlen', 'avg_qscore', 'avg_seqlen', 'seq_dist', 'qscore_dist', 'seq_per_range'].map(id => document.getElementById(id))


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
   /*
   EVENTS */
   seq_dist.addEventListener("click", function() {
       hist(DATA.lastCalc.seqlen_dist, "Sequence Length Distribution")
   })
   qscore_dist.addEventListener("click", function() {
       hist(DATA.lastCalc.qscore_dist, "Quality Score Distribution")
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
       DATA.calculate();
       console.log(DATA)
       console.log('max', Math.max(...DATA.lastCalc.seqlen_dist))

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