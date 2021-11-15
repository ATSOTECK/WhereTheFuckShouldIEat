import React, {Fragment} from 'react';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function Home(props) {
    return (
        <Fragment>
            <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
            >
                Welcome to Decidr Home Page!
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
                Decidr is designed to help you pick a place to eat depending on your location!
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
                Just pick below whether you'd like to choose based on location or youre looking for the Decidr Randomizer
            </Typography>
            <Box padding='30px'
                 textAlign='center'>
                <Button marginRight={"10px"} variant='outlined' size={"large"}>
                    Decidr
                </Button>
                &nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;
                <Button margin-left={'10px'} variant='outlined' size={"large"}>
                    By Location
                </Button>
            </Box>
        </Fragment>
    )
}