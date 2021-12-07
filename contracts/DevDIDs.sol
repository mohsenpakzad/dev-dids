// Be name Khoda
// Bime Abolfazl

// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DevDIDs is ERC721 {

    struct VerifiableCredential {
        address issuer;
        address holder;
        string subject;
        string data;
        uint256 validFrom;
        uint256 validTo;
    }

    struct VerifiablePresentation {
        uint256[] vcs;
        uint256 validFrom;
        uint256 validTo;
    }

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    mapping(uint256 => VerifiableCredential) public verifiableCredentials;

    mapping(address => uint256[]) private verifiableCredentialIssuers;
    mapping(address => uint256[]) private verifiableCredentialHolders;

    event Issue(address issuer, address holder, uint vcId);

    constructor() ERC721("Verifiable Credential", "VC"){}

    function issue(
        address to,
        string memory subject_,
        string memory data_,
        uint256 validFrom_,
        uint256 validTo_
    )
        external
        returns(uint)
    {
        // reject self issuing
        require(msg.sender != to, "self issuing is not permitted");
        // require valid to is greater than valid from
        require(validTo_ > validFrom_, "DevDIDs: vc valid from must be greater than valid to");

        _tokenIds.increment();
        uint256 vcId = _tokenIds.current();

        _safeMint(to, vcId);

        verifiableCredentials[vcId] = VerifiableCredential({
        issuer: msg.sender,
        holder: to,
        subject: subject_,
        data: data_,
        validFrom: validFrom_,
        validTo: validTo_
        });

        verifiableCredentialIssuers[msg.sender].push(vcId);
        verifiableCredentialHolders[to].push(vcId);

        emit Issue(msg.sender, to, vcId);
    }

    function vcsOfIssuer(
        address address_
    )
        external
        view
        returns(uint256[] memory)
    {
        return verifiableCredentialIssuers[address_];
    }

    function vcsOfHolder(
        address address_
    )
        external
        view
        returns(uint256[] memory)
    {
        return verifiableCredentialHolders[address_];
    }

    function generateVp(
        uint256[] calldata userVcs,
        uint256 validFrom_,
        uint256 validTo_
    )
        external
        view
        returns(VerifiablePresentation memory)
    {
        // require valid to is greater than valid from
        require(validTo_ > validFrom_, "DevDIDs: vp valid from must be greater than valid to");

        // check if msg.sender owns all these vcs
        for(uint i = 0 ; i < userVcs.length ; i++){
            require(ownerOf(userVcs[i]) == msg.sender, "All of the vcs must belong to you");
        }

        VerifiablePresentation memory vp = VerifiablePresentation({
        vcs: userVcs,
        validFrom: validFrom_,
        validTo: validTo_
        });

        return vp;
    }

    function verify(
        VerifiablePresentation memory vp,
        address holder
    )
        external
        view
        returns(bool)
    {
        for(uint i = 0 ; i < vp.vcs.length ; i++){
            if(ownerOf(vp.vcs[i]) != holder) return false;
        }
        return true;
    }

}
// Dar panah khoda
