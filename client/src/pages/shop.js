import React, { Component } from 'react'
import { Container, Grid, Paper, Button, Box, TextField, TextareaAutosize } from '@material-ui/core';
import {styled, makeStyles} from '@material-ui/core/styles'
import Navbar from '../components/navbar';
import axios from 'axios'
import { UserContext } from '../utils/context/userContext';

const pinataApiKey = "8cfcaf6f796621bddbfa";
const pinataSecretApiKey = "063909ea3088f6268a4567948f1124aa6ac7b49d5a614de652443444b778f4e0";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

export class shop extends Component {
    constructor(props){
        super(props);

        this.state = {
            storageValue: 0, 
            web3: null, 
            accounts: null, 
            contract: null,
            isAuthorized: false, 
            isLoading: false,
            noWallet: false,
            isAdmin: false,
            isSeller: false,
            isBuyer: false,
            file: null
        }
    }

    UNSAFE_componentWillMount(prevProps, prevState){
        console.log('homeProps', this.props);
        console.log('prevProps', prevProps);
        console.log('stateProps', prevState);
    }

    handleCapture = async ({ target }) => {
        // setSelectedFile(target.files[0]);
        this.setState({
            file: target.files[0]
        })
        console.log('upload', this.state.file);
        const data = new FormData();
        data.append('file', this.state.file);

        try {
            // make axios post request
            const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
            const response = await axios.post(url, data, {
                maxContentLength: "Infinity", 
                headers: {
                  "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
                  pinata_api_key: pinataApiKey, 
                  pinata_secret_api_key: pinataSecretApiKey,
                },
              });
             
           
            console.log(response.data)

            
          } catch(error) {
            console.log(error)
          }
      };
      static contextType = UserContext;
    render() {
        console.log('context',this.context) 
        let current = this.context
        if(current.state.isAdmin){
            return (
                <div className="welcome">
                <Navbar account ={this.state.account} admin={this.state.admin} />
                <Container>
                <Grid container spacing={1}>
                            <Grid item sm={3}>

                            </Grid>
                            <Grid item sm={6}>
                                <Box m={4}>
                                    <Paper elevation={2}>    
                                        <Box p={3}> 
                                        <span className="card-title">Approve Seller</span>
                                        <section>
                                        <form id="" className="" autoComplete="off">
                                                <section>
                                                 
                                                    
                                                    <Box mt={2}>
                                                        <Grid container spacing={2}>
                                                            <Grid item md={12} sm={12}>
                                                                <TextField id="" required={true} label="Address of seller to approve" variant="outlined" fullWidth={true}/>
                                                            </Grid>                                                            
                                                        </Grid>
                                                    </Box>  
                                                    
                                                    
                                                    <Box mt={2}>
                                                        <Button onClick={(e) => this.approveSeller(e)}  variant="contained" color="primary" component="span">
                                                            Approve
                                                        </Button>
                                                        {/* {this.state.loading.approveSeller ? <Loader type={'spinningBubbles'} size={'small'} color={'#556cd6'} />: null}    */}
                                                    </Box>                                                                                                     
                                                </section>                                                
                                            </form>
                                        </section>
                                        </Box>

                                    </Paper>
                                </Box>
                            </Grid>
                </Grid>

                </Container>
                </div>
            )
        }else if(current.state.isSeller){
            return (
                <div className="welcome">
                <Container>
                    <Grid container spacing={1}>
                        <Grid item sm={3}></Grid>
                        <Grid item sm={6}>
                        <Box m={4}>
                                    <Paper elevation={2}>    
                                        <Box p={3}> 
                                        <span className="card-title">Upload File To IPfs Storage & Mint car as NFT</span>
                                        <section>
                                        <form id="" className="" autoComplete="off">
                                                <section>
                                                {/* <input
                                                        style={{ display: "none" }}
                                                        id="contained-button-file"
                                                        onChange={handleFileChange}
                                                        type="file"
                                                    />
                                                    <label htmlFor="contained-button-file">
                                                        <Button variant="contained" color="primary" component="span">
                                                        Upload
                                                        </Button>
                                                    </label> */}
                                                    
                                                    <Box mt={2}>
                                                        <Grid container spacing={2}>
                                                            <Grid item md={12} sm={12}>
                                                                <TextField id="" required={true} label="Name of car" variant="outlined" fullWidth={true}/>
                                                            </Grid>
                                                            <Grid item mt={3} md={12} sm={12}>
                                                                <TextField id="" required={true} label="Model of Car" variant="outlined" fullWidth={true}/>
                                                            </Grid>                                                            
                                                        </Grid>
                                                    </Box>  
                                                    
                                                    
                                                    <Box mt={2}>
                                                        <Button  variant="contained" color="primary" component="span">
                                                            Approve
                                                        </Button>
                                                        {/* {this.state.loading.approveSeller ? <Loader type={'spinningBubbles'} size={'small'} color={'#556cd6'} />: null}    */}
                                                    </Box>                                                                                                     
                                                </section>                                                
                                            </form>
                                        </section>
                                        </Box>

                                    </Paper>
                                </Box>
                        </Grid>
                        <Grid item sm={3}></Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item sm={3}></Grid>
                        <Grid item sm={6}>
                        <Box m={4}>
                                    <Paper elevation={2}>    
                                        <Box p={3}> 
                                        <span className="card-title">Put NFT up for sale</span>
                                        <section>
                                        <form id="" className="" autoComplete="off">
                                                <section>
                                             
                                                    <Box mt={2}>
                                                        <Grid container spacing={2}>
                                                            <Grid item md={12} sm={12}>
                                                                <TextField id="" required={true} label="Token ID" variant="outlined" fullWidth={true}/>
                                                            </Grid>
                                                            <Grid item mt={3} md={12} sm={12}>
                                                                <TextField id="" required={true} label="Name of Car" variant="outlined" fullWidth={true}/>
                                                            </Grid>
                                                            <Grid item mt={3} md={12} sm={12}>
                                                                <TextField id="" required={true} label="Price of Car" variant="outlined" fullWidth={true}/>
                                                            </Grid> 
                                                            <Grid item mt={3} md={12} sm={12}>
                                                                <TextField id="" required={true} label="Model of Car" variant="outlined" fullWidth={true}/>
                                                            </Grid>                                                            
                                                        </Grid>
                                                    </Box>  
                                                    
                                                    
                                                    <Box mt={2}>
                                                        <Button  variant="contained" color="primary" component="span">
                                                            Approve
                                                        </Button>
                                                        {/* {this.state.loading.approveSeller ? <Loader type={'spinningBubbles'} size={'small'} color={'#556cd6'} />: null}    */}
                                                    </Box>                                                                                                     
                                                </section>                                                
                                            </form>
                                        </section>
                                        </Box>

                                    </Paper>
                                </Box>
                        </Grid>
                        <Grid item sm={3}></Grid>
                    </Grid>
                </Container>
                </div>
            )
        }else if(current.state.isBuyer){
            return (
                <div className="welcome">
                <p>this is the shop</p>
                </div>
            )
        }else{
            return (
                <div className="welcome">
                <Container>
                <Grid mt={5} item xs={12} md={12}>
                    <Item  className="">Welcome To Vingtage Auto Sales Shop</Item> 
                </Grid>
                </Container>
                 
                </div>
            )
        }
        
    }
}

export default shop
