import React, {useState, useEffect} from 'react'

import {AppBar, Typography, Toolbar, Button } from "@material-ui/core"
import { makeStyles} from "@material-ui/core/styles"
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import IconButton from '@material-ui/core/IconButton';
import Stack from '@material-ui/lab'
import { Alert, AlertTitle } from '@material-ui/lab';


const useStyles = makeStyles((theme) =>({
    root:{
        flexGrow: 1
    },
    top: {
    background: '#282c34',
      color: (props) => props.color,
    },
    shop:{
        color: '#ffffff !important'
    },
    subTitle: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
          display: 'block',
        },
        fontSize: '14px'
      },
}))
    
   
 

const Navbar = (props) => {
    const [defaultAccount, setDefaultAccount] = useState(null)
    const [alert, setAlert] = useState(false)
    const classes = useStyles(props);
    useEffect(() => {
        setDefaultAccount(props.account);
        console.log('default account', props )

      });
    // const HandleConnect = () =>{
    //     if(window.ethereum){
    //         //metamask is installed
    //         window.ethereum.request({method: 'eth_requestAccounts'})
    //         .then(result =>{
    //             accountChangeHandler(result[0]);
                

    //         })
    //     }else{
    //         setAlert(true);
    //     }

    // console.log("connect to metamask")
    // }


    const alertChangeHandler = (stat) =>{
        setAlert(stat)
    }
    const accountChangeHandler = (newAccount) =>{
        setDefaultAccount(newAccount);
        

    }
    const handleAdmin = () =>{
        props.adminHandler()
    }

    const chainChangedHandler = () =>{
        window.location.reload();
    }
    // window.ethereum.on('accountsChanged',accountChangeHandler);
    
    // window.ethereum.on('chainChanged',chainChangedHandler);

    return (
        
        <div >
        <AppBar className={classes.top} position="static">
            <Toolbar>
                
                    <Button
                    color="inherit"
                     onClick = { () => handleAdmin()} className={classes.root}>
                        ADMIN
                    </Button>
              
            <IconButton className={classes.root}>
                <AddShoppingCartIcon className={classes.shop}/>
            </IconButton>
            <Typography variant="h4" className={classes.root}>
                Vintage Shop
            </Typography>
            <div className={classes.root}>
                 {/* {props.account} */}   
                 
            <Typography className={classes.subTitle} variant="h6" noWrap>
            Your Account:    
            {defaultAccount === null
            ? '-'
            : defaultAccount
            ? `${defaultAccount.substring(0, 6)}...${defaultAccount.substring(defaultAccount.length - 4)}`
            : ''}
            {/* {defaultAccount} */}
            
          </Typography> 
          {
              props.seller ?
              <Button
              color="inherit"
                
                className={classes.root}>
                  Selller
              </Button>
               : 
              ''
          }
        {
              props.buyer ?
              <Button
              color="inherit"
                
                className={classes.root}>
                  Buyer
              </Button>
               : 
              ''
          }
            
            </div>
            
            </Toolbar>
            {/* {
                alert ? <Alert severity="warning">
                        <AlertTitle>Connection Error</AlertTitle>
                        Please Install Metamask— <strong>check it out!</strong>

                        </Alert> 
                : null
            } */}
        </AppBar>  
        </div>
    )
}
export default Navbar;
