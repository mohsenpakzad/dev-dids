// Be name Khoda
// Bime Abolfazl

// SPDX-License-Identifier: GPL-3.0-or-later

// Primary Author(s)
// Mohsen: https://github.com/mohsenpakzad
// Shima: https://github.com/shima78
// Saina: https://github.com/SainaDaneshmandjahromi
// Amin: https://github.com/OoAminoO

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DevDIDs is ERC721 {
    using Counters for Counters.Counter;

    struct VerifiableCredential {
        address issuer;
        address holder;
        string subject;
        string data;
        uint validFrom;
        uint validTo;
        bool suspended;
    }

    struct VerifiablePresentation {
        uint[] vcs;
        uint validFrom;
        uint validTo;
    }

    Counters.Counter private _tokenIds;
    mapping(uint => VerifiableCredential) private verifiableCredentials;
    mapping(address => uint[]) private verifiableCredentialIssuers;
    mapping(address => uint[]) private verifiableCredentialHolders;

    event Issue(address issuer, address holder, uint vcId);
    event Revoke(address issuer, address holder, uint vcId);
    event Suspend(address issuer, address holder, uint vcId, bool suspended);
    event Delete(address holder, address issuer, uint vcId);

    constructor() ERC721("Developers Decentralized Identifier", "DevDID") {}

    function issue(
        address to,
        string memory subject_,
        string memory data_,
        uint validFrom_,
        uint validTo_
    )
        external
        returns(uint vcId)
    {
        // reject self issuing
        require(msg.sender != to, "DevDIDs: self issuing is not permitted");
        // require valid to is greater than valid from
        require(validTo_ > validFrom_, "DevDIDs: vc valid from must be greater than valid to");

        _tokenIds.increment();
        vcId = _tokenIds.current();

        _safeMint(to, vcId);

        verifiableCredentials[vcId] = VerifiableCredential({
            issuer: msg.sender,
            holder: to,
            subject: subject_,
            data: data_,
            validFrom: validFrom_,
            validTo: validTo_,
            suspended: false
        });

        verifiableCredentialIssuers[msg.sender].push(vcId);
        verifiableCredentialHolders[to].push(vcId);

        emit Issue(msg.sender, to, vcId);
    }

    function revoke(
        uint vcId
    )
        external
    {
        VerifiableCredential memory vc = verifiableCredentials[vcId];
        require(vc.issuer == msg.sender, "DevDIDs: you cannot revoke vc that you not issued");

        _burn(vcId);
        _removeVcFromHolderAndIssuer(vcId, vc.holder, vc.issuer);
        delete verifiableCredentials[vcId];

        emit Revoke(msg.sender, vc.holder, vcId);
    }

    function setSuspended(
        uint vcId,
        bool suspended
    )
        external
    {
        VerifiableCredential storage vc = verifiableCredentials[vcId];
        require(vc.issuer == msg.sender, "DevDIDs: you cannot change suspended status of vc that you not issued");

        vc.suspended = suspended;

        emit Suspend(msg.sender, vc.holder, vcId, suspended);
    }

    function delete_(
        uint vcId
    )
        external
    {
        VerifiableCredential memory vc = verifiableCredentials[vcId];
        require(vc.holder == msg.sender, "DevDIDs: you cannot delete vc that you not held");

        _burn(vcId);
        _removeVcFromHolderAndIssuer(vcId, vc.holder, vc.issuer);
        delete verifiableCredentials[vcId];

        emit Delete(msg.sender, vc.issuer, vcId);
    }

    function getVc(
        uint vcId
    )
        external
        view
        returns(VerifiableCredential memory)
    {
        require(_exists(vcId), "DevDIDs: this vs does not exists");
        return verifiableCredentials[vcId];
    }

    function vcsOfIssuer(
        address address_
    )
        external
        view
        returns(uint[] memory)
    {
        return verifiableCredentialIssuers[address_];
    }

    function vcsOfHolder(
        address address_
    )
        external
        view
        returns(uint[] memory)
    {
        return verifiableCredentialHolders[address_];
    }

    function generateVp(
        uint[] calldata userVcs,
        uint validFrom_,
        uint validTo_
    )
        external
        view
        returns(VerifiablePresentation memory vp)
    {
        // require valid to is greater than valid from
        require(validTo_ > validFrom_, "DevDIDs: vp valid from must be greater than valid to");

        // check if msg.sender owns all these vcs
        for(uint i = 0 ; i < userVcs.length ; i++){
            require(ownerOf(userVcs[i]) == msg.sender, "DevDIDs: all of the vcs must belong to you");
        }

        vp = VerifiablePresentation({
            vcs: userVcs,
            validFrom: validFrom_,
            validTo: validTo_
        });
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

    function _removeVcFromHolderAndIssuer(
        uint vcId,
        address holder,
        address issuer
    )
        private
    {
        uint[] storage holderVcs = verifiableCredentialHolders[holder];
        for (uint i = 0; i < holderVcs.length; i++) {
            if (holderVcs[i] == vcId) {
                delete holderVcs[i];
                break;
            }
        }

        uint[] storage issuerVcs = verifiableCredentialIssuers[issuer];
        for (uint i = 0; i < issuerVcs.length; i++) {
            if (issuerVcs[i] == vcId) {
                delete issuerVcs[i];
                break;
            }
        }
    }
}
// Dar panah khoda
