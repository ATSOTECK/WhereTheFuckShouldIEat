import User from '../Components/User/User';
import Decider from '../Components/decidr/decider';
import Settings from '../Components/Settings/Settings';
import Home from '../Components/Home/Home';
import RBL from '../Components/RBL/RBL';

const presentationComponents = (props) => {
    return [
        {
            title: 'Home Page',
            component: <Home />
        },
        {
            title: 'Decidr',
            component: <Decider/>
        },
        {
          title: 'Restaraunts by Location',
          component:  <RBL/>
        },
        {
            title: 'Settings',
            component: <Settings/>
        },
    ];
};


const containerComponents = (props) => {

    return [
        {
            title: 'User Settings',
            component: <User />
        },
    ];
};

export {presentationComponents, containerComponents};
