import React, {Component, Fragment} from 'react';
import Typography from '@mui/material/Typography';
import GoogleMapReact from "google-map-react";


const AnyReactComponent = ({ text }) => <div>{text}</div>;
let lat = 38.444342620549875
let lng = -122.7031968966762
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
        }.bind(this));
        // https://cors-anywhere.herokuapp.com/corsdemo you need to authorize this

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
                </GoogleMapReact>

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
                Here are your restaraunts by location
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
                Here's where you'll pick your restaraunt
            </Typography>
            <SimpleMap>
            </SimpleMap>
        </Fragment>
    )
}
