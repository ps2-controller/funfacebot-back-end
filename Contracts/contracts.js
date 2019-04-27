

let contracts = {
    accessControls:  {
        //dev address: '0x4dAA575439058687046524711Ee37D3DA796130b',
        address: '0xa76e9A12AC4EbEE6A48178986b454788DB399c7e',
        ABI: [ { "constant": true, "inputs": [ { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" } ], "name": "whitelistForSpace", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xc00c1c18" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" }, { "name": "", "type": "address" } ], "name": "whitelistedForSpace", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xd82da104" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "", "type": "uint256" } ], "name": "newSpaceCreated", "type": "event", "signature": "0xdc0fd1e8438b3ba2a77036f177c63d4702a48c05caeca7dd264b0600a4cb33a6" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "", "type": "uint256" } ], "name": "spaceMemberAdded", "type": "event", "signature": "0x1ad7fe4a37b94f0f9ab6b197d9edecf39383ef9feeb4ea5eef1ed8d09645abf8" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "", "type": "address" } ], "name": "whitelisted", "type": "event", "signature": "0xd936547e15d595cd7e4c0d71ce9ddbc75ae4fd243d310184fbd19390c58a304b" }, { "constant": false, "inputs": [], "name": "createSpace", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x97eb6f18" }, { "constant": false, "inputs": [ { "name": "newMember", "type": "address" }, { "name": "space", "type": "uint256" } ], "name": "addToWhiteList", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x5ac87d76" }, { "constant": true, "inputs": [ { "name": "space", "type": "uint256" } ], "name": "getWhiteListBySpace", "outputs": [ { "name": "", "type": "address[]" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x65d4150a" } ]
    }
}

module.exports = {
    contracts: contracts,
    accessControlsAddress: contracts.accessControls.address,
    accessControlsAbi: contracts.accessControls.ABI
}