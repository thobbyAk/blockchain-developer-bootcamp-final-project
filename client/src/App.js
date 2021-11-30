import React, { Component } from "react";
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
// import SimpleStorageContract from "./contracts/SimpleStorage.json";
import VintageShopContract from "./contracts/VintageShop.json";
import getWeb3 from "./getWeb3";
import {MyProvider, UserContext} from "./utils/context/userContext";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./App.css";
import Home from "./pages/home";
import Shop from "./pages/shop";
toast.configure()
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
       storageValue: 0, 
       web3: null, 
       accounts: null, 
       contract: null,
       isAuthorized: false, 
       isAdmin: false,
       isSeller: false,
       isBuyer: false,
       isLoading: false,
       noWallet: false
      };

  }

  componentDidMount = async () => {

    if(window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      })
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      })
  }
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VintageShopContract.networks[networkId];
      const instance = new web3.eth.Contract(
        VintageShopContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
     console.log('accounts', accounts);
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, () =>this.adminSignin());
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. please make sure that you have metamask installed on your browser and is connected to Ropsten network  .`,
      );
      this.setState({
        noWallet: true
      });
      console.log("wallet", this.state.noWallet)
      console.error(error);
    }
  };

    

  runExample = async () => {
  
    // const { accounts, contract } = this.state;

    // // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });

    // // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    // // Update state with the result.
    // this.setState({ storageValue: response });
    console.log('testcd')
  };
  accountChangeHandler = () => {
    window.location.reload();
  }

  adminSignin = () =>{
    // sign user in
    const { accounts, contract } = this.state;
    let user = contract.methods.getAdmin().call({from: accounts[0]});
    user.then(response => {
      //authentication is successful
      console.log('user: ',response);

      if(response && response[0] === true){
        this.setState({isAuthorized: true});
        localStorage.setItem('isAuthenticated', true);
        // admin check
        if(response[1] === true){
          this.setState({isAdmin: true});
          console.log('admin setter')
        }
        
     
        // this.setState({pageLoading: false});
      }
    }).catch(error=>{
      this.setState({isAuthorized: false});
      localStorage.setItem('isAuthenticated', false);
      this.setState({pageLoading: false});
    })   
    
  }

  // window.ether
  
  render() {
    console.log('context',this.context) 
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
      // return <div>Loading Web3, accounts, and contract...</div>;
   
    }
    return (
      
      <div className="App">
        <BrowserRouter basename="/">
        <MyProvider>
          <UserContext.Consumer>
            {(context) =>
                <Switch>
                <Route exact path="/" render={props => {return( <Home {...props} baseAppState={this.state} />  )} } />
                <Route exact path="/shop" render={props => {return( <Shop {...props} context={context} baseAppState={this.state} />  )} } />
                </Switch>
              
            }
          </UserContext.Consumer>
        </MyProvider>
       
        </BrowserRouter>
        {/* <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div> */}
      </div>
    );
  }
}

export default App;
