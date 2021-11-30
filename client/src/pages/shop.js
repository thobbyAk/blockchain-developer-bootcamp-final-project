import React, { Component } from 'react'
import { Container, Grid, Paper, Button, Box, Typography, CardMedia, TextField, Card, CardContent, CardActions, TextareaAutosize } from '@material-ui/core';
import {styled, makeStyles} from '@material-ui/core/styles'
import Navbar from '../components/navbar';
import axios from 'axios'
import {Toast} from 'bootstrap'
import { UserContext } from '../utils/context/userContext';
import Web3 from 'web3'
import Alert from '@material-ui/lab/Alert';
import { withStyles } from '@material-ui/core/styles'
import AlertTitle from '@material-ui/lab/AlertTitle';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
  
toast.configure()

const pinataApiKey = "8cfcaf6f796621bddbfa";
const pinataSecretApiKey = "063909ea3088f6268a4567948f1124aa6ac7b49d5a614de652443444b778f4e0";

const styles = theme => ({
    root: {
      backgroundColor: "red"
    }
  });
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
            sellerAddressToApprove: '',
            file: null,
            selectedFileName:'',
            ipfsHash:null,
            nftToken: '',
            metaDataHash: '',
            metaDataHashUrl: '',
            filename: '',
            filemodel: '',
            tokenId:'',
            tokenCar:'',
            tokenPrice:'',
            tokenModel:'',
            hashUrl:'',
            sellerAmount:'',
            sales: [],
            purchased: []
            
        }
        this.handleCapture = this.handleCapture.bind(this);
        this.enterAsAdmin = this.enterAsAdmin.bind(this);

        // this.handleFileInput = this.handleFileInput(this);
    }

   componentDidMount = async () => {
        window.web3 = new Web3(window.ethereum);
       const res =  await window.ethereum.enable();
       console.log('res', res);
       if(this.context.state.isBuyer === true){
            this.getNFTForSale();
            this.getPurchasedNFT();

       }
       
   }

   sellerAddressHandler =(event)=>{
    event.persist();
    this.setState({sellerAddressToApprove: event.target.value}); 
}

  sellerAmountHandler =(event)=>{
    event.persist();
    this.setState({sellerAmount: event.target.value}); 
}
    goHome = () => {
        console.log('go to shop')
        this.props.history.push('/');
    }

    enterAsAdmin = () =>{
        this.context.updateContext("isAdmin" , true )
        this.props.history.push('/shop'); 
      }
   
  

    approveSeller=(event)=>{
        event.preventDefault();
        const contract = this.context.state.contract;
        const account = this.context.state.accounts[0];

        let response = contract.methods.assignAsSeller(this.state.sellerAddressToApprove).send({from: account});
        response.then(result => {
            console.log('seller approval: ', result);
            if(result.status && result.events.SellerVerified){

                 toast.success('Seller Verified Successfully');

            }else{
                toast.error('An Error Occured');
          
            }
        }).catch(error=>{
                toast.error('seller approval error:')
                  console.log('seller approval error: ', error);
           
        }); 
    }

    creditSeller = async (event)=>{
        event.preventDefault();
        const contract = this.context.state.contract;
        const account = this.context.state.accounts[0];
        const web3 = new Web3(window.ethereum);
        const withdrawAmount = web3.utils.toWei(this.state.sellerAmount,'ether');
        let response = await contract.methods.sendTo(this.state.sellerAddressToApprove, withdrawAmount).send({from: account, value: withdrawAmount});
            if(response.status && response.events.Sent){

                toast.success('Seller Credited Successfully');

            }else{
                toast.error('An Error Occured');
            
            }
       
        // response.then(result => {
        //     console.log('seller credit: ', result);
        //     if(result.status && result.events.Sent){

        //          toast.success('Seller Credited Successfully');

        //     }else{
        //         toast.error('An Error Occured');
          
        //     }
        // }).catch(error=>{
        //         toast.error('seller approval error:')
        //           console.log('seller approval error: ', error);
           
        // }); 
    }

    handleNFTInput =(event)=> {
        // const target = event.target;
        const value = event.target.value;
        const name = event.target.name;
        this.setState({
            [name]: value
        });

    }

    uploadNFTForSale = async (event)=>{
        event.preventDefault();
        const contract = this.context.state.contract;
        const account = this.context.state.accounts[0];
        let response = await contract.methods.addNFT(
            this.state.tokenId,
            this.state.tokenPrice,
            this.state.tokenCar,
            this.state.tokenModel,
            this.state.hashUrl).send({from:account});
            
            if(response.status && response.events.ForSale){
                toast.success('NFT Uploaded Forsale Successfully');   
            }else{
                toast.error('NFT Uploaded Failed');   

            }
           

    }

    mintNFT = async (event) =>{
        event.preventDefault();
        const metadata = {
            "name": this.state.filename,
            "hash": this.state.ipfsHash,
            "model": this.state.filemodel
        }
        
                try{
                   // make axios post request
                    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
                    const response = await axios.post(url, metadata, {
                        maxContentLength: "Infinity",
                        headers: {
                        pinata_api_key: pinataApiKey, 
                        pinata_secret_api_key: pinataSecretApiKey,
                        },
                    });  
                    console.log('metaData', response.data);
                    const newMeta = "ipfs://" + response.data.IpfsHash;
                    const newMetaUrl = "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash;
                    console.log('newHash', newMeta)
                    this.setState({
                        metaDataHash: newMeta,
                        metaDataHashUrl: newMetaUrl
                    })
                    this.sendHashToContract()
                } catch(error){
                    console.log(error)
                }

    }

    sendHashToContract = async ()=>{
        const contract = this.context.state.contract;
        const account = this.context.state.accounts[0];
        let response = await contract.methods.awardItem(account, this.state.ipfsHash, this.state.metaDataHash).send({from: account});
        // response.then(result => {
            console.log('NFT Minted: ', response);
        if(response.status && response.events.Minted){

                toast.success('NFT Minted Successfully');
                this.setState({
                file: null,
                selectedFileName:'',
                ipfsHash:null,
                metaDataHash: '',
                filename: '',
                filemodel: '' ,
                nftToken: response.events.Minted.returnValues._tokenId
                })

        }else{
            toast.error('An Error Occured');
        
        }
      
    }

    handleFileInput =(event)=> {
        // const target = event.target;
        const value = event.target.value;
        const name = event.target.name;
        this.setState({
            [name]: value
        });

    }
    buyToken = async (sale) => {
        const web3 = new Web3(window.ethereum);
        const contract = this.context.state.contract;
        const account = this.context.state.accounts[0];
        const amount = web3.utils.toWei(sale.price,'ether');
        let response = await contract.methods.purchaseNFT(sale.tokenId).send({from: account,value: amount});
  
        console.log('sold',response)
        if(response && response.events.Received){
            toast.success('Transaction successful');
            this.getPurchasedNFT();
        }else{
                toast.error('An Error Occured');

        }
    //    response.then(result => {
    //        if(result && result.event.Received){
    //             toast.success('Transaction successful');
    //        }else{
    //             toast.error('An Error Occured');
    //        }
    //    })
        
    }
    getPurchasedNFT = () => {
        const contract = this.context.state.contract;
        const account = this.context.state.accounts[0];
        let response = contract.methods.getPurchasedTokens(account).call({from: account});
        response.then(result => {
            console.log('bought', result);
            this.setState({
                purchased: result
            })
        })
    }

    getNFTForSale = () => {
        
            const contract = this.context.state.contract;
            const account = this.context.state.accounts[0];
            let response = contract.methods.getCarForSale().call({from: account});
            response.then(result => {
                console.log('sale',result)
                this.setState({
                    sales: result
                })
            })
        
        
    }

    handleCapture = async ({ target }) => {
        // setSelectedFile(target.files[0]);
        this.setState({
            file: target.files[0],
            selectedFileName: target.files[0].name
        })
        console.log('upload', this.state.file);
        const data = new FormData();
        data.append('file', target.files[0]);

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
             
           
            console.log('ipfs',response.data)
            if(response.data.IpfsHash){
                toast.success('File Uploaded to IPFS Sussccessfully');
                this.setState({
                    ipfsHash    : response.data.IpfsHash
                });
              
                
            }
           

            
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
                <Navbar adminHandler={this.enterAsAdmin} account ={current.state.accounts[0]}
                 admin={current.state.isAdmin}
                 seller={current.state.isSeller}
                 buyer={current.state.isBuyer}
                  />
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
                                                                <TextField onChange={this.sellerAddressHandler} id="" required={true} label="Address of seller to approve" variant="outlined" fullWidth={true}/>
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
                   <Grid container spacing={1}>
                            <Grid item sm={3}>

                            </Grid>
                            <Grid item sm={6}>
                                <Box m={4}>
                                    <Paper elevation={2}>    
                                        <Box p={3}> 
                                        <span className="card-title">Credit Seller</span>
                                        <section>
                                        <form id="" className="" autoComplete="off">
                                                <section>
                                                 
                                                    
                                                  
                                                    <Box mt={2}>
                                                        <Grid container spacing={2}>
                                                            <Grid item md={12} sm={12}>
                                                                <TextField onChange={this.sellerAddressHandler} id="" required={true} label="Address of seller to credit" variant="outlined" fullWidth={true}/>
                                                            </Grid>                                                            
                                                        </Grid>
                                                    </Box> 
                                                    <Box mt={2}>
                                                        <Grid container spacing={2}>
                                                            <Grid item md={12} sm={12}>
                                                                <TextField onChange={this.sellerAmountHandler} id="" required={true} label="Address Amount to Credit Seller" variant="outlined" fullWidth={true}/>
                                                            </Grid>                                                            
                                                        </Grid>
                                                    </Box> 
                                                    
                                                    
                                                    <Box mt={2}>
                                                        <Button onClick={(e) => this.creditSeller(e)}  variant="contained" color="primary" component="span">
                                                            Credit
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
                <Navbar adminHandler={this.enterAsAdmin} account ={current.state.accounts[0]} 
                admin={current.state.isAdmin}
                seller={current.state.isSeller}
                buyer={current.state.isBuyer}
                 />
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
                                                    <input
                                                        style={{ display: "none" }}
                                                        id="contained-button-file"
                                                        onChange={this.handleCapture}
                                                        type="file"
                                                    />
                                                    <label htmlFor="contained-button-file">
                                                        <Button variant="contained" color="primary" component="span">
                                                        Select a File
                                                        </Button>
                                                    </label>
                                                    <span>{this.state.selectedFileName}</span>
                                                    
                                                    <Box mt={2}>
                                                        <Grid container spacing={2}>
                                                            <Grid item md={12} sm={12}>
                                                                <TextField
                                                                name="filename"
                                                                type="text"
                                                                onChange={this.handleFileInput}
                                                                value={this.state.filename}
                                                                 required={true} label="Name of car" variant="outlined" fullWidth={true}/>
                                                            </Grid>
                                                            <Grid item mt={3} md={12} sm={12}>
                                                                <TextField
                                                                name="filemodel"
                                                                type="text"
                                                                onChange={this.handleFileInput} required={true} label="Model of Car" variant="outlined" fullWidth={true}/>
                                                            </Grid>                                                            
                                                        </Grid>
                                                    </Box>  
                                                    
                                                    
                                                    <Box mt={2}>
                                                        <Button
                                                        onClick={(e) => this.mintNFT(e)}
                                                         variant="contained" color="primary" component="span">
                                                            Mint NFT
                                                        </Button>
                                                       
                                                        {/* {this.state.loading.approveSeller ? <Loader type={'spinningBubbles'} size={'small'} color={'#556cd6'} />: null}    */}
                                                    </Box> 
                                                    <Box mt={2}>
                                                        <p>
                                                            Token ID:
                                                        <span>{this.state.nftToken}</span>
                                                        </p>
                                                        <p>
                                                            Token Url:
                                                        <span>{this.state.metaDataHashUrl}</span>
                                                        </p>
                                                    
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
                                                                <TextField 
                                                                 name="tokenId"
                                                                 type="text"
                                                                 onChange={this.handleNFTInput}
                                                                 value={this.state.tokenId}
                                                                 required={true} label="Token ID" variant="outlined" fullWidth={true}/>
                                                            </Grid>
                                                            <Grid item mt={3} md={12} sm={12}>
                                                                <TextField 
                                                                name="tokenCar"
                                                                type="text"
                                                                onChange={this.handleNFTInput}
                                                                value={this.state.tokenCar}
                                                                required={true} label="Name of Car" variant="outlined" fullWidth={true}/>
                                                            </Grid>
                                                            <Grid item mt={3} md={12} sm={12}>
                                                                <TextField 
                                                                name="tokenPrice"
                                                                type="text"
                                                                onChange={this.handleNFTInput}
                                                                value={this.state.tokenPrice}
                                                                required={true} label="Price of Car" variant="outlined" fullWidth={true}/>
                                                            </Grid> 
                                                            <Grid item mt={3} md={12} sm={12}>
                                                                <TextField 
                                                                name="hashUrl"
                                                                type="text"
                                                                onChange={this.handleNFTInput}
                                                                value={this.state.hashUrl}
                                                                required={true} label="Url of Car" variant="outlined" fullWidth={true}/>
                                                            </Grid> 
                                                            <Grid item mt={3} md={12} sm={12}>
                                                                <TextField 
                                                                name="tokenModel"
                                                                type="text"
                                                                onChange={this.handleNFTInput}
                                                                value={this.state.tokenModel}
                                                                required={true} label="Model of Car" variant="outlined" fullWidth={true}/>
                                                            </Grid>                                                            
                                                        </Grid>
                                                    </Box>  
                                                    
                                                    
                                                    <Box mt={2}>
                                                        <Button  
                                                        onClick={(e) => this.uploadNFTForSale(e)}
                                                        variant="contained" color="primary" component="span">
                                                            UPLOAD FOR SALE
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
                    <Navbar adminHandler={this.enterAsAdmin} account ={current.state.accounts[0]} 
                    admin={current.state.isAdmin}
                    seller={current.state.isSeller}
                    buyer={current.state.isBuyer}
                 />
                 <Container>
                 <h1 className="title">Tokens Available For Sale</h1>
                 <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {this.state.sales.map((sale, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                        <Card ml={3} style={{marginRight:'15px'}}>
                            <CardMedia
                                component="img"
                                height="100"
                                image={sale.carUrl}
                                alt="green iguana"
                            />
                            <CardContent>
                                <Typography  variant="h5" component="div">
                                NFT Name: {sale.name}
                                </Typography>
                                <Typography variant="body2" color="secondary">
                                Car Model: {sale.model}
                                </Typography>
                                <Typography variant="body2" color="secondary">
                                Price in Eth: {sale.price}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button onClick={() => this.buyToken(sale) } size="small">BUY NOW</Button>
                            </CardActions>
                            </Card>
                    </Grid>
                    ))}
                </Grid>
                
                 {/* <Grid container spacing={2}>
                 
                    <Box mt={5} sx={{ flexGrow: 1 }}>
                        {
                            this.state.sales.map((sale, i) => (
                                <Grid mt={3} item xs={3}>
                                <Card sx={{ minWidth: 275 }} key={i}>
                                   <CardContent>
                                       <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                       {sale.name}
                                       </Typography>
                                       <Typography variant="h5" component="div">
                                       {sale.model}
                                       </Typography>
                                       <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                       {sale.price}
                                       </Typography>
                                       
                                   </CardContent>
                                   <CardActions>
                                       <Button onClick={() => this.buyToken(sale) } size="small">BUY NOW</Button>
                                   </CardActions>
                                   </Card>
                               </Grid>
                            ))
                        }
                        
                    </Box>
                 </Grid> */}
                  <h6 className="title">List of purchased Tokens</h6>
                  {
                      this.state.purchased.length === 0 ?
                      <p class="text-white"> You currently have no purchased Token </p>:
                      ''
                  }
                  {this.state.purchased.map((token, index) => (
                    <p class="text-white" key={index}>Token ID:{token} </p>

                  ))}
                
                 </Container>
                {/* <p>this is the shop</p> */}
                </div>
            )
        }else{
            return (
                <div className="welcome">
                <Container>
                <Grid mt={5} item xs={12} md={12}>
                    <Item  className="">Welcome To Vingtage Auto Sales Shop Sign In as A Buyer or Seller  </Item> 
                </Grid>
                </Container>
                <Box mt={5} sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={5}>
                        {/* <Item></Item> */}
                        </Grid>
                        <Grid item xs={2}>
                        <Item>
                            <Button onClick={this.goHome} className="btn-vin">Home</Button>
                        </Item>
                        </Grid>
                        <Grid item xs={5}>
                       
                        </Grid>
                        
                       
                    </Grid>
                </Box>
                </div>
            )
        }
    }    
    
}

export default shop;
