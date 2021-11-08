import React, {Fragment, Component} from 'react';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import GoogleMapReact from 'google-map-react';
import 'bootstrap/dist/css/bootstrap.css';
import {Modal, ModalBody, ModalFooter} from 'react-bootstrap'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {render} from "react-dom";
import ModalHeader from "react-bootstrap/ModalHeader";


const AnyReactComponent = ({ text }) => <div>{text}</div>;
let lat = 38.444342620549875
let lng = -122.7031968966762

let loc;

function getLoc(res) {
    loc = res;
    if (loc == 'undefined') {
        loc.length = 0;
    }
    //console.log(loc.length)
}

class SimpleMap extends Component {


    state = {
        center: {
            lat,
            lng
        },
        zoom: 11
    };


    componentDidMount() {
        navigator.geolocation.getCurrentPosition(function(location) {
            let newLat = {
                lat: location.coords.latitude,
                lng: location.coords.longitude
            };
            this.setState({
                center: newLat
            })
            console.log(newLat)
            let radius = 999
            let key = 'AIzaSyC-BRpx6kbf36SeESOx7IqQnri7dnkQ8ts'
            let res;
            fetch("https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="  + location.coords.latitude  + "%2C" + location.coords.longitude + " &radius=" + radius + "&type=restaurant&keyword=cruise&key=" + key)
                .then(response => response.json())
                .then(data => (res = data['results']))
                .then(data => console.log(res))
                .then(data => getLoc(res))
        }.bind(this));
        // https://cors-anywhere.herokuapp.com/corsdemo you need to authorize this
    }
    render() {
        return (
            // Important! Always set the container height explicitly
            <div id="gmap_canvas" style={{ height: '50vh', width: '80%',
                marginLeft:"auto", marginRight:"auto" }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key:"AIzaSyC-BRpx6kbf36SeESOx7IqQnri7dnkQ8ts" }}
                    center={this.state.center}
                    defaultZoom={this.state.zoom}
                >
                </GoogleMapReact>

            </div>
        );
    }
}

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                WTFSIE.com
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const cards = [1];

const theme = createTheme();

class CardSet extends Component {
    state = {
        nImg: "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-2000w,f_auto,q_auto:best/newscms/2020_46/1635112/nicest-taco-bell-te-main-201112.jpg",
        name: "Taco Bell",
        addressName: "5200 CA-1, Pacifica, CA 94044",
        oldNums: []
    };

    getRandomInt(max) {
        let x = this.state.oldNums
        let num = Math.floor(Math.random() * max)
        if (x.length === max) {
            x = []
            x.push(num)
        } else if (x.length < 1) {
            x.push(num);
        } else if (x.includes(num)) {
            return num = this.getRandomInt(max)
        } else {
            x.push(num)
        }
        this.setState({
           oldNums: x
        });
        return num;
    }

    resetCard() {
        if (loc.length > 0) {
            let num = this.getRandomInt(loc.length);
            let newState = {
                nImg: 'https://scontent-sjc3-1.xx.fbcdn.net/v/t31.18172-8/18278252_429591350732837_1790982853994926986_o.jpg?_nc_cat=105&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=4UEw_7KeHmAAX9gg_1a&_nc_ht=scontent-sjc3-1.xx&oh=fb559f4bfbc2b5c3b253fa8a2e204580&oe=61AD7FE0',
                name: loc[num]['name'],
                addressName: loc[num]['vicinity'],
            };
            this.setState({
                name: newState.name,
                nImg: newState.nImg,
                addressName: newState.addressName,
            })
        } else {
            let newState = {
                nImg: "No image",
                name: 'There are no restaraunts in your area.',
                addressName: 'No address'
            };
            this.setState({
                    name: newState.name,
                    nImg: newState.nImg,
                    addressName: newState.addressName
            })
        }
        console.log(this.state)
    }

    render() {
        return (
            <Container sx={{ py: 1 }} maxWidth="md">
                {/* End hero unit */}
                <Grid container spacing={0}>
                    {cards.map((card) => (
                        <Grid item key={card} xs={12} sm={6} md={12} justifyContent="center">
                            <Card
                                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                            >
                                <CardMedia
                                    component="img"
                                    sx={{
                                        pt: '0%',
                                    }}
                                    image={this.state.nImg}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="h2" align="center">
                                        {this.state.name}
                                    </Typography>
                                    <Typography>
                                        {this.state.addressName}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Box justifyContent={"center"} marginLeft={'200px'}>
                                        <Newpop/>
                                    </Box>
                                    <Box justifyContent={"center"}><Button variant="outlined" size="medium">Favorite</Button></Box>
                                    <Box justifyContent={"center"}><Button variant="outlined" size="medium">Blacklist</Button></Box>
                                    <Box justifyContent={"center"}><Button onClick={() => {this.resetCard()}} variant="outlined" size='medium'>Refresh</Button></Box>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        );
    }
}

class Newpop extends React.Component {
    constructor() {
        super();
        this.state={
            show:false
        }
    }
    handleModal() {
        this.setState({show:!this.state.show})
    }
    render() {
        return (
            <div>
                <Button onClick={() => {this.handleModal()}} variant="outlined" size="medium">Directions</Button>
                {/*POPUP*/}
                <Modal show={this.state.show}>
                    <ModalHeader>
                        Directions:
                    </ModalHeader>
                    <ModalBody>
                        <SimpleMap/>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => {this.handleModal()}} variant="outlined" size="medium">Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}


export default function decider(props) {
    return (
        <Fragment>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <main>
                    {/* Hero unit */}
                    <Box
                        sx={{
                            bgcolor: 'background.paper',
                            pt: 8,
                            pb: 6,
                        }}
                    >
                        <Container maxWidth="sm">
                            <Typography
                                component="h1"
                                variant="h2"
                                align="center"
                                color="text.primary"
                                gutterBottom
                            >
                                Restaraunt layout
                            </Typography>
                            <Typography variant="h5" align="center" color="text.secondary" paragraph>
                                Here's where you'll get your restaraunt
                            </Typography>
                            <Stack
                                sx={{ pt: 2 }}
                                direction="row"
                                spacing={0}
                                justifyContent="center"
                            >
                            </Stack>
                        </Container>
                    </Box>

                    <CardSet/>

                    <Container sx={{ py: 8 }}>
                        <Typography variant="h5" align="center" color="text.secondary" paragraph>
                            Here's your location and the restaraunts around you
                        </Typography>
                        <SimpleMap/>
                    </Container>
                </main>
                {/* Footer */}
                <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
                    <Typography variant="h6" align="center" gutterBottom>
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        align="center"
                        color="text.secondary"
                        component="p"
                    >
                    </Typography>
                    <Copyright />
                </Box>




                {/* End footer */}
            </ThemeProvider>
        </Fragment>
    )
}
