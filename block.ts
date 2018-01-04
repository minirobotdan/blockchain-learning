export class Block {

    public index: number;
    public previousHash: String;
    public timestamp: number;
    public data: String;
    public hash: String;

    constructor(index: number, previousHash: String, timestamp: number, data: String, hash: String) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash.toString();
    }
}