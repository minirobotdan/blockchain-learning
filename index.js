"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cryptojs_1 = require("cryptojs");
const rxjs_1 = require("rxjs");
const block_1 = require("./block");
class NaiveBlockChain {
    constructor() {
        this.blockchain = rxjs_1.BehaviorSubject.create();
        this.blockchain.next([this.generateGenesisBlock()]);
    }
    /**
     * Generate original unique block.
     */
    generateGenesisBlock() {
        return new block_1.Block(0, "0", Date.now(), "Genesis Block", "89eb0ac031a63d2421cd05a2fbe41f3ea35f5c3712ca839cbf6b85c4ee07b7a3");
    }
    /**
     * SHA256 encode the contents of a block
     * @param index
     * @param previousHash
     * @param timestamp
     * @param data
     */
    calculateHash(index, previousHash, timestamp, data) {
        return cryptojs_1.SHA256(`${index}${previousHash}${timestamp}${data}`);
    }
    /**
     * Utility wrapper function for calculateHash
     * @param block
     */
    calculateHashForBlock(block) {
        return this.calculateHash(block.index, block.previousHash, block.timestamp, block.data);
    }
    /**
     * Validate block to ensure it belongs in the chain
     * @param newBlock
     * @param previousBlock
     */
    isValidNewBlock(newBlock, previousBlock) {
        if (previousBlock.index + 1 !== newBlock.index) {
            console.error('Invalid Index');
            return false;
        }
        if (previousBlock.hash !== newBlock.previousHash) {
            console.error('Invalid previous hash');
            return false;
        }
        if (this.calculateHashForBlock(newBlock) !== newBlock.hash) {
            console.error(`Invalid hash- expected: ${this.calculateHashForBlock(newBlock)}, received ${newBlock.hash}`);
            return false;
        }
        return true;
    }
    /**
     * Generates a new block and causes the chain to emit it's new overall value.
     * @param blockData
     */
    generateNextBlock(blockData) {
        let newBlock, newChain;
        const currentChain = this.blockchain.getValue(), [lastBlock] = currentChain.slice(-1), nextIndex = lastBlock.index++, timestamp = Date.now(), hash = this.calculateHash(nextIndex, lastBlock.hash, timestamp, blockData);
        newBlock = new block_1.Block(nextIndex, lastBlock.hash, timestamp, blockData, hash);
        if (this.isValidNewBlock(newBlock, lastBlock)) {
            newChain = currentChain.concat([newBlock]);
            console.info('New block added', newBlock);
            this.blockchain.next(newChain);
            return newBlock;
        }
        else {
            return false;
        }
    }
}
exports.NaiveBlockChain = NaiveBlockChain;
