import './App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import Fib from './Fib';
import OtherPage from './OtherPage';


function App() {
  return (
    <Router>
      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Welcome to Fib</h1>
          <Link to='/'>Home</Link>
          <Link to='/otherpage'>Other Page</Link>
        
        </header> */}
        <div>
          <h1>Welcome to Fib</h1>
          <Link to='/'>Home</Link>
          <Link to='/otherpage'>Other Page</Link>
          <Route exact path='/' component={Fib}/>
          <Route exact path='/otherpage' component={OtherPage}/>
        </div>
      </div>

    </Router>
    
  );
}

export default App;
