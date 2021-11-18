import logo from './logo.svg';
import './App.css';
import configLoader from 'fe-config-loader'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {getMessage()}
        </p>
        <a
          className="App-link"
          href="https://www.npmjs.com/package/fe-config-loader"
          target="_blank"
          rel="noopener noreferrer"
        >
          fe-config-loader
        </a>
      </header>
    </div>
  );
}


function getMessage() {
  return configLoader.get("message");
}
export default App;
