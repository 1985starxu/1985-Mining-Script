## StarXuToken Miner (starxu-miner.js)

A simple CPU miner for the StarXuToken contract. It continuously searches for a valid solution by hashing `(solution, challenge, minerAddress)` and submits a `mine` transaction when the digest matches the dynamic target prefix.

### Features
- Reads on-chain `currentChallenge`
- Adaptive target prefix based on mining progress
- Displays attempts, approximate hash rate, progress, and gas/fee stats
- Configurable contract address and fee

### Prerequisites
- Node.js 18+ recommended
- A funded account on the target network (native coin for gas and `MINE_FEE_WEI`)

### Install
```bash
npm install
```

### Configuration
Create a `.env` file at the project root:
```bash
# Required
RPC_URL=https://xlayer.drpc.org
PRIVATE_KEY=0x YOUR_PRIVATE_KEY


```

- RPC_URL: HTTP RPC endpoint for the target chain
- PRIVATE_KEY: Private key of the miner account (no quotes)

### Usage
- Using npm script:
```bash
npm run mine
```

- Directly with Node (loads `.env` automatically):
```bash
node -r dotenv/config starxu-miner.js
```

-Flags: 

- `--once`: Stop after the first successful mine

- Stop with Ctrl+C.

### What it does
1. Connects to `RPC_URL` and unlocks the account from `PRIVATE_KEY`.
2. Reads contract metadata (name, symbol, decimals) and prints miner balance (OKB).
3. Fetches `currentChallenge()`; if unavailable, uses `CHALLENGE` (default text: `starxu`) encoded to `bytes32`.
4. Repeatedly: 
- Generates a random `bytes32` solution. 
- Computes digest = `keccak256(abi.encode(solution, challenge, minerAddress))`. 
- If digest starts with the current target prefix, sends `mine(solution)` 
- Logs tx hash, status, gas used, and fees.
5. Periodically refreshes target prefix based on mining progress.

### Output (example)
- Connection info: RPC URL and chainId
-Token and miner info
- Progress percentage and target prefix
- Loop log: `Attempts: <n> | ~<rate> H/s | Target: <prefix>`
- On success: block number, tx hash, status, gas used, fee spent, solution, digest

### Tips
- Ensure your account has enough OKB for gas and `FEE_WEI`.
- If you see `codeAt` empty or failures reading `currentChallenge`, verify the network and contract address.
- Adjust `FEE_WEI` per chain economics to avoid underpriced transactions.
- This is a single-threaded CPU miner; you can run multiple processes for parallelism.

### Troubleshooting
- Missing env RPC_URL/PRIVATE_KEY: set them in `.env`.
- Insufficient funds: top up native coin (OKB depending on chain).
- Wrong network: chainId in logs should match your expectation.
- Nonce or gas errors: try raising `FEE_WEI` and ensure the RPC is healthy.
- Private key promotion error: Please add 0x in front of the private key

### Security
- Keep your `PRIVATE_KEY` safe. Do not commit `.env`.
- Use a dedicated wallet for mining.
