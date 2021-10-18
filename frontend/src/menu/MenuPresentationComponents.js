import User from '../Components/User/User';
import Decider from '../Components/decidr/decider';
import Settings from '../Components/Settings/Settings';

const presentationComponents = (props) => {
    return [
        {
            title: 'Decidr',
            component: <Decider/>
        },
        {
            title: 'User Settings',
            component: <User/>
        },
    ];
};


const containerComponents = (props) => {

    return [
        {
            title: 'Settings',
            component: <Settings />
        }
    ];
};

export {presentationComponents, containerComponents};
