import React, {Component, Fragment} from 'react';
import Typography from '@mui/material/Typography';
import GoogleMapReact from "google-map-react";
import './Marker.css';
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import {CardActions} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import {Modal, ModalBody, ModalFooter} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import Link from "@mui/material/Link";

let lat = 38.444342620549875
let lng = -122.7031968966762
let loc;

function getLoc(res) {
    loc = res;
    if (loc === 'undefined') {
        loc.length = 0;
    }
}

function pinHandler(jsonArray,ctx) {
    for(let i in jsonArray){
        ctx.setState({pins:
                [...ctx.state.pins,
                    ...[{
            id: i,
                        name: jsonArray[i]['name'],
                        lat: jsonArray[i]['geometry']['location']['lat']
                        ,lng: jsonArray[i]['geometry']['location']['lng']}]]})
    }
}

class Marker extends Component {

    state = {
        name: "test",
        color: "blue",
        id: ""
    }
    render() {
        return (
            <div>
                <div className="marker"
                    style={{ backgroundColor: this.props.color, cursor: 'pointer'}}
                     title={this.props.name}
                />
                <div className="pulse" />
            </div>
        );
    }
}

class Newpop extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            show:false,
            name: ""
        }
    }
    
    getDirections() {

    }

    handleModal() {
        this.setState({show:!this.state.show})
        this.getDirections()
    }
    render() {
        return (
            <div>
                <Button onClick={() => {this.handleModal()}} variant="outlined" size="medium">Eat Here!</Button>
                {/*POPUP*/}
                <Modal show={this.state.show}>
                    <ModalHeader>
                        Directions:
                    </ModalHeader>
                    <ModalBody>
                        {this.props.name}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => {this.handleModal()}} variant="outlined" size="medium">Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

//COPYRIGHT just for fun
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

//CREATES CARDS THAT CAN DO THINGS
//MAKES MAP
class SimpleMap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            center: {
                lat,
                lng
            },
            zoom: 13,
            pins: [{name: '', lat: 0, lng: 0, id: 999}],
            cards: [1],
            cardValues: [{
                name: "There are no restaurants in your area",
                nImg: "https://www.mountaineers.org/activities/routes-and-places/default-route-place/activities-and-routes-places-default-image/",
                address: "No restaurants :(",
                key: 0
            }],
            show: false
        };
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(function(location) {
            let newLat = {
                lat: location.coords.latitude,
                lng: location.coords.longitude
            };
            lat = location.coords.latitude
            lng = location.coords.longitude
            this.setState({
                center: newLat
            })
            console.log("Current Location\n", newLat)
            let radius = 1999
            let key = 'AIzaSyC-BRpx6kbf36SeESOx7IqQnri7dnkQ8ts'
            let res;
            fetch("https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="  + location.coords.latitude  + "%2C" + location.coords.longitude + " &radius=" + radius + "&type=restaurant&keyword=cruise&key=" + key)
                .then(response => response.json())
                .then(data => (res = data['results']))
                .then(data => console.log("List of Locations:\n", res))
                .then(data => getLoc(res))
                .then(data=> pinHandler(res,this))
                .then(data => this.addCards())
        }.bind(this));
        // https://cors-anywhere.herokuapp.com/corsdemo you need to authorize this

    }

    async addCards() {
        if (loc.length === 0) {
            return
        }
        let newCards = this.state.cards
        let newVals = this.state.cardValues
        newVals.pop()
        console.log(newCards.length)
        for (let i in loc) {
            newCards.push(this.state.cards.length)
            let newImg = await this.getImg(i)
            if (newImg !== "https://www.mountaineers.org/activities/routes-and-places/default-route-place/activities-and-routes-places-default-image/") {
                newImg = URL.createObjectURL(newImg)
            }
            newVals.push({
                name: loc[i]["name"],
                nImg: newImg,
                address: loc[i]['vicinity'],
                key: newCards.length
            })
        }
        newCards.shift()
        this.setState({
            cards: newCards,
            cardValues: newVals
        })
        console.log("Current State:", this.state)
    }

    //GETS RANDOM IMG
    async getImg(num) {
        let x
        //console.log(loc[num]['photos'])
        if ((typeof loc[num]['photos']) === 'undefined') {
            return "https://www.mountaineers.org/activities/routes-and-places/default-route-place/activities-and-routes-places-default-image/"
        }
        await fetch("https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/photo" +
            "?photoreference=" + loc[num]['photos'][0]['photo_reference'] +
            // eslint-disable-next-line no-useless-concat
            "&key=AIzaSyC-BRpx6kbf36SeESOx7IqQnri7dnkQ8ts" + "&maxwidth=800" + "&maxheight=1080")
            .then(r => r.blob())
            .then(r => (x = r))
        return x
    }

    render() {
        return (
            // Important! Always set the container height explicitly
            <div id="gmap_canvas" style={{ height: '50vh', width: '50%',
                marginLeft:"auto", marginRight:"auto" }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key:"AIzaSyC-BRpx6kbf36SeESOx7IqQnri7dnkQ8ts" }}
                    center={this.state.center}
                    defaultZoom={this.state.zoom}
                >
                    {this.state.pins.map(item =>
                        <Marker
                            name={item.name}
                            lat={item.lat}
                            lng={item.lng}
                            color="blue"
                        />
                    )
                    }
                    <Marker
                        name="My Location"
                        lat={lat}
                        lng={lng}
                        color="red"
                    />
                </GoogleMapReact>
                <main>
                    {/* Hero unit */}
                    <Container sx={{ py: 8 }} maxWidth="md">
                        {/* End hero unit */}
                        <Grid container spacing={4}>
                            {this.state.cards.map((card) => (
                                <Grid item key={card} xs={12} sm={6} md={4}>
                                    <Card
                                        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                    >
                                        <CardMedia
                                            component="img"
                                            sx={{
                                                // 16:9
                                                pt: '10%',
                                            }}
                                            style={{height: 500,
                                                width:300}}
                                            image={this.state.cardValues[card-1].nImg}
                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                {this.state.cardValues[card-1].name}
                                            </Typography>
                                            <Typography>
                                                {this.state.cardValues[card-1].address}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Box justifyContent={"center"}>
                                                <Newpop
                                                    name={this.state.cardValues[card-1].name}
                                                />
                                            </Box>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </main>
            </div>
        );
    }
}


export default function RBL(props) {
    return (
        <Fragment>
            <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
            >
                Here are your restaurants by location
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
                Here's where you'll pick your restaurant
            </Typography>
            <SimpleMap>
            </SimpleMap>
        </Fragment>
    )
}
