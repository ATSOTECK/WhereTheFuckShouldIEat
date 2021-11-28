import React, {useState, Component, Fragment} from 'react';
import Typography from '@mui/material/Typography';
import GoogleMapReact from "google-map-react";
import './Marker.css';
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import {CardActions} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import {Modal, ModalBody, ModalFooter} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import Link from "@mui/material/Link";
import ReactHtmlParser from 'react-html-parser';

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
                        lat: jsonArray[i]['geometry']['location']['lat'],
                        lng: jsonArray[i]['geometry']['location']['lng']}]]})
    }
}

class Marker extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);

    }
    state = {
        name: "test",
        color: "blue",
        id: ""
    }
    handleClick(){
        console.log("")
    }
    render() {
        const PopUp = ({ idMessage }) => {
            // create state `open` with default as false
            const [open, setOpen] = useState(false);
            const divstyle = {
                color: 'red',
            }
            return (

                <>
                    {open && (

                        <div style={divstyle}>
                            <p>
                                <br/>
                                {this.props.name}
                            </p>
                        </div>
                    )}
                    <div>
                        <div className="marker"
                             style={{ backgroundColor: this.props.color, cursor: 'pointer'}}
                             title={this.props.name}
                             data-toggle="modal"
                             onClick={() => setOpen(!open)}
                        />
                        <div className="pulse" />

                    </div>

                </>
            );
        };
        return (
            <div>
                <PopUp idMessage={this.props.name}></PopUp>
            </div>
        );
    }
}
//COPYRIGHT just for fun
function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright Â© '}
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
        console.log(props)
        this.state = {
            center: {
                lat,
                lng
            },
            zoom: 13,
            pins: [{name: '', lat: null, lng: null, id: 999}],
            cards: [1],
            cardValues: [{
                name: "Finding Restaurants",
                nImg: "https://flevix.com/wp-content/uploads/2019/07/Untitled-2.gif",
                address: "This will take a moment",
                key: 0
            }],
            click: 0,
            keywords: "",
            show: false,
            directions: [],
            radius: 1609
        };
    }

    async getDirections() {
        let x = []
        if (loc.length <= 0) {
            return
        }
        //OLD CORS
        //const reqStr = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=" + lat + "," + lng + "&destination=" + loc[num]["geometry"]["location"]['lat'] + "," + loc[num]["geometry"]["location"]['lng'] + "&key=AIzaSyC-BRpx6kbf36SeESOx7IqQnri7dnkQ8ts"
        const reqStr = "http://108.194.253.176:25565/directions/" + lat + "," + lng + "&destination=" + loc[this.state.click]["geometry"]["location"]['lat'] + "," + loc[this.state.click]["geometry"]["location"]['lng'] + "&key=AIzaSyC-BRpx6kbf36SeESOx7IqQnri7dnkQ8ts"
        //console.log(reqStr)
        await fetch(reqStr)
            .then(r => r.json())
            .then(data => (x = data['routes'][0]['legs'][0]['steps']))
            //.then(data => console.log(x))
            .then(data => this.setState({ directions: x}))
            .then(data => console.log(this.state.directions))
    }

    handleModal(n) {
        this.setState({show:!this.state.show, click: n})
        if (!this.state.show) {
            this.getDirections()
        } else {
            this.setState({directions: []})
        }
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
            let key = 'AIzaSyC-BRpx6kbf36SeESOx7IqQnri7dnkQ8ts'
            if (this.props["value"] !== 'undefined') {
                this.setState({radius: this.props["value"]*1609})
            }
            let keyword = ""
            if(this.props["vegan"]){
                keyword = keyword + "vegan,"
            }
            if(this.props["vegetarian"]){
                keyword += "vegetarian,"
            }
            if(this.props["glutenFree"]){
                keyword+= "gluten,"
            }
            if(keyword.length > 1){
                keyword = keyword.slice(0, -1)
            }
            this.setState({
                keywords: keyword
            })
            console.log("new Rad: ", this.props["value"], "miles or in meters: ", this.state.radius, "keywords used:", this.state.keywords)
            let res;
            //old COR
            //fetch("https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="  + location.coords.latitude  + "%2C" + location.coords.longitude + " &radius=" + radius + "&type=restaurant&keyword=cruise&key=" + key)
            const reqStr = "http://108.194.253.176:25565/list/" + location.coords.latitude  + "%2C" + location.coords.longitude + "&radius=" + this.state.radius + "&type=restaurant" + "&keyword=" + this.state.keywords+"&key=" + key
            fetch(reqStr)
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
        let newCards = this.state.cards
        let newVals = this.state.cardValues
        if (loc.length === 0) {
            newVals[0].name = "No restaurants in your area"
            this.setState({
                cardValues: newVals
            })
            return
        }
        newVals.pop()
        for (let i in loc) {
            //set to 3 places max for demonstration purposes
            /* if (i >= 3) {
                 break;
             } */
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
        //old CORS
        //await fetch("https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/photo" +"?photoreference=" + loc[num]['photos'][0]['photo_reference'] +"&key=AIzaSyC-BRpx6kbf36SeESOx7IqQnri7dnkQ8ts" + "&maxwidth=800" + "&maxheight=1080")
        const reqStr = "http://108.194.253.176:25565/pics/" + loc[num]['photos'][0]['photo_reference'] + "&key=AIzaSyC-BRpx6kbf36SeESOx7IqQnri7dnkQ8ts" + "&maxwidth=1920" + "&maxheight=1080"
        await fetch(reqStr)
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
                    <Container sx={{ py: 4 }} maxWidth="lg">
                        {/* End hero unit */}
                        <Typography gutterBottom variant="h5" component="h2">
                            Here are your Restaurants!
                        </Typography>
                        <Grid container spacing={2}>
                            {this.state.cards.map((card) => (
                                <Grid item key={card} sm={4}>
                                    <Card
                                        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                    >
                                        <CardMedia
                                            component="img"
                                            sx={{
                                                // 16:9
                                                pt: '%',
                                            }}
                                            style={{height: 600,
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
                                        <CardActions >
                                            <div>
                                                {/* eslint-disable-next-line no-restricted-globals */}
                                                <Button id={card-1} onClick={() => {this.handleModal(event.target.id)}} variant="outlined" size="medium">Eat Here!</Button>
                                                {/*POPUP*/}
                                                <Modal show={this.state.show}>
                                                    <ModalHeader>
                                                        Directions to: {this.state.cardValues[this.state.click].name}
                                                    </ModalHeader>
                                                    <ModalBody>
                                                        {this.state.directions.map(item =>
                                                                <Box padding={'10px'}>
                                                                    {ReactHtmlParser(item["html_instructions"] + " in " + item['distance']['text'])}
                                                                </Box>
                                                            // + this.state.directionsWord[item] + this.state.directions[item]['distance']['text']
                                                        )}
                                                    </ModalBody>
                                                    <ModalFooter>
                                                        <Button onClick={() => {this.handleModal(this.state.click)}} variant="outlined" size="medium">Close</Button>
                                                    </ModalFooter>
                                                </Modal>
                                            </div>
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
    let parent = props.location.state
    let keywords = props.location.keyword
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
            <SimpleMap {...parent}{...keywords}/>
            <Copyright/>
        </Fragment>
    )
}