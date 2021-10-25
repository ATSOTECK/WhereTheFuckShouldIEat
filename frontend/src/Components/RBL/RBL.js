import React, {Component, Fragment} from 'react';
import Typography from '@mui/material/Typography';
import GoogleMapReact from "google-map-react";


const AnyReactComponent = ({ text }) => <div>{text}</div>;
let lat = 38.444342620549875
let lng = -122.7031968966762
class SimpleMap extends Component {

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log("Latitude is :", position.coords.latitude);
            lat = position.coords.latitude
            console.log("Longitude is :", position.coords.longitude);
            lng = position.coords.longitude
        });}
    static defaultProps = {
        center: {
            lat,
            lng
        },
        zoom: 11
    };

    render() {
        return (
            // Important! Always set the container height explicitly
            <div id="gmap_canvas" style={{ height: '50vh', width: '50%',
                 marginLeft:"auto", marginRight:"auto" }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key:"AIzaSyC-BRpx6kbf36SeESOx7IqQnri7dnkQ8ts" }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
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
