const axios = require("axios");

const fetch = async (data) => {
    switch (data.method) {
        case 'get':
            return await axios.get(data.url);
        case 'post':
            return await axios.post(data.url, data.body);
        case 'put':
            return await axios.put(data.url, data.body);
        case 'delete':
            return await axios.delete(data.url);
        default:
            return await axios.get(data.url);
    }
}


module.exports = fetch;