// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.10;
import "./IStruct.sol";

interface IHolder {

    function getVCs(address holder) external view returns(VerifiableCredential[] memory);
  //  function generatePresentation(VerifiableCredential[] calldata _VCList) external;
   // function shareVerifiablePresentaion(address verifier, VerifiablePresentaion calldata _VP ) external view returns(VerifiablePresentaion memory);
} 
