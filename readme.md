This code will trigger a request to get the response from '<https://run.mocky.io/v3/c8a24ac7-7449-40e0-9c72-59c5517c8901?mocky-delay60000ms>'

As it will take a delay of 60000 ms in response , this code will retry by triggering a new request in an exponential time frame 
like, 
500 ms
1000 ms
2000 ms ...

Once we get the response the secret from the response is saved in the cache memory

The secret from cache is retrived to verify if its is stored in cache

For security reasons we will secure this secret in .env file and keep it safe from being viewed by others 

Install below dependencies:
npm i dontenv
npm i axios
npm i node-cache
