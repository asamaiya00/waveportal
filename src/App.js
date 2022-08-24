import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

export default function App() {
  const [currentAccount, setCurrentAccount] = useState('');

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
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Wave at Me
          </button>
        )}
      </div>
    </div>
  );
}
