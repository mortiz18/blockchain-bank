
const SHA256 = require('crypto-js/sha256');


class Account{
  constructor (accountNumber, name, balance){
    this.accountNumber = accountNumber;
    this.name = name;
    this.balance = balance;
  }

  depositFund(amount){
    this.balance += amount;
  }

  withdrawFund(amount){
    if (amount > this.balance){
      return console.log("Insufficient funds");
    }

    this.balance -= amount;
  }
}

class Block {

  constructor(account, previousHash = ''){
    this.index = 0;
    this.timestamp = new Date();
    this.Account = account;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash(){
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.Account)).toString();
  }

}


class BlockChain{

  constructor(){
    this.chain = [this.createGenesisBlock()];
    this.index = 0;
  }

  createGenesisBlock(){
    let genesis = new Account("0", "Genesis", 0);
    return new Block(genesis);
  }

  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock){
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    newBlock.index = this.index++;

    this.chain.push(newBlock);
  }

  isChainValid(){
    for(let i = 1; i < this.chain.length; i++){
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()){
        return false;
      }

      if(currentBlock.previousHash !== previousBlock.hash){
        return false;
      }
    }

    return true;
  }
}

let myCoin = new BlockChain();
let myaccount = new Account("001", "First Account", 5);
myCoin.addBlock(new Block(myaccount));

// console.log(JSON.stringify(myCoin, null, 4));
console.log('Is chain valid?: ' + myCoin.isChainValid());

myCoin.chain[1].Account.balance = 10;

console.log('Is chain valid?: ' + myCoin.isChainValid());
