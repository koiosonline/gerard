export const address = '0xb03c44307c92F77C9DdBc483b4B9c1495f14c2Dd';  // GANACHE address
export let abi = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_did",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "members",
    "outputs": [
      {
        "internalType": "address",
        "name": "memberAddress",
        "type": "address"
      },
      {
        "internalType": "int32",
        "name": "memberReputation",
        "type": "int32"
      },
      {
        "internalType": "bool",
        "name": "accepted",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "pendingMembers",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "posts",
    "outputs": [
      {
        "internalType": "string",
        "name": "owner",
        "type": "string"
      },
      {
        "internalType": "int32",
        "name": "score",
        "type": "int32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "threadNames",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "threads",
    "outputs": [
      {
        "internalType": "string",
        "name": "owner",
        "type": "string"
      },
      {
        "internalType": "int32",
        "name": "score",
        "type": "int32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "string",
        "name": "_did",
        "type": "string"
      }
    ],
    "name": "applyForMember",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "string",
        "name": "_did",
        "type": "string"
      }
    ],
    "name": "approveMember",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "string",
        "name": "_thread",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_did",
        "type": "string"
      }
    ],
    "name": "newThread",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "string",
        "name": "_postId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_did",
        "type": "string"
      }
    ],
    "name": "newPost",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "string",
        "name": "_did",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_postId",
        "type": "string"
      }
    ],
    "name": "deletePost",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "string",
        "name": "_did",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_thread",
        "type": "string"
      }
    ],
    "name": "deleteThread",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "string",
        "name": "_did",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_postId",
        "type": "string"
      },
      {
        "internalType": "int32",
        "name": "_score",
        "type": "int32"
      }
    ],
    "name": "votePost",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "string",
        "name": "_did",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_thread",
        "type": "string"
      },
      {
        "internalType": "int32",
        "name": "_score",
        "type": "int32"
      }
    ],
    "name": "voteThread",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "string",
        "name": "_postId",
        "type": "string"
      }
    ],
    "name": "getPostScore",
    "outputs": [
      {
        "internalType": "int32",
        "name": "",
        "type": "int32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "string",
        "name": "_thread",
        "type": "string"
      }
    ],
    "name": "getThreadScore",
    "outputs": [
      {
        "internalType": "int32",
        "name": "",
        "type": "int32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "string",
        "name": "_did",
        "type": "string"
      }
    ],
    "name": "getMemberReputation",
    "outputs": [
      {
        "internalType": "int32",
        "name": "",
        "type": "int32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getThreadCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]