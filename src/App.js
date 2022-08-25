import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import abi from './utils/WavePortal.json';

export default function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [totalWaves, setTotalWaves] = useState(0);

  const contractAddress = '0xA9bd0Ca296D6D2EC7b046c4B9FE5502B5cE1ddDe';
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert('Make sure you have metamask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);
      }
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Found an authorized account:', account);
        setCurrentAccount(account);
      } else {
        console.log('No authorized account found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert('Make sure you have metamask!');
        return;
      } else {
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        });
        if (accounts[0]) {
          setCurrentAccount(accounts[0]);
          console.log('Found an authorized account:', currentAccount);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const wave = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert('Please connect metamask');
        return;
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      let totalWaves = await wavePortalContract.getTotalWaves();
      console.log('totalWaves', totalWaves.toNumber());

      const waveTxn = await wavePortalContract.wave();
      console.log('Mining...', waveTxn.hash);

      await waveTxn.wait();
      console.log('Mined -- ', waveTxn.hash);

      totalWaves = await wavePortalContract.getTotalWaves();

      console.log('totalWaves', totalWaves.toNumber());
      setTotalWaves(totalWaves.toNumber());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          <span role="img" aria-label="wave">
            👋{' '}
          </span>
          Hey there!
        </div>
        <div className="bio">Connect your Ethereum wallet and wave at me!</div>
        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        {totalWaves ? (
          <div className="header">Total Waves: {totalWaves}</div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}
