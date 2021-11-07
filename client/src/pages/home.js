import React, { Component } from 'react'
import Navbar from '../components/navbar';
import {styled, makeStyles} from '@material-ui/core/styles'
import {Redirect} from 'react-router-dom';
import ImageList from '@material-ui/core/ImageList'
import ImageListItem from '@material-ui/core/ImageListItem'
import { Container, Grid, Paper, Button, Box, TextField, TextareaAutosize } from '@material-ui/core';
import { UserContext } from '../utils/context/userContext';



const itemData = [
    {
      img: 'https://images.pexels.com/photos/189454/pexels-photo-189454.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      title: 'Breakfast',
    },
    {
      img: 'https://images.pexels.com/photos/210156/pexels-photo-210156.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      title: 'Burger',
    },
    {
      img: 'https://images.pexels.com/photos/1974520/pexels-photo-1974520.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      title: 'Camera',
    },
    {
      img: 'https://images.pexels.com/photos/1008659/pexels-photo-1008659.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      title: 'Coffee',
    },
    {
      img: 'https://images.pexels.com/photos/1409990/pexels-photo-1409990.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      title: 'Hats',
    },
    {
      img: 'https://images.pexels.com/photos/627677/pexels-photo-627677.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      title: 'Honey',
    },
    
  ];
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

export class home extends Component {
    constructor(props){
        super(props);
        this.state = {
            storageValue: 0, 
            web3: null, 
            accounts: null, 
            contract: null,
            isAuthorized: false, 
            isAdmin: true,
            isSeller: false,
            isBuyer: false,
            isLoading: false,
            noWallet: false
           };

           this.sellerEntersShop = this.sellerEntersShop.bind(this);
           this.buyerEntersShop = this.buyerEntersShop.bind(this);
    }
    UNSAFE_componentWillMount(prevProps, prevState){
        console.log('homeProps', this.props);
        this.setState({
          isAdmin: true
        });
    }
    componentDidMount(){
      this.context.updateContext("contract" , this.props.baseAppState.contract);
      console.log('homePropsNav',this.props)
    }

    sellerEntersShop = () => {
      console.log('go to shop')
      
      this.context.updateContext("isSeller" , true )
      // this.setState((state, props) => ({
      //   isSeller: state.isSeller + props.baseAppState.isSeller
      // }));
   
      this.props.history.push('/shop');
      console.log('go to shop',this.state.isSeller);
      console.log('go to shop',this.props);
    }
    buyerEntersShop = () => {
      console.log('go to shop')
      this.context.updateContext("isBuyer" , true )
      this.props.history.push('/shop');
    }
    
    
    static contextType = UserContext;

    render() {
       console.log('context',this.context) 
        console.log('homeNav',this.props)
        return (
            <div className="welcome">
              {/* <Navbar account={this.state.accounts ? this.state.accounts[0] : null}/> */}
              <Navbar account={this.props.baseAppState.accounts[0]} admin={this.state.admin}/>
              <Container>
              <Grid container spacing={2}>
                <div className="container">
                    <h1 className="title">Welcome To Vingtage Auto Sales Shop</h1>
                </div>
                <Grid mt={5} item xs={12} md={12}>
                    <Item  className="">Sign in as a buyer or a seller</Item> 
                </Grid>
             
                </Grid>
                <Box mt={5} sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                        {/* <Item></Item> */}
                        </Grid>
                        <Grid item xs={3}>
                        <Item>
                            <Button onClick={this.sellerEntersShop} className="btn-vin">Seller</Button>
                        </Item>
                        </Grid>
                        <Grid item xs={3}>
                        <Item>
                        <Button onClick={this.buyerEntersShop}>Buyer</Button>
                        </Item>
                        </Grid>
                        <Grid item xs={3}>
                        {/* <Item></Item> */}
                        </Grid>
                       
                    </Grid>
                </Box>
                <Box mt={5} sx={{ p:5 ,border: '2px solid white' }}>
                    <ImageList mt={5} sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                            {itemData.map((item) => (
                                <ImageListItem key={item.img}>
                                <img
                                    src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                                    srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                    alt={item.title}
                                    loading="lazy"
                                />
                                </ImageListItem>
                            ))}
                        </ImageList>
                  </Box>  
              </Container>
            </div>
        )
    }
}

export default home
