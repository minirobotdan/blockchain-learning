"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const server = new index_1.NaiveBlockChain();
server.generateNextBlock('My new block');
