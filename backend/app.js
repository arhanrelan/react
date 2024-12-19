import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

const port = process.env.PORT || 3000;

// Function to make a simple API call
const makeApiCall = async (apiURL, apiOptions) => {
    try {
        const response = await fetch(apiURL);
        return response;
    } catch (err) {
        console.error(err);
        return null;
    }
};

app.all('/api', async function(req, res, next) {
    let url = req.originalUrl
    url = url.split('/api?url=')[1]
    try {
        const resObj=await makeApiCall(url, []);
        if (!resObj) {
            res.status(502).send({'message': 'Proxy server received an invalid response from the API server'});
        } else {
            const content = await resObj.json();
            res.status(resObj.status).send(content);
        }
    } catch (err) {
        res.status(500).send({'message': `Proxy server unable to process the request due to the following error:\n${err}`});
    }
    next();
});

app.listen(port);
console.log(`Server started at http://localhost: ${port}`);