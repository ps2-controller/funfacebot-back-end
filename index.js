require('dotenv').config();
const ethers = require('ethers');
const express = require('express');
let request = require("request")
const formData = require('express-form-data')
let SlackBot = require('slackbots');
const EthCrypto = require('eth-crypto');
const contracts = require('./Contracts/contracts.js');
const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
var HDWalletProvider = require("truffle-hdwallet-provider");
var privateKey = process.env.privateKey;
var provider = new HDWalletProvider(privateKey, "rinkeby.infura.io/v3/4faf52f5e97a401ea7a59c628d8fa02e");
const Box = require('3box');
/* @reminder
* changed asyncToGenerator directly in node_modules; 
* may have to bring that file to this directory and add 
* a require statement for it
*/ 

const wallet = require('./ethersConfig.js');
const privateDecryptionKey = process.env.privateDecryptionKey;
const app = express();

const thisWallet = new ethers.Wallet(wallet.privateKey, wallet.provider);


async function getImage(spaceId){
    let accessControls = new ethers.Contract(contracts.accessControlsAddress, contracts.accessControlsAbi, thisWallet);
    let arr = await accessControls.getWhiteListBySpace(spaceId);
    console.log(arr)
    let encryptedImages = [];
    for(let i = 0; i < arr.length - 1; i++){
        console.log('hi')
        const toAddEncrypted = await Box.getSpace(arr[i], contracts.accessControlsAddress.toString() + spaceId.toString());
        console.log(toAddEncrypted);
        encryptedImages.push(toAddEncrypted.files);
    }
    let mergedEncryptedImages = [].concat.apply([], encryptedImages);
    let j;
    let mergedDecryptedImages=[]
    let randomImage;
    let randomIndex = Math.floor(Math.random() * Math.floor(mergedEncryptedImages.length))
    let file = await EthCrypto.decryptWithPrivateKey(privateDecryptionKey, mergedEncryptedImages[randomIndex]);
    return file;
}

const slackToken = process.env.fun_face_bot_token;
// create a bot
var bot = new SlackBot({
    token: slackToken, // Add a bot https://my.slack.com/services/new/bot and put the token 
    name: 'Fun Face Bot'
});


const postMessage = (message, user) => {
bot.postMessage(user, message, { as_user: true })
}
bot.on("message", async msg => {
    switch (msg.text) {
    case "photobomb":
      if (msg.channel && msg.bot_id === undefined) {
        let spaceId = {spaceId: 15};
        let img = await getImage(spaceId.spaceId);
        let imgAsBase64 = img.substring(img.indexOf(',') + 1)
        require('fs').writeFileSync('image.png', imgAsBase64, 'base64', (err) => {
          console.log(err);
        })

        await request.post({ url: 'https://slack.com/api/files.upload',
        formData: {
          token: slackToken,
          tile: "Image",
          filename: "image.png",
          filetype: "auto",
          channels: msg.channel,
          file: require('fs').createReadStream('./image.png'),
        },
      }, function (err, response) {
          // just for debugging
          console.log(response.body);
      })};
      

    }
})