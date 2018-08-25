pragma solidity ^0.4.24;

import "./zeppelin/ownership/Ownable.sol";
import "./Deployer.sol";


/**
 * The permanent contract on the chain. He rules them all.
 */
contract Overlord is Ownable {
    address public deployer;

    event DeployerChanged(
        address indexed oldDeployer,
        address indexed newDeployer
    );

    function setDeployer(address _deployer) external onlyOwner {
        emit DeployerChanged(deployer, _deployer);
        deployer = _deployer;
    }

    function deploy() external {
        Deployer d = Deployer(deployer);
        d.delegatecall(msg.data);
    }
}
