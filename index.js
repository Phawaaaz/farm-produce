const fs = require('fs');

const http = require('http');
const { json } = require('stream/consumers');
const url = require('url')

// files
// const textIn = fs.readFileSync('./txt/input.txt', 'utf8')
// // console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}. \nCreated on ${Date.now()}`;

// fs.writeFileSync('./txt/output.txt', textOut);
//     // console.log('File  written');


// // Non-blocking, Asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1 )=>{
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2)=>{
//         // err ? console.log('Error') : console.log(data2 );
//         fs.readFile(`./txt/append.txt`, 'utf-8', (err, data)=>{
//             fs.writeFile('./txt/final.txt', `${data2}\n${data}`, (err)=>{
//                 // err ? console.log('Error') : console.log('Your file has been written!')
//             })
//         })

//     })
// })
// console.log('Lets check wh ich one comes first!');

// Server
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
  output = output.replace(/{%IMAGE%}/g, product.image)
  output = output.replace(/{%FROM%}/g, product.from)
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
  output = output.replace(/{%QUANTITY%}/g, product.quantity)
  output = output.replace(/{%PRICE%}/g, product.price)
  output = output.replace(/{%DESCRIPTION%}/g, product.description)
  output = output.replace(/{%ID%}/g, product.id)
  if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
  return output
} 

const tempOverview = fs.readFileSync(`${__dirname}/templates/tempOverview.html`, 'utf-8')
console.log(tempOverview);
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempProduct  = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8')
 
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)
     
const server = http.createServer((req, res)=>{

    
    // console.log(req.url);

    const pathName = req.url
    // overview page
    if (pathName === '/' || pathName === '/overview') { 
      res.writeHead(200, { 'Content-Type': 'text/html' });
      const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('')
      const output = tempOverview.replace(/{%PRODUCTCARD%}/g, cardsHtml)
      res.end(output);
      // res.end(tempOverview);
      } 
      // Product page
      else if (pathName === '/product') {
        res.end(tempProduct); 

      }
      // API  
      else if (pathName === '/api') { 
            res.writeHead(200, {'content-type':'application/json'} )
            res.end(dataObj)   
      }
      // Not found
      else {
        res.writeHead(404, { 
          'Content-Type': 'text/html',
          'header': 'hello world', 
        });
        res.end('<h1>Page not found</h1>');
      }
    });
    
    server.listen(8000, '127.0.0.1', () => {
      console.log('Listening to requests on port 8000');
    });