import {Fragment} from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import MainDrawer from './menu/MainDrawer';

const makeUserName = ({user_fName, user_mName, user_lName}) => {
    return `${user_fName} ${user_mName === undefined ? '' : (user_mName+(user_mName.length === 1 ? '.' : user_mName))} ${user_lName}`;
};

const UserBanner = ({user, title, logoutAction}) => {

    return (
        <Box sx={{ display: 'flex', width: '100%', minWidth: 600, justifyContent: 'center' }}>

        <Grid sx={{ flexGrow: 1, width: '100%' }} container spacing={1}>
            <Grid item justifyContent='center' xs={12}>
                <Typography variant="h3"  component="div">{makeUserName(user)}</Typography>
            </Grid>

            <Grid item xs={12} justifyContent='center'>
                <Button onClick={() => logoutAction()}>Logout</Button>
            </Grid>

        </Grid>
        </Box>

    )
};


export default function App({user, logoutAction}) {
    const mainPageTitle = "Decidr";

    return (
        <Fragment>

                <MainDrawer title={mainPageTitle} user={makeUserName(user)} logoutAction={logoutAction}/>

        </Fragment>
    )

}

