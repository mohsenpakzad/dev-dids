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

    constructor() public ERC721("DevDID", "DID") {}

    function awardItem(address holder, string memory tokenURI)
        public
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(holder, newItemId);
        // _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    // function issue(address issuer, address subject,bytes32 data, uint256 validFrom, uint256 validTo) external returns(VerifiableCredential memory)
    // {
    //     VerifiableCredential verifiableCredential = VerifiableCredential(issuer, subject, data, validFrom, validTo) ;
    // }
    
}
