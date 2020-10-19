const axios = require('axios');
const NodeCache = require('node-cache');
const cache = new NodeCache();
const config = {
    method: 'get',
    url: 'https://run.mocky.io/v3/c8a24ac7-7449-40e0-9c72-59c5517c8901?mocky-delay60000ms',
    headers: {}
};
require('dotenv').config();



async function fetchSecret() {
    try {
        var response = await axios(config)
        return response.data;
    } catch (err) {
        debug.error(err)
    }
}
const withRetries = ({ attempt, maxRetries }) => async (...args) => {
    const slotTime = 500;
    let retryCount = 0;
    do {
        try {
            console.log('args', ...args)
            return await attempt(...args);
        } catch (error) {
            const isLastAttempt = retryCount === maxRetries;
            if (isLastAttempt) {
                // promise rejections so lets log the error.
                console.error(error);
                return Promise.reject(error);
            }
        }
        // Wait for the exponentially increasing delay period before retrying again.
        const delay = 2 ** retryCount * slotTime;
        console.log('Wait Time for response', delay);

        await new Promise(resolve => setTimeout(resolve, delay));
    } while (retryCount++ < maxRetries);
}

//get response randomly
const attempt = (arg1, arg2) => Math.random() < 0.25 ? Promise.resolve(arg1) : Promise.reject(new Error(arg2))


const fetchWithRetry = withRetries({ attempt: attempt, maxRetries: 10 });

fetchWithRetry(fetchSecret()).then((results) => {

    let secret = JSON.parse(results.SecretString)

    //caching the secrets
    cache.mset([{ key: "dbUser", val: secret.DB_USERNAME }, { key: "dbPassword", val: secret.DB_PASSWORD }]);

    //securing the secret in .env file
    process.env['DB_USERNAME'] = secret.DB_USERNAME;
    process.env['DB_PASSWORD'] = secret.DB_PASSWORD;

    //Get saved the Cached Keys
    let getKeys = cache.mget(['dbUser', 'dbPassword'])
    console.log('Cached Keys :', getKeys)
}).catch((err) => {
    console.log(err)
})
