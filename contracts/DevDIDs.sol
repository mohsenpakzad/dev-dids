// Be name khoda
// SPDX-License-Identifier: GPL-3.0-or-later
import "./interfaces/IStruct.sol";

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./interfaces/IHolder.sol";
import "./interfaces/IIssuer.sol";
import "./interfaces/IVerifier.sol";

contract DevDIDs is ERC721, IHolder, IIssuer, IVerifier {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 cnt; 
    mapping (uint256 => VerifiableCredential) private dataRegistery;
    
    constructor() public ERC721("DevDID", "DID") {}

    function awardItem(address holder, uint256 newItemId)
        public
        returns (uint256)
    {
        _mint(holder, newItemId);
        
        return newItemId;
    }

    function issue(address holder, address issuer, bytes32 subject,bytes32 data, uint256 validFrom, uint256 validTo) external returns(VerifiableCredential memory)
    {
        cnt = cnt + 1;
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        VerifiableCredential memory verifiableCredential = VerifiableCredential(holder, issuer, subject, data, validFrom, validTo) ;
        dataRegistery[newItemId] = verifiableCredential;
        
        awardItem(holder, newItemId);
        return verifiableCredential;
    }
    // override
    // function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    //    // require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

    //    // string memory baseURI = _baseURI();
    //    // return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : "";
    //     string memory baseURI = dataRegistery[tokenId].holder + "\n"+   
    // }

    function getVCs(address holder) external view returns(VerifiableCredential[] memory){
       VerifiableCredential[] memory ls = new VerifiableCredential[](15);
       uint256 j;
       j = 0;
        for(uint256 i=0; i< cnt; i++){
            if(holder == ownerOf(i)){
                
              ls[j] = dataRegistery[i];
              j += 1;
            }

        }
        return ls;
    }

}
