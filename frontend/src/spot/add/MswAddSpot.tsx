import './MswAddSpot.scss'
import React, {FormEvent, useState} from "react";
import {Button, Form} from 'react-bootstrap';
import {ApiSpot, ApiSpotSpotTypeEnum, SpotsApi} from '../../gen/msw-api-ts';
import {authConfiguration} from '../../api/config/AuthConfiguration';
import {useUserAuth} from '../../user/UserAuthContext';
import {Link, useNavigate} from 'react-router-dom';
import {AxiosResponse} from "axios";
import { MswHeader } from '../../header/MswHeader';
import { MswFooter } from '../../footer/MswFooter';

export const MswAddSpot = () => {
    const navigate = useNavigate();

    const [spotName, setSpotName] = useState("");
    const [type, setType] = useState<ApiSpotSpotTypeEnum>(ApiSpotSpotTypeEnum.RiverSurf);
    const [stationId, setStationId] = useState<number | undefined>(undefined);
    const [minFlow, setMinFlow] = useState<number | undefined>(undefined);
    const [maxFlow, setMaxFlow] = useState<number | undefined>(undefined);

    // @ts-ignore
    const {token} = useUserAuth();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        let config = await authConfiguration(token);
        const apiSpot: ApiSpot = {
            name: spotName,
            stationId: stationId,
            spotType: type,
            isPublic: false,
            minFlow: minFlow,
            maxFlow: maxFlow,
        };
        // TODO: position should not be 0, but riversurfspots.length + 1, or bungeesurfSpots.length + 1
        let response: AxiosResponse<void, any> = await new SpotsApi(config).addPrivateSpot({spot: apiSpot, position: 0})
        if (response.status === 200) {
            navigate('/');
        } else {
            alert('Something went wrong. Please check your entered data.');
        }
    }

    return <>
        <div className="App">
        <MswHeader />
            <div className="form">
                <div className="box-container">
                    <div className="p-4 box">
                        <h2 className="mb-3 text-center">Add new private spot</h2>
                        <p className="info text-center">It will only be visible to you.</p>
                        <Form onSubmit={handleSubmit}>

                            <Form.Label htmlFor="formBasicSpotName">Name of the spot</Form.Label>
                            <Form.Group className="mb-3" controlId="formBasicSpotName">
                                <Form.Control
                                    required
                                    type="string"
                                    placeholder="Aaron's Right"
                                    onChange={(e) => setSpotName(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Label htmlFor="formBasicSpotType">Type of the spot</Form.Label>
                            <Form.Group className="mb-3" controlId="formBasicSpotType">
                                <Form>
                                    <Form.Check
                                        checked
                                        type="radio"
                                        label="Riversurf"
                                        name="radioTypeGroup"
                                        id="riversurf"
                                        onChange={() => setType(ApiSpotSpotTypeEnum.RiverSurf)}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Bungeesurf"
                                        name="radioTypeGroup"
                                        id="bungeesurf"
                                        onChange={() => setType(ApiSpotSpotTypeEnum.BungeeSurf)}
                                    />
                                </Form>
                            </Form.Group>

                            <Form.Label htmlFor="formBasicStationId"><Link to="https://www.hydrodaten.admin.ch/de/seen-und-fluesse/">BAFU Station ID</Link> of the spot
                                (ideally with temperature measurements)</Form.Label>
                            <Form.Group className="mb-3" controlId="formBasicStationId">
                                <Form.Control
                                    required
                                    type="number"
                                    placeholder="1337"
                                    // @ts-ignore
                                    onChange={(e) => setStationId(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Label htmlFor="formBasicMinFlow">Minimum flow for spot to work</Form.Label>
                            <Form.Group className="mb-3" controlId="formBasicMinFlow">
                                <Form.Control
                                    required
                                    type="number"
                                    placeholder="200"
                                    // @ts-ignore
                                    onChange={(e) => setMinFlow(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Label htmlFor="formBasicMaxFlow">Maximum flow for spot to work</Form.Label>
                            <Form.Group className="mb-3" controlId="formBasicMaxFlow">
                                <Form.Control
                                    required
                                    type="number"
                                    placeholder="350"
                                    // @ts-ignore
                                    onChange={(e) => setMaxFlow(e.target.value)}
                                />
                            </Form.Group>

                            <div className="d-grid gap-2">
                                <Button variant="primary" type="submit">
                                    Save
                                </Button>
                            </div>
                        </Form>
                        <hr/>
                        <p className='info text-center'><Link className='black' to="/spots">Return to overview.</Link></p>
                    </div>
                </div>
            </div>
        <MswFooter />
        </div>
    </>;
}