var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var crime=new Object();
var crimedata=new Object();
var line_num=0;
var arrformat = [];
var desc_index,year_index;

var instream = fs.createReadStream('crime.csv');
var outstream = new stream;
var rl = readline.createInterface(instream,outstream);

rl.on('line', function(line) {
     var res=line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
     line_num++;

     if(line_num === 1)
     {
         for(i=0;i<res.length;i++)
         {
           if(res[i]=="Year")
           {
             year_index = i;
           }
           else if (res[i]=="Description")
           {
             desc_index = i;
           }
         }
     }
     else
     {
         if(res[desc_index]=="$500 AND UNDER" || res[desc_index]=="OVER $500")
         {
           if(crime[res[year_index]] == undefined)
           {
             crime[res[year_index]]={};
                crime[res[year_index]][res[desc_index]] = 1;
           }
           else
           {
             if(crime[res[year_index]][res[desc_index]] == undefined)
             {
               crime[res[year_index]][res[desc_index]] = 1;
             }
             else
             {
             crime[res[year_index]][res[desc_index]]++;
             }
           }
         }

     }
});

rl.on('close', function() {
  for(i in crime)
  {
       crimedata = {};
       crimedata.year =i;
       //crimedata.under_500=0;
     //  crimedata.above_500=1;
   for(j in crime[i])
    {
      if(j === "$500 AND UNDER"){
            crimedata.under_500 = crime[i][j];}
           // console.log(crime[i][j]);}
     else{
            crimedata.above_500 = crime[i][j];}
            //console.log(crime[i][j]);}
     //console.log(j);
     //crimedata.below_500 = crime[i][j];

   }
   arrformat.push(crimedata);
  }

console.log(arrformat);
//console.log(arrformat);
var json_convert=JSON.stringify(arrformat);
fs.writeFile('crimes.json',json_convert);
});
