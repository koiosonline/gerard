// SPDX-License-Identifier: MIT
// Adapted from https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/token/ERC20
// https://raw.githubusercontent.com/web3examples/ethereum/master/token_examples/VeryBasicToken.sol

pragma solidity ^0.7.0;

contract ERC20Token {
    string private _name;
    string private _symbol;
    uint8 private _decimals;
    address public  _admin;
	address public _factory;
	
	string private _tokenURI;
    mapping (address => uint256) private _balances;
    uint256 private _totalSupply;

    event Transfer(address indexed from, address indexed to, uint256 value);
	
    modifier isAdmin {
        require( (msg.sender == _admin) || (msg.sender==_factory),"Must have admin role");
        _;
    }
    constructor (string memory name, string memory symbol, uint8 decimals,string memory tokenURI,address admin) {
	    _admin = admin;
        _name = name;
        _symbol = symbol;
        _decimals = decimals;
		_factory = msg.sender;
		_tokenURI = tokenURI;
        _mint(admin, 10000 * (10 ** uint256(_decimals)));
    }
	function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        _balances[sender] = sub(_balances[sender],amount);
        _balances[recipient] = add(_balances[recipient],amount);
        emit Transfer(sender, recipient, amount);
    }
    function _mint(address account, uint256 amount) internal isAdmin {
        require(account != address(0), "ERC20: mint to the zero address");
        _totalSupply = add(_totalSupply,amount);
        _balances[account] = add(_balances[account],amount);
        emit Transfer(address(0), account, amount);
    }

// public functions -------------------------------------------------------------------------------
    function name() public view returns (string memory) {
        return _name;
    }
    function symbol() public view returns (string memory) {
        return _symbol;
    }
    function decimals() public view returns (uint8) {
        return _decimals;
    }
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }  
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        uint256 c = a - b;
        return c;
    }
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }
    function transfer(address recipient, uint256 amount) public returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }
    function adminmint(uint256 amount) public isAdmin {
		_mint(msg.sender, amount);
	}
	
	function tokenURI() public view returns (string memory) {
        return _tokenURI;
    }
	
	function setTokenURI(string memory settokenURI) public isAdmin {
         _tokenURI = settokenURI;
    }
	
	function destroy() public isAdmin {         
        selfdestruct(msg.sender);
    }
}

contract ERC20TokenFactory {
	address public  admin;
	ERC20Token[] public tokens;
	constructor () {
	    admin = msg.sender;       
    }
	modifier isAdmin {
        require(msg.sender == admin,"Must have admin role");
        _;
    }
    function createToken(string memory _name, string memory _symbol, uint8 _decimals,string memory _tokenURI) public isAdmin returns (ERC20Token)  {
        tokens.push(new ERC20Token(_name, _symbol, _decimals,_tokenURI,admin));
    }
	function NrTokens() public view returns(uint256) {
	   return tokens.length;
	}
	function destroy() public isAdmin {         
		uint arrayLength = tokens.length;
        for (uint i = 0; i < arrayLength; i++) 
            tokens[i].destroy();
        selfdestruct(msg.sender);
    }
}