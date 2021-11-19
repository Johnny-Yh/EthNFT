const { deployUSDT,
        printContracts} = require("./deploy.js");

const { timeConverter} = require("./utils.js");

const fs = require('fs');
//const { platform } = require("os");

async function main() {

    let tx;
    
    [deployer, platformA, User] = await ethers.getSigners();
    console.log(`> [INIT]: Accounts ... OK`);

    //CUSDT = await deployUSDT();
    //console.log(`> [DPLY]: Starting to deploy USDT Token ... OK`);


    //let contracts = {USDT: CUSDT}; 
    let contracts = {}; 

    console.log(`> [DPLY]: Starting to deploy ...`);
    console.log(`>>> [INFO]: deployer=${deployer.address}`);
    console.log(`>>> [INFO]: platformA=${platformA.address}`);
    //console.log(`>>> [INFO]: User=${User.address}`);

    // 部署 DigitalSource 合约
    const DigitalSourceContract = await ethers.getContractFactory("DigitalSource");
    const DigitalSource = await DigitalSourceContract.deploy(); 
    await DigitalSource.deployed();
    contracts.DigitalSource = DigitalSource;
    console.log(`>>> [DPLY]: DigitalSource deployed, address=${DigitalSource.address}, block=${DigitalSource.deployTransaction.blockNumber}`);

    // 部署 ArtGeeNft 合约
    const ArtGeeNftContract = await ethers.getContractFactory("ArtGeeNft");
    const ArtGeeNft = await ArtGeeNftContract.deploy(DigitalSource.address);
    await ArtGeeNft.deployed();
    contracts.ArtGeeNft = ArtGeeNft;
    console.log(`>>> [DPLY]: ArtGeeNft deployed, address=${ArtGeeNft.address}, block=${ArtGeeNft.deployTransaction.blockNumber}`);

    // 转让管理员权限
    await DigitalSource.transferOperator(ArtGeeNft.address);
    console.log('>>> [DPLY]: transfer success');

    // 部署 EnglishAuction 合约
    const EnglishAuctionContract = await ethers.getContractFactory("EnglishAuction");
    console.log(`> [DPLY]: Starting to deploy EnglishAuction...`);
    tx = await ArtGeeNft.deployed();
    //console.log("tx1 = ", tx.address);
    const EnglishAuction = await EnglishAuctionContract.deploy(tx.address, platformA.address);
    await EnglishAuction.deployed();
    contracts.EnglishAuction = EnglishAuction;
    console.log(`>>> [DPLY]: EnglishAuction deployed, address=${EnglishAuction.address}, block=${EnglishAuction.deployTransaction.blockNumber}`);

    // 部署 FixedAuction 合约
    const FixedAuctionContract = await ethers.getContractFactory("FixedAuction");
    console.log(`> [DPLY]: Starting to deploy FixedAuction...`);
    tx = await ArtGeeNft.deployed();
    //console.log("tx2 = ", tx.address);
    const FixedAuction = await FixedAuctionContract.deploy(tx.address, platformA.address);
    await FixedAuction.deployed();
    contracts.FixedAuction = FixedAuction;
    console.log(`>>> [DPLY]: FixedAuction deployed, address=${FixedAuction.address}, block=${FixedAuction.deployTransaction.blockNumber}`);

    // 设置合约参数
    console.log('>>> [set]: addTransferList start');
    tx = await EnglishAuction.deployed();
    await ArtGeeNft.addTransferList(tx.address);

    tx = await FixedAuction.deployed();
    await ArtGeeNft.addTransferList(tx.address);
    console.log('>>> [set]: addTransferList success');


    // 部署测试 TestNft
    // const TestNftContract = await ethers.getContractFactory("TestNft");
    // const TestNft = await TestNftContract.deploy();
    // tx = TestNft.deployTransaction;
    // await tx.wait();
    // contracts.TestNft = TestNft;
    // console.log(`>>> [DPLY]: TestNft deployed, address=${TestNft.address}, block=${TestNft.deployTransaction.blockNumber}`);

    // 地址写入 json 文件中
    let bn = tx.blockNumber;
    let ts = (await ethers.provider.getBlock(bn)).timestamp;
    let nw = (await ethers.provider.getNetwork()).name;
    if (nw === "unknown") {
        nw = network.name;
    }
    console.log(`>>>       network=${nw}, time=${timeConverter(ts)} `);
    
    let addrOfArtGee = {network: nw, block: bn, timestamp: timeConverter(ts)};
    Object.entries(contracts).forEach((e) => {
        const [k, v] = e;
        addrOfArtGee[k] = v.address;
    })

    console.log(`>>> [DPLY] deploy contract ... OK`);

    printContracts("json", addrOfArtGee);

    const filename = `./scripts/contracts_${network.name}.json`;

    // 相应部署地址写入 json 文件中
    fs.writeFileSync (filename, JSON.stringify(addrOfArtGee, null, 4), function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
   
}

main()
    .then( () => process.exit( 0 ) )
    .catch( err => {
        console.error(err);
        process.exit( 1 );
    });