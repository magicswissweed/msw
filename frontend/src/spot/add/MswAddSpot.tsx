import './MswAddSpot.scss'
import React, {FormEvent, useEffect, useState} from "react";
import {Button, Form} from 'react-bootstrap';
import {ApiSpot, ApiSpotSpotTypeEnum, ApiStation, SpotsApi, StationApi} from '../../gen/msw-api-ts';
import {authConfiguration} from '../../api/config/AuthConfiguration';
import {useUserAuth} from '../../user/UserAuthContext';
import {useNavigate} from 'react-router-dom';
import {AxiosResponse} from "axios";
import {v4 as uuid} from 'uuid';
import {Typeahead} from "react-bootstrap-typeahead";

export const MswAddSpot = () => {
    const navigate = useNavigate();

    const [spotName, setSpotName] = useState("");
    const [type, setType] = useState<ApiSpotSpotTypeEnum>(ApiSpotSpotTypeEnum.RiverSurf);
    const [stationId, setStationId] = useState<number | undefined>(undefined);
    const [minFlow, setMinFlow] = useState<number | undefined>(undefined);
    const [maxFlow, setMaxFlow] = useState<number | undefined>(undefined);
    const [stations, setStations] = useState<ApiStation[]>([])
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);
    const [stationSelectionError, setStationSelectionError] = useState('');

    useEffect(() => {
        // no await, so that frontend doesn't block
        fetchStations()
    }, []);


    // @ts-ignore
    const {token} = useUserAuth();

    async function fetchStations(): Promise<void> {
        return await new StationApi()
            .getStations()
            .then((response) => setStations(response.data));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!stationId) {
            setStationSelectionError('Please select a valid option.');
            return;
        } else {
            setStationSelectionError('');
        }

        let config = await authConfiguration(token);
        const apiSpot: ApiSpot = {
            id: uuid(),
            name: spotName,
            stationId: stationId!,
            spotType: type,
            isPublic: false,
            minFlow: minFlow!,
            maxFlow: maxFlow!,
        };
        setIsSubmitButtonDisabled(true);
        let response: AxiosResponse<void, any> = await new SpotsApi(config).addPrivateSpot({spot: apiSpot, position: 0})
        if (response.status === 200) {
            navigate('/');
        } else {
            alert('Something went wrong. Please check your entered data.');
            setIsSubmitButtonDisabled(false);
        }
    }

    return <>
        <div className="form">
            <div className="box-container">
                <div className="p-4 box">
                    <h2 className="mb-3">Add new private Spot</h2>
                    <p className="info">This spot will only be visible to you. Other surfers will have to find this wave
                        themselves.</p>
                    <Form onSubmit={handleSubmit}>

                        <Form.Label htmlFor="formBasicSpotName">Name of the Spot</Form.Label>
                        <Form.Group className="mb-3" controlId="formBasicSpotName">
                            <Form.Control
                                required
                                type="string"
                                placeholder="Name of the Spot"
                                onChange={(e) => setSpotName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Label htmlFor="formBasicSpotType">Type of the Spot</Form.Label>
                        <Form.Group className="mb-3" controlId="formBasicSpotType">
                            <Form>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Riversurf"
                                    name="radioTypeGroup"
                                    id="riversurf"
                                    checked={type == ApiSpotSpotTypeEnum.RiverSurf}
                                    onChange={() => setType(ApiSpotSpotTypeEnum.RiverSurf)}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Bungeesurf"
                                    name="radioTypeGroup"
                                    id="bungeesurf"
                                    checked={type == ApiSpotSpotTypeEnum.BungeeSurf}
                                    onChange={() => setType(ApiSpotSpotTypeEnum.BungeeSurf)}
                                />
                            </Form>
                        </Form.Group>

                        <Form.Label htmlFor="formBasicStationId">The measuring station
                            (from <a href="https://www.hydrodaten.admin.ch/" target="_blank" rel="noopener noreferrer">hydrodaten.admin.ch</a>)</Form.Label>
                        <Form.Group className="mb-3" controlId="formBasicStationId">
                            <Typeahead
                                allowNew={false}
                                inputProps={{ required: true }}
                                id="station-autocomplete"
                                labelKey="label"
                                onChange={(station) => {
                                    setStationId((station.pop() as ApiStation).id);
                                    setStationSelectionError('');
                                }}
                                options={stations}
                                placeholder="Station">
                            </Typeahead>
                            {stationSelectionError && <div style={{ color: 'red' }}>{stationSelectionError}</div>}
                        </Form.Group>

                        <Form.Label htmlFor="formBasicMinFlow">Minimum Flow for Spot to Work</Form.Label>
                        <Form.Group className="mb-3" controlId="formBasicMinFlow">
                            <Form.Control
                                required
                                type="number"
                                placeholder="Minimum Flow"
                                // @ts-ignore
                                onChange={(e) => setMinFlow(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Label htmlFor="formBasicMaxFlow">Maximum Flow for Spot to Work</Form.Label>
                        <Form.Group className="mb-3" controlId="formBasicMaxFlow">
                            <Form.Control
                                required
                                type="number"
                                placeholder="Maximum Flow"
                                // @ts-ignore
                                onChange={(e) => setMaxFlow(e.target.value)}
                            />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button disabled={isSubmitButtonDisabled} variant="primary" type="submit">
                                Save
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    </>;
}