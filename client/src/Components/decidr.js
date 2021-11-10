import React, {Fragment, Component} from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import GoogleMapReact from 'google-map-react';
import 'bootstrap/dist/css/bootstrap.css';
import {Modal, ModalBody, ModalFooter} from 'react-bootstrap'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ModalHeader from "react-bootstrap/ModalHeader";


const AnyReactComponent = ({ text }) => <div>{text}</div>;
let lat = 38.444342620549875
let lng = -122.7031968966762
let num;
let loc;

function getLoc(res) {
    loc = res;
    if (loc === 'undefined') {
        loc.length = 0;
    }
}

class SimpleMap extends Component {


    state = {
        center: {
            lat,
            lng
        },
        zoom: 13
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
            const reqStr = "http://localhost:3003/list/" + location.coords.latitude  + "%2C" + location.coords.longitude + "&radius=" + radius + "&type=restaurant&keyword=cruise&key=" + key;
            //fetch("https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="  + location.coords.latitude  + "%2C" + location.coords.longitude + " &radius=" + radius + "&type=restaurant&keyword=cruise&key=" + key)
            fetch(reqStr)
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
        nImg: "https://www.mountaineers.org/activities/routes-and-places/default-route-place/activities-and-routes-places-default-image/",
        name: "Click Refresh To get Restaurant",
        addressName: "The address is just one click away!",
        oldNums: []
    };

    getRandomInt(max) {
        let x = this.state.oldNums
        num = Math.floor(Math.random() * max)
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

    async getImg(num) {
        let x
        console.log(loc[num]['photos'])
        if ((typeof loc[num]['photos']) === 'undefined') {
            return "https://www.mountaineers.org/activities/routes-and-places/default-route-place/activities-and-routes-places-default-image/"
        }
        const reqStr = "http://localhost:3003/pics/" + loc[num]['photos'][0]['photo_reference'] + "&key=AIzaSyC-BRpx6kbf36SeESOx7IqQnri7dnkQ8ts" + "&maxwidth=800" + "&maxheight=800"
        console.log(reqStr);
        /*await fetch("https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/photo" +
            "?photoreference=" + loc[num]['photos'][0]['photo_reference'] +
            "&key=AIzaSyC-BRpx6kbf36SeESOx7IqQnri7dnkQ8ts" + "&maxwidth=800" + "&maxheight=800")//*/
        await fetch(reqStr)
            .then(r => r.blob())
            .then(r => (x = r));
            
        console.log(x);
        return x
    }

    async resetCard() {
        if (loc.length > 0) {
            num = this.getRandomInt(loc.length)
            let newImg = await this.getImg(num)
            if (newImg !== "https://www.mountaineers.org/activities/routes-and-places/default-route-place/activities-and-routes-places-default-image/") {
                newImg = URL.createObjectURL(newImg)
            }
            
            let newState = {
                nImg: newImg,
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
                nImg: "https://www.mountaineers.org/activities/routes-and-places/default-route-place/activities-and-routes-places-default-image/",
                name: 'There are no restaurants in your area.',
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
                                Welcome to Decidr!
                            </Typography>
                            <Typography variant="h5" align="center" color="text.secondary" paragraph>
                               Click refresh on the restaurant card and you'll get your restaurant
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
                            Here's your location and the restaurants you've selected
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
