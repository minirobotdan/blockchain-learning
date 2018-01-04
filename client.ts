import { NaiveBlockChain } from './index';

const server = new NaiveBlockChain();

server.blockchain.subscribe(update => {
    console.log('Blockchain updated', update);
});

server.generateNextBlock('My new block');