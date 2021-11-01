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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {render} from "react-dom";


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
        });
        // https://cors-anywhere.herokuapp.com/corsdemo you need to authorize this
        let radius = 15000
        let key = 'AIzaSyC-BRpx6kbf36SeESOx7IqQnri7dnkQ8ts'
        fetch("https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="  + lat  + "%2C" + lng + " &radius=" + radius + "&type=restaurant&keyword=cruise&key=" + key)
            .then(response => response.json())
            .then(data => console.log(data))}
    static defaultProps = {
        center: {
            lat,
            lng
        },
        zoom: 11
    };

    /* original div
                <div style={{ height: '50vh', width: '50%',
                position: '', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)',
            }}>
     */



    render() {
        return (
            // Important! Always set the container height explicitly
            <div id="gmap_canvas" style={{ height: '50vh', width: '75%',
                marginLeft:"auto", marginRight:"auto" }}>
                <header style={{
                    textAlign: 'center',
                    fontSize: '50px',
                }}>
                    <Typography variant="h5" align="center" color="text.secondary" paragraph>
                        Here's where you'll see your restaraunts location
                    </Typography>
                </header>


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
                                spacing={1}
                                justifyContent="center"
                            >
                                <Button variant="contained">Refresh</Button>
                                <Button variant="outlined">Save Restaraunt</Button>
                            </Stack>
                        </Container>
                    </Box>
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
                                            image="https://media-cldnry.s-nbcnews.com/image/upload/t_fit-2000w,f_auto,q_auto:best/newscms/2020_46/1635112/nicest-taco-bell-te-main-201112.jpg"
                                            alt="Taco Bell pacifica"
                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography gutterBottom variant="h5" component="h2" align="center">
                                                Taco Bell in Pacifica
                                            </Typography>
                                            <Typography>
                                                This is your restaraunt card. Here you can click to choose to either
                                                get directions, favorite, or blacklist this restaraunt
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button variant="outlined" size="medium">Directions</Button>
                                            <Button variant="outlined" size="medium">Favorite</Button>
                                            <Button variant="outlined" size="medium">Blacklist</Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                    <Container sx={{ py: 8 }}>
                        <SimpleMap>
                        </SimpleMap>
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
