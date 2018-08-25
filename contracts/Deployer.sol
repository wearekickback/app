pragma solidity ^0.4.24;

import "./Party.sol";

contract Deployer {
    event Deployed(
        address indexed deployedAddress
    );

    function deploy() external returns (address) {
        Party p = new Party();
        emit Deployed(b);
    }
}
