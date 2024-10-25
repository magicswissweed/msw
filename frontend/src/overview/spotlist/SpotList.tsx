import './SpotList.scss';
import React, {useEffect, useState} from 'react';
import {DragDropContext, Draggable, Droppable, DropResult} from 'react-beautiful-dnd';
import {ApiSpotInformation, SpotsApi} from '../../gen/msw-api-ts';
import {authConfiguration} from '../../api/config/AuthConfiguration';
import {useUserAuth} from '../../user/UserAuthContext';
import {Spot} from "./spot/Spot";

interface SpotListProps {
    title: string,
    locations: Array<ApiSpotInformation>
}

export const SpotList = (props: SpotListProps) => {
    const [locations, setLocations] = useState<Array<ApiSpotInformation>>(props.locations);

    // @ts-ignore
    const {user, token} = useUserAuth();

    useEffect(() => {
        setLocations(props.locations);
    }, [props.locations]);

    const handleDrop = async (result: DropResult) => {
        async function saveSpotsOrdering() {
            let config = await authConfiguration(token);
            await new SpotsApi(config).orderSpots(
                locations
                    .filter(loc => loc.id)
                    .map(loc => loc.id!));
        }

        if (!result.destination) return;

        const reorderedItems = Array.from(locations);
        const [removed] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, removed);

        setLocations(reorderedItems);

        if (user) {
            // no await, because we don't want the frontend to be blocked
            saveSpotsOrdering();
        }
    };

    return <>
        <div className="spotsContainer">
            <h2>{props.title}</h2>
            <DragDropContext onDragEnd={handleDrop}>
                <Droppable droppableId="locations-wrapper">
                    {(droppableProvided: any) => (
                        <div {...droppableProvided.droppableProps} ref={droppableProvided.innerRef}>
                            {locations.map((location: ApiSpotInformation, index: number) => (
                                <Draggable key={location.id} draggableId={location.id!} index={index}>
                                    {(draggableProvided: any, _snapshot: any) => (
                                        <div
                                            ref={draggableProvided.innerRef}
                                            {...draggableProvided.draggableProps}
                                        >
                                            <Spot
                                                location={location}
                                                dragHandleProps={draggableProvided.dragHandleProps}
                                                {...draggableProvided.draggableProps}
                                                snapshot={_snapshot} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {droppableProvided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    </>;
}