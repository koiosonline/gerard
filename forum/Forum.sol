pragma solidity 0.5.12;

contract Forum {

  struct Member {
    address memberAddress;
    int32 memberReputation;
    bool accepted;
  }

  struct Config {
    string owner; // DID
    int32 score;
  }

  address private owner;
  string[] public threadNames;                    // Thread names!
  mapping (string => Config) public threads;      // Threads!
  mapping (string => Config) public posts;        // Posts!
  mapping (string => Member) public members;      // DID to Member
  mapping (string => bool) public pendingMembers; // DID to isPending

  modifier onlyOwner() {
    require(owner == msg.sender, "Only the contract owner can execute this action");
    _;
  }

  modifier onlyMember(string memory _did) {
    require(members[_did].accepted, "Only members can execute this action");
    _;
  }

  modifier onlyPostOwner(string memory _postId) {
    string memory _did = posts[_postId].owner; // TODO: fix
    require(members[_did].memberAddress == msg.sender, "Only post owner can execute this action");
    _;
  }

  modifier onlyThreadOwner(string memory _thread) {
    string memory _did = threads[_thread].owner; // TODO: fix
    require(members[_did].memberAddress == msg.sender, "Only thread owner can execute this action");
    _;
  }

  constructor(string memory _did) public {
    owner = msg.sender;
    joinAsMember(_did);
  }

  function joinAsMember(string memory _did) private {
    Member memory member;
    member.memberAddress = owner;
    member.memberReputation = 0;
    member.accepted = true;
    members[_did] = member;
  }

  function applyForMember(string memory _did) public {
    require(members[_did].memberAddress == address(0), "Sender is already member");
    Member memory member;
    member.memberAddress = msg.sender;
    member.memberReputation = 0;
    member.accepted = false;
    members[_did] = member;
    pendingMembers[_did] = true;
  }

  function approveMember(string memory _did) public {
    members[_did].accepted = true;
    pendingMembers[_did] = false;
  }

  function newThread(string memory _thread, string memory _did) public onlyMember(_did) {
    threads[_thread] = Config(_did, 0);
    threadNames.push(_thread);
  }

  function newPost(string memory _postId, string memory _did) public
    onlyMember(_did) {
    posts[_postId] = Config(_did, 0);
  }

  function deletePost(string memory _did, string memory _postId) public onlyPostOwner(_did) {
    posts[_postId] = Config("", 0);
  }

  function deleteThread(string memory _did, string memory _thread) public onlyThreadOwner(_did) {
    threads[_thread] = Config("", 0);
  }

  function votePost(string memory _did, string memory _postId, int32 _score) public
  onlyMember(_did) {
    posts[_postId].score += _score;
    string memory _postOwner = posts[_postId].owner;
    members[_postOwner].memberReputation += _score;
  }

  function voteThread(string memory _did, string memory _thread, int32 _score) public
  onlyMember(_did) {
    threads[_thread].score += _score;
    string memory _threadOwner = threads[_thread].owner;
    members[_threadOwner].memberReputation += _score;
  }

  function getPostScore(string memory _postId) public view returns(int32) {
    return posts[_postId].score;
  }

  function getThreadScore(string memory _thread) public view returns(int32) {
    return threads[_thread].score;
  }

  function getMemberReputation(string memory _did) public view returns(int32) {
    return members[_did].memberReputation;
  }

  function getThreadCount() public view returns(uint256) {
    return threadNames.length;
  }

}