const axios = require("axios");

const fetch = async (data) => {
    switch (data.method.toUpperCase()) {
        case 'GET':
            return await axios.get(data.url);
        case 'POST':
            return await axios.post(data.url, data?.body);
        case 'PUT':
            return await axios.put(data.url, data?.body);
        case 'DELETE':
            return await axios.delete(data.url);
        default:
            return await axios.get(data.url);
    }
}


module.exports = fetch;