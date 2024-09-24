//console.log("yash savera");
//const obj=require('./fun.js')
//import {sum} from './fun.js';
//const a=5;
//const b=7;
//console.log(sum(a,b));

const fs = require('fs');
const t1=performance.now();
// Synchronous readFileSync
const express=require('express');
const server=express();
server.listen();
fs.readFile('./text.txt','utf-8',(err,txt)=>{
    console.log(txt+"yash savera");
});
console.log(433+321);


const http=require('http');
const fs=require('fs');

const index=fs.readFileSync('index.html','utf-8');
const data=fs.readFileSync('data.json','utf-8');

const server=http.createServer((req,res)=>
{
    console.log(req.url);
    console.log("server started");
    res.setHeader('Content-Type','text/html');
    res.setHeader('Content-Type','application.json');
    res.end(index);
})

server.listen(8080);

server.get('/',(req,res)=>{
    res.sendFile('/Users/yash/OneDrive/Desktop/js/index.html');
    //res.json(data);
    
  })