import React, {useCallback, useEffect, useRef} from "react";
import {GoogleMap, useLoadScript} from "@react-google-maps/api";
import {MarkerClusterer} from "@googlemaps/markerclusterer";
import {ApiSpotInformation} from "../../../../gen/msw-api-ts";
import './MswSpotMapPerCategory.scss';
import {getFlowColorEnum} from "../../../../service/SpotsHelper";

export const mapCenter = {lat: 47.05, lng: 8.30}; // Luzern / ca. Mitte der Schweiz

const getOffsetPosition = (latitude: number, longitude: number, index: number) => {
    const offset = 0.0005 * (index + 1);
    return {lat: latitude + offset, lng: longitude + offset};
};

interface MswSpotMapPropsPerCategory {
    spots: ApiSpotInformation[];
}

export const MswSpotMapPerCategory = ({spots}: MswSpotMapPropsPerCategory) => {
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: "AIzaSyAV9qwG3DRMjulZiuVyZxcD9pcTAZVih5c",
    });

    const mapRef = useRef<google.maps.Map | null>(null);
    const clustererRef = useRef<MarkerClusterer | null>(null);

    const clearMap = () => {
        clustererRef.current?.clearMarkers();
        clustererRef.current = null;
    };

    const renderClusterIcon = ({markers, count, position}: any) => {
        const colors = markers.map((m: any) => m.customColor);
        const uniqueColors = new Set<string>(colors);

        let color = "blue"; // default color for clustered spots if not all spots have the same color
        if (uniqueColors.size === 1) {
            color = [...uniqueColors][0];
        }

        return new google.maps.Marker({
            position,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 14,
                fillColor: color,
                fillOpacity: 0.9,
                strokeWeight: 1,
                strokeColor: "white",
                labelOrigin: new google.maps.Point(0, 0),
            },
            label: {
                text: String(count),
                color: "white",
                fontWeight: "bold",
            },
        });
    };

    const createMarkers = (spots: ApiSpotInformation[]) => {
        return spots.map((spot, index) => {
            const position = getOffsetPosition(spot.station.latitude, spot.station.longitude, index);
            const flowColorEnum = getFlowColorEnum(spot, spot.currentSample.flow)

            const marker = new google.maps.Marker({
                position,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: flowColorEnum.toString(),
                    fillOpacity: 1,
                    strokeWeight: 1,
                    strokeColor: "white",
                },
            });

            (marker as any).customColor = flowColorEnum.toString();
            return marker;
        });
    };

    const updateMap = useCallback(() => {
        if (!mapRef.current || !isLoaded) return;

        clearMap();

        const markers = createMarkers(spots);
        clustererRef.current = new MarkerClusterer({
            markers,
            map: mapRef.current,
            renderer: {render: renderClusterIcon}
        });
    }, [spots, isLoaded]);

    useEffect(() => {
        updateMap();
    }, [updateMap]);

    const handleMapLoad = (map: google.maps.Map) => {
        mapRef.current = map;
        updateMap();
    };

    if (loadError) return <p>Error loading maps</p>;
    if (!isLoaded) return <p>Loading maps...</p>;

    return (
        <div className="map-container">
            <GoogleMap
                mapContainerStyle={{width: "100%", height: "100%"}}
                zoom={8}
                center={mapCenter}
                onLoad={handleMapLoad}
            />
        </div>
    );
};
