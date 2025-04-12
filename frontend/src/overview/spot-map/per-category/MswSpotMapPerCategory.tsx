import React, {useEffect, useRef} from "react";
import {GoogleMap, useLoadScript} from "@react-google-maps/api";
import {MarkerClusterer} from "@googlemaps/markerclusterer";
import {ApiSpotInformation} from "../../../gen/msw-api-ts";
import './MswSpotMapPerCategory.scss';

const center = {lat: 47.05, lng: 8.30}; // Luzern / ca. Mitte der Schweiz

const getOffsetPosition = (latitude: number, longitude: number, index: number) => {
    const offset = 0.0005 * (index + 1);
    return {
        lat: latitude + offset,
        lng: longitude + offset,
    };
};

interface MswSpotMapPropsPerCategory {
    spots: Array<ApiSpotInformation>;
}

export const MswSpotMapPerCategory = ({spots}: MswSpotMapPropsPerCategory) => {
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: "AIzaSyAV9qwG3DRMjulZiuVyZxcD9pcTAZVih5c",
    });

    const mapRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);
    const clustererRef = useRef<MarkerClusterer | null>(null);

    useEffect(() => {
        if (mapRef.current && isLoaded) {
            // Clear old markers
            markersRef.current.forEach(marker => marker.setMap(null));
            clustererRef.current?.clearMarkers();

            const markers = spots.map((spot, index) => {
                const position = getOffsetPosition(spot.station.latitude, spot.station.longitude, index);
                const isGreen = spot.currentSample.flow >= spot.minFlow && spot.currentSample.flow <= spot.maxFlow;

                const marker = new google.maps.Marker({
                    position,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: isGreen ? "green" : "red",
                        fillOpacity: 1,
                        strokeWeight: 1,
                        strokeColor: "white",
                    },
                });

                // Store custom color on marker for later use in cluster
                (marker as any).customColor = isGreen ? "green" : "red";

                return marker;
            });

            markersRef.current = markers;

            const clusterer = new MarkerClusterer({
                markers,
                map: mapRef.current,
                renderer: {
                    render({markers, count, position}) {
                        // @ts-ignore
                        const colors = markers.map((m: any) => m.customColor);
                        const uniqueColors = new Set(colors);

                        let color = "yellow";
                        if (uniqueColors.size === 1) {
                            color = uniqueColors.has("green") ? "green" : "red";
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
                    }
                }
            });

            clustererRef.current = clusterer;
        }
    }, [isLoaded, spots]);

    if (loadError) return <p>Error loading maps</p>;
    if (!isLoaded) return <p>Loading maps...</p>;

    return (
        <div className="map-container">
            <GoogleMap
                mapContainerStyle={{width: "100%", height: "100%"}}
                zoom={8}
                center={center}
                onLoad={(map) => {
                    mapRef.current = map;
                }}
            />
        </div>
    );
};
