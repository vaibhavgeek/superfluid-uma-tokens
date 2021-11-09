## KPI Options Token Distribution via Superfluid Streams
### Step 1:  Deploy UMA KPI Options Contract

- Clone the repository https://github.com/UMAprotocol/launch-lsp
-  `cd launch-lsp`
- Make sure you have enough UMA tokens on testnet kovan account. Use the seed phrase in the command below. 
- Create an infura account and get project link.

```
node index.js \
--gasprice 80 \
--url https://kovan.infura.io/v3/-id- \
--mnemonic "secret phrase" \
--pairName "UMA Streaming Platform" \
--expirationTimestamp 1640966400 \
--collateralPerPair 1000000000000000000 \
--priceIdentifier UMAUSD \
--longSynthName "UMA Streaming Platform Token" \
--longSynthSymbol UMA-STREAM-PLT \
--shortSynthName "UMA Streaming Platform Token" \
--shortSynthSymbol UMA-STREAM-SHORT \
--collateralToken 0x489Bf230d4Ab5c2083556E394a28276C22c3B580 \
--customAncillaryData "Metric:Time in Streaming minutes,Endpoint:"http://localhost:3000/kpi_targets",Method:"https​://github.com/vaibhavgeek/superfluid-uma-tokens",Key: TimeToLive,Interval:Real Time Update,Rounding:-6,Scaling:-6" \
--optimisticOracleLivenessTime 3600 \
--fpl Linear \
--lowerBound 0 \
--upperBound 1000000000000000000 \
--prepaidProposerBond 20000000000000000000 \
--optimisticOracleProposerBond 40000000000000000000
```
You will get  longToken and shortTokens, we will now create super token from longTokens to be distributed among the recipients of the KPI achievers.

### Step 2: Create an ERC-20 super token using command line. 

You can easily create super token by using superfluid tools. You can follow the instructions provided [here](https://docs.superfluid.finance/superfluid/docs/super-tokens#erc20-wrapper-super-token) . 
You will get an super token address which you will have to enter later on. 

### Step 3:  Send KPI Long Tokens to workers based on API real time. 

For the sake of this demo, a mock api is created which shows proof of work done by addresses along with how much contribution they have made. You can check the API on, 
`https://run.mocky.io/v3/2e64e74b-b232-431c-804a-8a5b0b0bf113`.

Now you have to run, 
`yarn install` and `yarn start` this will redirect you to a form where you need to enter the obtained ERC-20 Wrapped Long Token from step 2. 
Now, a calculation of IDA (Instant Distribution Agreement) is made based on the data obtained from the API. Now, the long tokens are streamed on basis of this IDA to all the recipients of KPI options contract parameters. 
				
