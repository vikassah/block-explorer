const { utils, providers, Wallet } = require('ethers');
const {SERVER_PORT, ROPSTEN_API, RINKEBY_API, MAINNET_API, NFT_API} = require('../config');
const express = require('express');
const app = express();
const cors = require('cors');
const port = SERVER_PORT;

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});

// find and return the block details to the client
app.get('/block/:network/:blockNo', (req, res) => {
    const {network, blockNo} = req.params;
    console.log(`Query for ${network} block no: ${blockNo}`);

    if(blockNo === "latest") {
        findBlock(network).then(blk => {
            res.send(blk);
        });
        
    } else {
        findBlock(network, parseInt(blockNo)).then(blk => {
            res.send(blk);
        });
    }

});


// find and return the address balance details to the client
app.get('/address/:network/:address', (req, res, next) => {
    const {network, address} = req.params;
    console.log(`Query for ${network} balance of ${address} `);

    if(address === "") {
        res.send("provide an address")
        
    } else {
        findAcDetails(network, address)
        .then( balance => {
            res.send(`${utils.formatUnits(BigInt(balance))} eth`);
        })
        .catch(error => {
            console.error('ac details call failed: ' + error.message);
            next(error);
        });
    }

});

// get transaction details
app.get('/txn/:network/:txnHash', (req, res, next) => {
    const {network, txnHash} = req.params;
    console.log(`Query for ${network} txn ${txnHash} `);

    if(txnHash === "") {
        res.send("provide an address")
        
    } else {
        findTxnDetails(network, txnHash)
        .then( txn => {
            res.send(txn);
        })
        .catch(error => {
            console.error('txn details failed: ' + error.message);
            next(error);
        });
    }

});

//findAcDetails('mainnet', '0xF7033a2B3316a0Ef52A3002b4136b392916AEbB8');
//findTxnDetails('mainnet', '0x615060e84548c81dbac45c69ecd15a7145dd492cdb4e21809763a8792875d290')


// find transaction details
async function findTxnDetails(_network, _txnHash) {
    const provider = getProvider(_network);

    return(await provider.getTransaction(_txnHash));
}

// find account balance and no of trasactions
async function findAcDetails(_network, _address) {
    const provider = getProvider(_network);

    return(await provider.getBalance(_address));

    //console.log(`Balance: ${utils.formatUnits(BigInt(balance))} eth`);

}

// find latest block of block by block no
async function findBlock(_network, _blockNo=-1) {
    const provider = getProvider(_network);

    if(_blockNo === -1) {
        return(await provider.getBlock());
    } else {
        return(await provider.getBlock(_blockNo));
    }
}



// return right network api config
function getRelevantAPI(_network) {
   
    switch(_network.toUpperCase()) {
        case 'MAINNET':
            return(MAINNET_API);
            break;
        case 'ROPSTEN':
            return(ROPSTEN_API);
            break;
        case 'RINKEBY':
            return(RINKEBY_API);
            break;
        default:
            return(MAINNET_API);
    }
}


// get provider
function getProvider(_network) {
    const networkAPI = getRelevantAPI(_network);
    return(new providers.JsonRpcProvider(networkAPI));
}

