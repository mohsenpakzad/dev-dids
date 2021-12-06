pragma solidity ^0.8.10;

interface IIssuer {

    struct VerifiableCredential {
        address issuer;
        address subject;
        bytes32 data;
        uint256 validFrom;
        uint256 validTo;
    }

    function issue(address issuer, address subject,bytes32 data, uint256 validFrom, uint256 validTo) external returns(VerifiableCredential memory);
    
    event revoke(VerifiableCredential credential);    

    

}
