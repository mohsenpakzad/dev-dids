// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.10;

interface IVerifiableCredential {

    /* ========== STRUCTS ========== */

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

    /* ========== EVENTS ========== */

    event Issue(address issuer, address holder, uint vcId);
    event Revoke(address issuer, address holder, uint vcId);
    event Suspend(address issuer, address holder, uint vcId, bool suspended);
    event Delete(address holder, address issuer, uint vcId);

    /* ========== EXTERNAL FUNCTIONS ========== */

    function issue(
        address to,
        string memory subject_,
        string memory data_,
        uint validFrom_,
        uint validTo_
    ) external returns(uint vcId);

    function revoke(uint vcId) external;

    function setSuspended(uint vcId, bool suspended) external;

    function delete_(uint vcId) external;


    /* ========== EXTERNAL FUNCTIONS THAT ARE VIEW ========== */

    function getVc(uint vcId) external view returns(VerifiableCredential memory);

    function vcsOfIssuer(address address_) external view returns(uint[] memory);

    function vcsOfHolder(address address_) external view returns(uint[] memory);

    function generateVp(
        uint[] calldata userVcs,
        uint validFrom_,
        uint validTo_
    ) external view returns(VerifiablePresentation memory vp);

    function verify(
        VerifiablePresentation memory vp,
        address holder,
        uint currentDate
    ) external view returns(bool, string memory);

}
