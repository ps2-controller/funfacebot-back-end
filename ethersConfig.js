const ethers = require('ethers');
require('dotenv').config();

//mainnet
//const defaultProvider = ethers.getDefaultProvider("homestead");

//testnet/mainnet
const privateKey = process.env.privateKey;


//dev
// const privateKey = process.env.privateKeyDev;

//rinkeby
let provider = ethers.getDefaultProvider("rinkeby");


//dev
// const url = "http://localhost:8545";
// const provider = new ethers.providers.JsonRpcProvider(url);

const wallet = new ethers.Wallet(privateKey, provider);


module.exports = {
    privateKey: privateKey,
    provider: provider
}
