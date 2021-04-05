//import logo from './logo.svg';
import './App.css';
import { Table } from './Table';
import { QueryLatestBtcUsd } from './QueryLatestBtcUsd';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>BTC USD Reader</h1>
        <QueryLatestBtcUsd/>
        <br></br>
        <Table/>
        <br></br>
        <h5>“Powered by CoinDesk”. 
          <a href="https://www.coindesk.com/price/bitcoin">See price page here </a> 
        </h5>
      </header>
    </div>
  );
}

export default App;
