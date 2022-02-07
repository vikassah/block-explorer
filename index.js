import "./index.scss";
const {SERVER_PORT, NFT_API} = require('./config');
const axios = require('axios');
const { utils } = require('ethers');
const server = "http://localhost:" + SERVER_PORT;

// get block by block ID
document.getElementById("get-block-no").addEventListener('click', () => {
    const blockNo = document.getElementById('block-no').value;

    let select = document.getElementById('my-network');
    let network = select.options[select.selectedIndex].value;
    console.log(`block no: ${blockNo}`);
    if(blockNo.length === 0) {
        document.getElementById("block-content").innerHTML = "<p class='error'>please enter a valid block no.</p>";
        return;
    } else {
        axios.get(`${server}/block/${network}/${blockNo}`)
        .then(function (response) {
            console.log(response.data);
            let content = 
                "<li>hash:" + response.data.hash + "</li>" +
                "<li>number:" + response.data.number + "</li> Transactions <br />";

            for(let i=0; i < response.data.transactions.length; i++) {
                content = content.concat(`<li><a href=${server}/txn/${network}/${response.data.transactions[i]}>${response.data.transactions[i]}</aa></li>`);
            }

            document.getElementById('block-content').innerHTML = content;

            // console.log(response.status);
            // console.log(response.statusText);
            // console.log(response.headers);
            // console.log(response.config);
        });
    }
});

// get latest block
document.getElementById("get-latest-block").addEventListener('click', () => {
    let select = document.getElementById('my-network');
    let network = select.options[select.selectedIndex].value;
    console.log(`${server}/block/${network}/latest`);
   
    axios.get(`${server}/block/${network}/latest`)
    .then(function (response) {
        console.log(response.data);

        document.getElementById('block-content').innerHTML = 
            "<li>hash:" + response.data.hash + "</li>" +
            "<li>number:" + response.data.number + "</li> Transactions <br />";

        for(let i=0; i < response.data.transactions.length; i++) {
            document.getElementById('block-content').innerHTML += 
                 `<li><a href=${server}/txn/${network}/${response.data.transactions[i]}>${response.data.transactions[i]}</aa></li>`;
            
        }
        // console.log(response.status);
        // console.log(response.statusText);
        // console.log(response.headers);
        // console.log(response.config);
  });
});

// get txn by txn hash
document.getElementById("get-txn-details").addEventListener('click', () => {
    const txnHash = document.getElementById('txn-hash').value;

    let select = document.getElementById('my-network');
    let network = select.options[select.selectedIndex].value;

    if(txnHash.length === 0) {
        document.getElementById('block-content').innerHTML = "<p class='error'>please enter a valid txn hash.</p>";
        return;
    }

    //
    axios.get(`${server}/txn/${network}/${txnHash}`)
    .then(function (response) {
        console.log(response.data);
        let content = `Block No: ${response.data.blockNumber} <br />
                        From: ${response.data.from} <br />
                        To: ${response.data.to} <br />
                        Value:` +  utils.formatUnits(BigInt(response.data.value.hex)).toString() + " eth";

        document.getElementById('block-content').innerHTML = content;

        console.log(response.status);
        console.log(response.statusText);
        console.log(response.headers);
        console.log(response.config);
  });
});

// get account details
document.getElementById("get-ac-details").addEventListener('click', () => {
    let select = document.getElementById('my-network');
    let network = select.options[select.selectedIndex].value;
    const address = document.getElementById('account-no').value;
    console.log(`${server}/address/${network}/${address}`);

    let content = "";
    if(address.length === 0 || !utils.isAddress(address)) {
        document.getElementById('block-content').innerHTML = "<p class='error'>please enter a valid account no.</p>";
        return;
    }
   
    axios.get(`${server}/address/${network}/${address}`)
    .then(function (response) {
        console.log(response.data);

        content = `Account Balance: ${response.data}`;
        document.getElementById('block-content').innerHTML = content;
            
        /* console.log(response.status);
        console.log(response.statusText);
        console.log(response.headers);
        console.log(response.config); */
    }).then(
        axios.get(`${NFT_API}owner=${address}`)
        .then(function (response) {
            console.log(response.data);
            content = content.concat("<br/>" + `No. of NFTs owned: ${response.data.assets.length}`)

            document.getElementById('block-content').innerHTML = content;
                
            // console.log(response.status);
            // console.log(response.statusText);
            // console.log(response.headers);
            // console.log(response.config);
    }));
});
