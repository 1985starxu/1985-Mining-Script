// StarXuToken Mining script

const { Web3 } = require("web3");
const crypto = require("crypto");

const ABI = [
    { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
    { "anonymous": false, "inputs": [
        { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
        { "indexed": true, "internalType": "address", "name": "spender", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
      ], "name": "Approval", "type": "event" },
    { "anonymous": false, "inputs": [
        { "indexed": false, "internalType": "uint256", "name": "bits", "type": "uint256" },
        { "indexed": false, "internalType": "uint256", "name": "target", "type": "uint256" }
      ], "name": "DifficultyChanged", "type": "event" },
    { "anonymous": false, "inputs": [
        { "indexed": true, "internalType": "address", "name": "miner", "type": "address" },
        { "indexed": true, "internalType": "bytes32", "name": "solution", "type": "bytes32" },
        { "indexed": true, "internalType": "bytes32", "name": "digest", "type": "bytes32" },
        { "indexed": false, "internalType": "uint256", "name": "reward", "type": "uint256" },
        { "indexed": false, "internalType": "uint256", "name": "newTotalSupply", "type": "uint256" }
      ], "name": "Mined", "type": "event" },
    { "anonymous": false, "inputs": [
        { "indexed": false, "internalType": "uint256", "name": "blockNumber", "type": "uint256" }
      ], "name": "MiningCompleted", "type": "event" },
    { "anonymous": false, "inputs": [
        { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
        { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
      ], "name": "Transfer", "type": "event" },
    { "anonymous": false, "inputs": [
        { "indexed": true, "internalType": "address", "name": "who", "type": "address" },
        { "indexed": false, "internalType": "bool", "name": "allowed", "type": "bool" }
      ], "name": "WhitelistUpdated", "type": "event" },
    { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "bytes32", "name": "solution", "type": "bytes32" }], "name": "mine", "outputs": [{ "internalType": "bytes32", "name": "digest", "type": "bytes32" }], "stateMutability": "payable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "who", "type": "address" }, { "internalType": "bool", "name": "allowed", "type": "bool" }], "name": "setWhitelist", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "currentChallenge", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "isWhitelisted", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "LIQUIDITY_MANAGER", "outputs": [{ "internalType": "address payable", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "MAX_SUPPLY", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "MINE_FEE_WEI", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "MINE_REWARD", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "minedAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "MINING_POOL_INITIAL", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "miningCompletedBlock", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "usedDigests", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }
];

function parseArgs() {
    const args = process.argv.slice(2);
    const out = {};
    for (let i = 0; i < args.length; i++) {
        if (args[i] === "--address" && i + 1 < args.length) out.address = args[++i];
        else if (args[i] === "--once") out.once = true;
    }
    return out;
}

function assertEnv(name) {
    const v = process.env[name];
    if (!v || v.length === 0) throw new Error(`Missing env ${name}`);
    return v;
}

function bytes32RandomHex() {
    return "0x" + crypto.randomBytes(32).toString("hex");
}

function toBytes32(text) {
    const buf = Buffer.alloc(32);
    const src = Buffer.from(text, "utf8");
    if (src.length > 32) {
        throw new Error("CHALLENGE text too long for bytes32");
    }
    src.copy(buf, 0);
    return "0x" + buf.toString("hex");
}

function computeDigest(web3, solutionHex, challengeHex, minerAddress) {
    const encoded = web3.eth.abi.encodeParameters(["bytes32","bytes32","address"], [solutionHex, challengeHex, minerAddress]);
    return web3.utils.keccak256(encoded);
}

function isDigestValid(digest, targetPrefix) {
    return (digest || "").toLowerCase().startsWith(targetPrefix.toLowerCase());
}

function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

function padLabel(s, w = 28) {
    if (s.length >= w) return s;
    return s + " ".repeat(w - s.length);
}

function fmtEther(web3, wei) {
    try { return web3.utils.fromWei(String(wei), "ether"); } catch { return String(wei); }
}

function fmtUnits18(web3, v) {
    try { return web3.utils.fromWei(String(v), "ether"); } catch { return String(v); }
}

async function main() {
    const DEFAULT_CONTRACT = "0xcb19f41D79B124d9636cBf7F742570845C6AFeB8";

    const { address: cliAddress, once } = parseArgs();
    const rpcUrl = assertEnv("RPC_URL");
    const privateKey = assertEnv("PRIVATE_KEY");
    const feeWei = process.env.FEE_WEI || "10000000000000000"; 
    const challengeText = process.env.CHALLENGE || null; 

    const web3 = new Web3(rpcUrl);
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;

    const contractAddress = cliAddress || DEFAULT_CONTRACT;
    const contract = new web3.eth.Contract(ABI, contractAddress);

    let chainId = null;
    try { chainId = await web3.eth.getChainId(); } catch {}
    let codeAt = null;
    try { codeAt = await web3.eth.getCode(contractAddress); } catch {}
    console.log(padLabel("RPC"), `${rpcUrl}  (chainId: ${chainId ?? "?"})`);


    let challengeHex;
    let challengeReadOk = false;
    try {
        const onchainChallenge = await contract.methods.currentChallenge().call();
        if (onchainChallenge && onchainChallenge !== "0x" && onchainChallenge.length === 66) {
            challengeHex = onchainChallenge;
            challengeReadOk = true;
        }
    } catch (e) {
        challengeReadOk = false;
    }
    if (!challengeReadOk) {
        const text = challengeText || "starxu";
        challengeHex = toBytes32(text);
    }
    let poolInitialBN;
    let minedBN;
    for (;;) {
        try {
            const ts = BigInt(await contract.methods.totalSupply().call());
            poolInitialBN = ts / 2n;
            const bal = BigInt(await contract.methods.balanceOf(contractAddress).call());
            minedBN = poolInitialBN - bal;
            const fee = await contract.methods.MINE_FEE_WEI().call();
            const name = await contract.methods.name().call();
            const symbol = await contract.methods.symbol().call();
            const decimals = await contract.methods.decimals().call();
            const lm = await contract.methods.LIQUIDITY_MANAGER().call();
            const minerBalWei = await web3.eth.getBalance(account.address);

            console.log(padLabel("Contract"), contractAddress);
            console.log(padLabel("Token"), `${name} / ${symbol} / ${decimals}`);
            console.log(padLabel("Miner address"), account.address);
            console.log(padLabel("Miner balance"), `${fmtEther(web3, minerBalWei)} OKB`);
            break;
        } catch (e) {
            await sleep(5000);
        }
    }
    function calcTargetPrefixBN(mined, poolInitial) {
        if (mined === null || poolInitial === null || poolInitial === 0n) return "0x01985531";
        const percent = (mined * 100n) / poolInitial;
        if (percent < 30n) return "0x01985";
        if (percent < 60n) return "0x019855";
        if (percent < 80n) return "0x0198553";
        return "0x01985531";
    }
    let targetPrefix = calcTargetPrefixBN(minedBN, poolInitialBN);

    console.log(padLabel("currentChallenge(raw)"), challengeHex);
    console.log(padLabel("Target prefix"), targetPrefix);
    const progressBp = poolInitialBN > 0n ? (minedBN * 10000n) / poolInitialBN : 0n;
    const progressStr = `${progressBp / 100n}.${(progressBp % 100n).toString().padStart(2, '0')}%`;
    console.log(padLabel("Progress"), progressStr);

    let attempts = 0;
    let lastLog = Date.now();
    const REFRESH_MS = 15 * 60 * 1000;
    let lastRefresh = Date.now();
    let keepMining = true;
    process.on("SIGINT", () => { keepMining = false; console.log("\nStopping..."); });

    while (keepMining) {
        const solution = bytes32RandomHex();
        const digest = computeDigest(web3, solution, challengeHex, account.address);
        attempts++;

        if (isDigestValid(digest, targetPrefix)) {
            try {
                const tx = contract.methods.mine(solution);
                const gasEstimated = await tx.estimateGas({ from: account.address, value: feeWei });
                const gas = (BigInt(gasEstimated) * 12n / 10n).toString();
                const gasPrice = await web3.eth.getGasPrice();
                const txData = {
                    from: account.address,
                    to: contractAddress,
                    value: feeWei,
                    data: tx.encodeABI(),
                    gas,
                    gasPrice
                };
                const signed = await web3.eth.accounts.signTransaction(txData, privateKey);
                const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
                const txHash = receipt && receipt.transactionHash ? receipt.transactionHash : null;
                const blockNo = receipt && typeof receipt.blockNumber !== "undefined" ? String(receipt.blockNumber) : "?";
                const statusStr = receipt && typeof receipt.status !== "undefined" ? (receipt.status ? "success" : "failed") : "unknown";
                console.log("Mined! Block:", blockNo);
                if (txHash) console.log("Tx:", txHash);
                console.log("Status:", statusStr);
                try {
                    const gasUsedBN = BigInt(receipt && receipt.gasUsed ? receipt.gasUsed : 0);
                    const gasPriceBN = BigInt(gasPrice || 0);
                    if (gasUsedBN > 0n) console.log("Gas used:", String(gasUsedBN));
                    if (gasUsedBN > 0n && gasPriceBN > 0n) {
                        const feeSpentWei = (gasUsedBN * gasPriceBN).toString();
                        console.log("Tx fee (OKB):", fmtEther(web3, feeSpentWei));
                    }
                } catch {}
                console.log("Solution:", solution);
                console.log("Digest:", digest);
                if (once) break;
                attempts = 0;
                lastLog = Date.now();
            } catch (err) {
                console.error("Mine tx failed:", err.message || err);
            }
        }

        const now = Date.now();
        if (now - lastRefresh >= REFRESH_MS) {
            try {
                const ts = BigInt(await contract.methods.totalSupply().call());
                const pi = ts / 2n;
                const bal = BigInt(await contract.methods.balanceOf(contractAddress).call());
                const mined = pi - bal;
                targetPrefix = calcTargetPrefixBN(mined, pi);
                const p = pi > 0n ? (mined * 10000n) / pi : 0n;
                const pStr = `${p / 100n}.${(p % 100n).toString().padStart(2, '0')}%`;
                console.log(padLabel("Target prefix"), targetPrefix);
                console.log(padLabel("Progress"), pStr);
            } catch (e) {
            }
            lastRefresh = now;
        }

        if (now - lastLog >= 2000) {
            const rate = Math.round((attempts * 1000) / (now - lastLog));
            console.log(`Attempts: ${attempts} | ~${rate} H/s | Target: ${targetPrefix}`);
            attempts = 0;
            lastLog = now;
        }
    }

    console.log("Stopped.");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});


