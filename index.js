   import {
       DataHandler,
       DataLoader,
       sumField,
       hist
   } from './utils.js';


   console.log("plotly", Plotly)
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

   //get nodes
   const [tot_reads, tot_seqlen, avg_qscore, avg_seqlen, seq_dist, qscore_dist, seq_per_range] = ['tot_reads', 'tot_seqlen', 'avg_qscore', 'avg_seqlen', 'seq_dist', 'qscore_dist', 'seq_per_range'].map(id => document.getElementById(id))

   /*
   EVENTS */
   seq_dist.addEventListener("click", function() {
       //    hist()
   })
  



   const render = async () => {
       const path = pathStitcher(10);
       const sample = await DataLoader(path);
       console.log('sample', sample)

       //yes, bad mutation. Last entry is undefined
       sample.pop()

       console.log(sample[0].barcode, sample.slice(0, 4).reduce((acc, val) => acc + val['seqlen'], 0))
       const totalreads = sample.length;
       const totalseqlen = sumField(sample, 'seqlen');
       const avg_qual = sumField(sample, 'mean_qscore') / totalreads;
       const avg_seqlen = sumField(sample, 'seqlen') / totalreads;
       console.log(totalreads, totalseqlen, avg_qual, avg_seqlen)

       const trace = {
           title: "Sequence Length Distribution",
           x: sample.map(e => e.seqlen),
           type: 'histogram',
       };
       const data = [trace];
       Plotly.newPlot('plot', data);

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