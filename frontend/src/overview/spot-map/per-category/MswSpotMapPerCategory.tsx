import {ApiSpotInformation} from "../../../gen/msw-api-ts";
import {GoogleMap, Marker, MarkerClusterer, useLoadScript} from "@react-google-maps/api";
import green_dot from "../../../assets/map/green_dot.png";
import red_dot from "../../../assets/map/red_dot.png";
import React from "react";
import './MswSpotMapPerCategory.scss';

const center = { lat: 47.05, lng: 8.30 }; // Luzern / ca. Mitte der Schweiz

// If one station handles multiple spots we add a little offset, so we can see both
const getOffsetPosition = (latitude: number, longitude: number, index: number) => {
    const offset = 0.0005 * (index + 1); // Small offset, tweak if needed
    return {
        lat: latitude + offset,
        lng: longitude + offset,
    };
};

interface MswSpotMapPropsPerCategory {
    spots: Array<ApiSpotInformation>
}

export const MswSpotMapPerCategory = (props: MswSpotMapPropsPerCategory) => {
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: "AIzaSyAV9qwG3DRMjulZiuVyZxcD9pcTAZVih5c",
    });

    if (loadError) return <p>Error loading maps</p>;
    if (!isLoaded) return <p>Loading maps...</p>;

    return (
        <div className='map-container'>
            <GoogleMap
                mapContainerStyle={{
                    width: "100%",
                    height: "100%",
                }}
                zoom={8}
                center={center}
            >
                <MarkerClusterer>
                    {(clusterer) => ( // for multiple spots at the same coordinates
                        <>
                            {props.spots.map((spot, index) => (
                                <Marker
                                    key={index}
                                    position={getOffsetPosition(spot.station.latitude, spot.station.longitude, index)}
                                    clusterer={clusterer}
                                    icon={{
                                        url: spot.currentSample.flow >= spot.minFlow && spot.currentSample.flow <= spot.maxFlow ? green_dot : red_dot,
                                        scaledSize: new window.google.maps.Size(40, 40),
                                    }}
                                />
                            ))}
                        </>
                    )}
                </MarkerClusterer>
            </GoogleMap>
        </div>
    );
}