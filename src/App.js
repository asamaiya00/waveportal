import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import abi from './utils/WavePortal.json';

export default function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [totalWaves, setTotalWaves] = useState(0);
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const contractAddress = '0xa61605fB7dFAf74595110685Bc7a5297292795d5';
  const contractABI = abi.abi;

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert('Make sure you have metamask!');
        return;
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const waves = await wavePortalContract.getAllWaves();

      let cleanedWaves = [];
      waves.forEach((wave) => {
        cleanedWaves.push({
          address: wave.waver,
          message: wave.message,
          timestamp: new Date(wave.timestamp * 1000),
        });
      });

      setAllWaves(cleanedWaves);
    } catch (error) {
      console.log(error);
    }
  };

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
      await getAllWaves();
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
      if (message) {
        setIsLoading(true)
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let totalWaves = await wavePortalContract.getTotalWaves();
        console.log('totalWaves', totalWaves.toNumber());

        const waveTxn = await wavePortalContract.wave(message);
        console.log('Mining...', waveTxn.hash);

        await waveTxn.wait();
        console.log('Mined -- ', waveTxn.hash);
        
        totalWaves = await wavePortalContract.getTotalWaves();
        
        console.log('totalWaves', totalWaves.toNumber());
        setTotalWaves(totalWaves.toNumber());
        setMessage('');
        setIsLoading(false);
        await getAllWaves();
      }
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
        <input
          type="text"
          placeholder="Enter message to send to smart contract"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isLoading}
        />
        <button className="waveButton" onClick={wave} disabled={isLoading}>
          {isLoading ? "Mining new block..." : "Wave at Me"}
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

        {allWaves.map((wave, index) => (
          <div key={index} className="wave">
            <div>Address: {wave.address}</div>
            <div>Time: {wave.timestamp.toString()}</div>
            <div>Message: {wave.message}</div>
            <br />
          </div>
        ))}
      </div>
    </div>
  );
}
