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
    let i;
    let encryptedImages = [];
    for(i = 0; i < arr.length; i++){
        const toAddEncrypted = await Box.getSpace(arr[i], contracts.accessControlsAddress.toString() + spaceId.toString());
        // console.log(toAddEncrypted['files']);
        // let box = await Box.openBox(arr[i], provider);
        // box.onSyncDone(async () => {
        //     console.log('hi');
        //     let workSpace = await box.openSpace(contracts.accessControls.address.toString() + spaceId.toString());
        //     let toAddEncrypted = await workSpace.public.get('field');
        encryptedImages.push(toAddEncrypted['files']);
        // })
    }
    let mergedEncryptedImages = [].concat.apply([], encryptedImages);
    // console.log(mergedEncryptedImages);
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

const getRandomJoke = (callback, user) => {
    return request("https://icanhazdadjoke.com/slack", (error, response) => {
      if (error) {
        console.log("Error: ", error)
      } else {
        let jokeJSON = JSON.parse(response.body)
        let joke = jokeJSON.attachments[0].text
        return callback(joke, user)
      }
    })
  }

const postMessage = (message, user) => {
bot.postMessage(user, message, { as_user: true })
}
bot.on("message", async msg => {
    switch (msg.text) {
    case "n":
      if (msg.channel[0] === "D" && msg.bot_id === undefined) {
        let spaceId = {spaceId: 13};
        let img = await getImage(spaceId.spaceId);
        let imgAsBase64 = img.substring(img.indexOf(',') + 1)
        await require('fs').writeFile('image.png', imgAsBase64, 'base64', (err) => {
          console.log(err);
        })

        await request.post({ url: 'https://slack.com/api/files.upload',
        formData: {
          token: slackToken,
          tile: "Image",
          filename: "image.png",
          filetype: "auto",
          channels: "testing",
          file: require('fs').createReadStream('./image.png'),
        },
      }, function (err, response) {
          // just for debugging
          console.log(response);
      })};
      

    }
})

