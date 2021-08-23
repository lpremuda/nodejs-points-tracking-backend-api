# Points Tracking Backend API

## Note: Node/Express was used for this project due to its ease of use and speed to complete. If another language/framework is desired, such as an object-oriented one, I can do that as well.
<br><br>

## How to Install

##### ***Make sure you have Node and npm installed before using this repository.***

Clone the repository:
### `git clone https://github.com/lpremuda/points-tracking-backend-api.git`
<br>

Move into the project directory:
### `cd points-tracking-backend-api`
<br>

Install dependencies:
### `npm install`
<br> 

Start the server:
### `npm start`
<br>

Server runs on port 5000, by default (http://localhost:5000). To change the port number, change the **PORT** variable in **./config.js**.
<br><br>

## Database Management
I chose to use a simple JSON file storage system to store the data.\
\
On server startup, **./database/mock-db-all-transactions-original.json** is copied over to **./database/mock-db-all-transactions.json** and **./database/mock-db-unspent-transactions.json**.

While the server is running, the data is persisted in these two initialized .json files:\
\
**./database/mock-db-all-transactions.json**\
&nbsp;&nbsp;&nbsp;&nbsp;The **/transactions/all** endpoint gets all data from this file.
&nbsp;&nbsp;&nbsp;&nbsp;Note: The **/transactions** endpoint also gets all data from this file.\

\
**./database/mock-db-unspent-transactions.json**\
&nbsp;&nbsp;&nbsp;&nbsp;The **/transactions/unspent** endpoint get all data from this file.

### mock-db-all-transactions.json
A complete database showing all transactions. 

### mock-db-unspent-transactions.json
A complete database showing all transactions, with the addition of points being deducted as the user spends points via the **/spend** endpoint. Upon first call to the **/spend** endpoint, the transactions will be sorted by transaction timestamp from oldest to newest. Refer to the below API call to **/transactions/unspent** to see how unspent-transactions is used. 
<br><br>

## How to Use the API

***Refer to the **"./client.rest"** file, which runs using the VS Code Extension called "REST Client" by Huachao Mao.***

### View all transactions

Send this REST command:
> GET http://localhost:5000/transactions/all

Server response:
> [ <br>
>   { <br>
>     "payer": "DANNON", <br>
>     "points": 1000, <br>
>     "timestamp": "2020-11-02T14:00:00Z" <br>
>   }, <br>
>   { <br>
>     "payer": "UNILEVER", <br>
>     "points": 200, <br>
>     "timestamp": "2020-10-31T11:00:00Z" <br>
>   }, <br>
>   { <br>
>     "payer": "DANNON", <br>
>     "points": -200, <br>
>     "timestamp": "2020-10-31T15:00:00Z" <br>
>   }, <br>
>   { <br>
>     "payer": "MILLER", <br>
>     "points": 10000, <br>
>     "timestamp": "2020-11-01T14:00:00Z" <br>
>   }, <br>
>   { <br>
>     "payer": "DANNON", <br>
>     "points": 300, <br>
>     "timestamp": "2020-10-31T10:00:00Z" <br>
>          } <br>
> ] <br>

 ### Spend points

Send this REST command:
> POST http://localhost:5000/spend <br>
> Content-Type: application/json <br>
> <br>
> { <br>
>   "spend": 5000 <br>
> } <br>

Server response:
> { <br>
>   "DANNON": -100, <br>
>   "UNILEVER": -200, <br>
>   "MILLER": -4700 <br>
> } <br>

### View balance (broken out by payer):

Send this REST command:
> GET http://localhost:5000/balances

Server response:
> { <br>
>   "DANNON": 1000, <br>
>   "UNILEVER": 0, <br>
>   "MILLER": 5300 <br>
> } <br>

### View unspent transactions

Send this REST command:
> GET http://localhost:5000/transactions/unspent

Server response:\
Note: Some transactions now have 0 points because the points from the **/spend** API call were decremented using the oldest transactions first.
> [ <br>
>   { <br>
>     "payer": "DANNON", <br>
>     "points": 0, <br>
>     "timestamp": "2020-10-31T10:00:00Z" <br>
>   }, <br>
>   { <br>
>     "payer": "UNILEVER", <br>
>     "points": 0, <br>
>     "timestamp": "2020-10-31T11:00:00Z" <br>
>   }, <br>
>   { <br>
>     "payer": "DANNON", <br>
>     "points": 0, <br>
>     "timestamp": "2020-10-31T15:00:00Z" <br>
>   }, <br>
>   { <br>
>     "payer": "MILLER", <br>
>     "points": 5300, <br>
>     "timestamp": "2020-11-01T14:00:00Z" <br>
>   }, <br>
>   { <br>
>     "payer": "DANNON", <br>
>     "points": 1000, <br>
>     "timestamp": "2020-11-02T14:00:00Z" <br>
>   } <br>
> ] <br>

### Add a transaction

Send this REST command:
Note: Server automatically adds the "timestamp" key to the object with the current date and time.
> POST http://localhost:5000/transactions \
> Content-Type: application/json\
> \
> {\
>   "payer": "DANNON",\
>   "points": 2000\
> }

Server response:\
Note: Server responds with all data from **./database/mock-db-all-transactions.json**
> [\
>   {\
>     "payer": "DANNON",\
>     "points": 1000,\
>     "timestamp": "2020-11-02T14:00:00Z"\
>   },\
>   {\
>     "payer": "UNILEVER",\
>     "points": 200,\
>     "timestamp": "2020-10-31T11:00:00Z"\
>   },\
>   {\
>     "payer": "DANNON",\
>     "points": -200,\
>     "timestamp": "2020-10-31T15:00:00Z"\
>   },\
>   {\
>     "payer": "MILLER",\
>     "points": 10000,\
>     "timestamp": "2020-11-01T14:00:00Z"\
>   },\
>   {\
>     "payer": "DANNON",\
>     "points": 300,\
>     "timestamp": "2020-10-31T10:00:00Z"\
>   },\
>   {\
>     "payer": "DANNON",\
>     "points": 2000,\
>     "date": "2021-08-23T03:06:49.290Z"\
>   }\
> ]

### Continue to spend points until you run out and receive an error message

Server response:
> {\
>   "message": "Error: spend amount of 5000 points is larger than the current total balance of 3300 points. Enter a value that is less than or equal to 3300 points"\
> }