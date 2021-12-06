// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.10;
import "./IStruct.sol";
interface IIssuer {



    function issue(address issuer, address subject,bytes32 data, uint256 validFrom, uint256 validTo) external returns(VerifiableCredential memory);
    
    event revoke(VerifiableCredential credential);    

    

}
