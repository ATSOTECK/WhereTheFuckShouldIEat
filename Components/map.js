import React,{useState , useEffect} from 'react';
import GoogleMapReact from 'google-map-react';

function TheMap(props){
    const [cordinates , setCordinates] = useState([10, 10]);
    const MyCustomMarker = () => <span class="material-icons">place</span>;

    useEffect(() => {
        setCordinates(props.center);
    }, [props.center])

    return(
        <GoogleMapReact
            yesIWantToUseGoogleMapApiInternals={true}
            bootstrapURLKeys={{key:"AIzaSyC-BRpx6kbf36SeESOx7IqQnri7dnkQ8ts"}}
            defaultZoom={16}
            center={cordinates}
        >
            <MyCustomMarker
                lat={cordinates[0]}
                lng={cordinates[1]}
            />
        </GoogleMapReact>
    )
}

export default TheMap
