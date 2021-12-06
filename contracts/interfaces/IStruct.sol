// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.10;

struct VerifiableCredential {
    address issuer;
    address subject;
    bytes32 data;
    uint256 validFrom;
    uint256 validTo;
}
struct VerifiablePresentaion{
    VerifiableCredential[] verifiableCredentials;
    uint256 creationDate;


}