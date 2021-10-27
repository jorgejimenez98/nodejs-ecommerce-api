# Express NodeJS E-Commerce REST API

This Express NodeJS E-Commerce REST API example to practice with database MongoDB.

## Start Mongo DB Server

Open the shell and write the next code:

```sh
$ mongod
```

Make sure to create a database with name **nodejs-ecommerce**  

## Init project

Clone repository:

```sh
$ git https://github.com/jorgejimenez98/nodejs-ecommerce-api.git
$ cd nodejs-ecommerce-api

```
Install dependencies using the next code:

```sh
$ npm install --save
```


Create file .env with virtual the next enviroments variables:

```sh
API_URL = http://localhost:5000
PORT = 5000
DB_CONNECTION = mongodb://localhost/nodejs-ecommerce
TOKEN_SECRET = secret_token_string
```

Run project:

```sh
$ npm start
```
  
The project will be running on url `http://127.0.0.1:5000`


# REST API Request Examples

The REST API to the example app is described below.

## Get list of Products

### Request

`GET /api/products`

    http://localhost:5000/api/products/

### Response

    Status: 200 OK
    Content-Type: application/json
    
    [
      {
          "_id": "617537a01dea55899dc543d9",
          "name": "Nuevo",
          "image": "https://www.dominos.co.in/files/items/Non-Veg_Supreme.jpg"
      },
      {
          "_id": "617553347a903a8601439966",
          "name": "Nuevo",
          "image": "https://www.dominos.co.in/files/items/Non-Veg_Supreme.jpg"
      },
    ]

## Get Products Details

### Request

`GET /api/products/:productId/`

    http://localhost:5000/api/products/617831d05aa660bffc296c65

### Response

    Status: 200 OK
    Content-Type: application/json
    
    {
      "_id": "617831d05aa660bffc296c65",
      "name": "Product",
      "description": "Very good Product",
      "richDescription": "Very good Product Very good Product",
      "image": "http://127.0.0.1:5000/public/uploads/cappantalla.png-1635267024488.png",
      "images": [
          "http://127.0.0.1:5000/public/uploads/Captura-de pantalla (216).png-1635276760001.png",
          "http://127.0.0.1:5000/public/uploads/Captura-de pantalla (217).png-1635276760019.png"
      ],
      "brand": "brand",
      "price": 50,
      "category": {
          "_id": "61751ba3d044d6503e554f76",
          "name": "AAAAA",
          "color": "#ffffff",
          "icon": "icon-nuevo",
          "__v": 0
      },
      "countInStock": 10,
      "rating": 5,
      "numReviews": 500,
      "isFeatured": true,
      "dateCreated": "2021-10-26T16:50:24.505Z",
      "__v": 0
    }
    
    
## UML Diagram Photo
![Alt text](public/model.jpg?raw=true "Ejemplo")
