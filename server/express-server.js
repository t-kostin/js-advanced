'use strict';
const express = require('express');
const fs = require('fs');
const dateFns = require('date-fns');
const dateFormat = require('date-fns/format')
let serverPort = 8001

const app = express();
app.use(express.static('.'));
app.use(express.json());

function basketLog(id, message) {
  fs.readFile('./stats.json', 'utf8', (error, logData) => {
    if (error) {
      throw Error(error);
    } else {
      const logFull = JSON.parse(logData);
      const currentDate = new Date();
      const logItem = {
        date: dateFormat(currentDate, 'yyyy-MM-dd'),
        time: dateFormat(currentDate, 'HH:mm:ss'),
        product_id: id,
        operation: message
      };
      logFull.push(logItem);
      fs.writeFile('./stats.json', JSON.stringify(logFull), (error) => {
        if (error) {
          throw Error(error);
        }
      });
    }
  });
}

app.get('/catalog', (request, response) => {
  fs.readFile('./data.json', 'utf8', (error, data) => {
    if (error) {
      throw Error(error);
    } else {
      response.send(data);
    }
  });
});

app.get('/basket', (request, response) => {
  fs.readFile('./basket.json', 'utf8', (error, basket) => {
    if (error) {
      throw Error(error);
    } else {
      response.send(basket);
    }
  });
});

app.post('/addBasketItem', (request, response) => {
  fs.readFile('./basket.json', 'utf8', (error, data) => {
    let logMessage;
    if (error) {
      response.send('error');
      logMessage = 'add: read error';
    } else {
      const basket = JSON.parse(data);
      const item = request.body;
      const itemIndex = basket.findIndex(elem => elem.id_product === item.id_product);
      if (itemIndex >= 0) {
        basket[itemIndex].quantity++;
      } else {
        item.quantity = 1;
        basket.push(item);
      }
      const result = JSON.stringify(basket);
      fs.writeFile('./basket.json', result, (error) => {
        if (error) {
          logMessage = 'add: write error';
          response.send('error');
        } else {
          logMessage = 'add: ok';
          response.send(result);
        }
        basketLog(item.id_product, logMessage);
      });
    }
  });
});

app.post('/removeBasketItem', (request, response) => {
  fs.readFile('./basket.json', 'utf8', (error, data) => {
    let logMessage;
    if (error) {
      response.send('error');
      logMessage = 'remove: read error';
    } else {
      const basket = JSON.parse(data);
      const item = request.body;
      const itemIndex = basket.findIndex(elem => elem.id_product === item.id_product);
      if (itemIndex >= 0) {
        basket.splice(itemIndex, 1);
        logMessage = 'remove: ok';
      } else {
        logMessage = 'remove: item not exist';
      }
      const result = JSON.stringify(basket);
      fs.writeFile('./basket.json', result, (error) => {
        if (error) {
          logMessage = 'remove: write error';
          response.send('error');
        } else {
          response.send(result);
        }
        basketLog(item.id_product, logMessage);
      });
    }
  });
});

app.listen(serverPort = 8001, () => {
  console.log(`Server started on ${serverPort} port`);
});
