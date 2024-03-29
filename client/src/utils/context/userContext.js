import React, { Component } from 'react';

export const UserContext = React.createContext();

export class MyProvider extends Component{
    constructor(props){
        super(props);
        this.state = {
            isAuthorized: false,
            accounts: null,
            web3: null,
            contract: null,
            noWallet: false,
            isSeller: false,
            isAdmin: false,
            isBuyer: false
        }
    }

    updateContext = (key, value)=>{
        this.setState((prevState)=>(
            {...prevState, [key]: value}
        ));        
    }

    render(){
        return(            
            <UserContext.Provider
                value={{state: this.state, updateContext: this.updateContext}}>
                {this.props.children}
            </UserContext.Provider>            
        )
    }
}