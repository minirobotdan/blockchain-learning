import { SHA256 } from 'cryptojs';
import { BehaviorSubject } from 'rxjs';
import { Block } from './block';

export class NaiveBlockChain {
    
    public blockchain: BehaviorSubject<Block[]>;

    constructor() {
        this.blockchain = BehaviorSubject.create();
        this.blockchain.next([this.generateGenesisBlock()]);
    }

    /**
     * Generate original unique block.
     */
    private generateGenesisBlock() {
        return new Block(0, "0", Date.now(), "Genesis Block", "89eb0ac031a63d2421cd05a2fbe41f3ea35f5c3712ca839cbf6b85c4ee07b7a3");
    }

    /**
     * SHA256 encode the contents of a block
     * @param index 
     * @param previousHash 
     * @param timestamp 
     * @param data 
     */
    private calculateHash(index: number, previousHash: String, timestamp: number, data: String) {
        return SHA256(`${index}${previousHash}${timestamp}${data}`);
    }

    /**
     * Utility wrapper function for calculateHash
     * @param block 
     */
    private calculateHashForBlock(block: Block) {
        return this.calculateHash(block.index, block.previousHash, block.timestamp, block.data);
    }

    /**
     * Validate block to ensure it belongs in the chain
     * @param newBlock 
     * @param previousBlock 
     */
    private isValidNewBlock(newBlock: Block, previousBlock: Block) {
        if(previousBlock.index + 1 !== newBlock.index) {
            console.error('Invalid Index');
            return false;
        }
        if(previousBlock.hash !== newBlock.previousHash) {
            console.error('Invalid previous hash');
            return false;
        }
        if(this.calculateHashForBlock(newBlock) !== newBlock.hash) {
            console.error(`Invalid hash- expected: ${this.calculateHashForBlock(newBlock)}, received ${newBlock.hash}`);
            return false;
        }

        return true;
    }

    /**
     * Generates a new block and causes the chain to emit it's new overall value.
     * @param blockData 
     */
    public generateNextBlock(blockData) {
        let newBlock, newChain;

        const currentChain = this.blockchain.getValue(),
            [lastBlock] = currentChain.slice(-1),
            nextIndex = lastBlock.index++,
            timestamp = Date.now(),
            hash = this.calculateHash(nextIndex, lastBlock.hash, timestamp, blockData);

        newBlock = new Block(nextIndex, lastBlock.hash, timestamp, blockData, hash);

        if(this.isValidNewBlock(newBlock, lastBlock)) {
            newChain = currentChain.concat([newBlock]);
            console.info('New block added', newBlock);
            this.blockchain.next(newChain);
            return newBlock;
        } else {
            return false;
        }
        
    }

}