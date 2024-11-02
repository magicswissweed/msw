import './MswAddSpot.scss';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import React, {useEffect, useRef, useState} from "react";
import {Button, Form} from 'react-bootstrap';
import {ApiSpot, ApiSpotSpotTypeEnum, ApiStation, SpotsApi, StationApi} from '../../gen/msw-api-ts';
import {useUserAuth} from '../../user/UserAuthContext';
import {AxiosResponse} from "axios";
import {v4 as uuid} from 'uuid';
import {Typeahead} from "react-bootstrap-typeahead";
import Modal from "react-bootstrap/Modal";
import {authConfiguration} from "../../api/config/AuthConfiguration";
import {locationsService} from "../../service/LocationsService";

export const MswAddSpot = () => {

    const [showAddSpotModal, setShowAddSpotModal] = useState(false);
    const handleShowAddSpotModal = () => setShowAddSpotModal(true);
    const handleAddSpotAndCloseModal = (e: { preventDefault: any; }) => {
        e.preventDefault();
        addSpot().then(() => setIsSubmitButtonDisabled(false));
    }
    const handleCancelAddSpotModal = () => setShowAddSpotModal(false);

    const [spotName, setSpotName] = useState("");
    const [type, setType] = useState<ApiSpotSpotTypeEnum>(ApiSpotSpotTypeEnum.RiverSurf);
    const [stationId, setStationId] = useState<number | undefined>(undefined);
    const [minFlow, setMinFlow] = useState<number | undefined>(undefined);
    const [maxFlow, setMaxFlow] = useState<number | undefined>(undefined);
    const [stations, setStations] = useState<ApiStation[]>([])
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);
    const [stationSelectionError, setStationSelectionError] = useState('');

    useEffect(() => {
        new StationApi().getStations().then((response) => setStations(response.data));
    }, []);


    // @ts-ignore
    const {token} = useUserAuth();

    const formRef = useRef<HTMLFormElement | null>(null);

    async function addSpot() {
        if (!stationId) {
            setStationSelectionError('Please select a valid option.');
            return;
        } else {
            setStationSelectionError('');
        }

        setIsSubmitButtonDisabled(true);
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
        let response: AxiosResponse<void, any> = await new SpotsApi(config).addPrivateSpot({spot: apiSpot, position: 0})
        if (response.status === 200) {
            locationsService.fetchData(token, true).then(handleCancelAddSpotModal);
        } else {
            alert("Sorry, it looks like we can't add that spot. Maybe the flow is not measured at this station?");
        }
    }

    return <>
        <Button variant='outline-primary me-2' size='sm' onClick={() => handleShowAddSpotModal()}>Add Spot</Button>
        <Modal show={showAddSpotModal} onHide={handleCancelAddSpotModal}>
            <Modal.Header closeButton>
                <Modal.Title>Add new private Spot</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form">
                    <p className="info">This spot will only be visible to you. Other surfers will have to find this wave themselves.</p>
                    <Form ref={formRef} onSubmit={handleAddSpotAndCloseModal}>
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
                                    checked={type === ApiSpotSpotTypeEnum.RiverSurf}
                                    onChange={() => setType(ApiSpotSpotTypeEnum.RiverSurf)}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Bungeesurf"
                                    name="radioTypeGroup"
                                    id="bungeesurf"
                                    checked={type === ApiSpotSpotTypeEnum.BungeeSurf}
                                    onChange={() => setType(ApiSpotSpotTypeEnum.BungeeSurf)}
                                />
                            </Form>
                        </Form.Group>

                        <Form.Label htmlFor="formBasicStationId">The measuring station
                            (from <a href="https://www.hydrodaten.admin.ch/" target="_blank" rel="noopener noreferrer">hydrodaten.admin.ch</a>)</Form.Label>
                        <Form.Group className="mb-3" controlId="formBasicStationId">
                            <Typeahead
                                allowNew={false}
                                inputProps={{required: true}}
                                id="station-autocomplete"
                                labelKey="label"
                                onChange={(station) => {
                                    setStationId((station.pop() as ApiStation).id);
                                    setStationSelectionError('');
                                }}
                                options={stations}
                                placeholder="Station">
                            </Typeahead>
                            {stationSelectionError && <div style={{color: 'red'}}>{stationSelectionError}</div>}
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
                    </Form>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-dark" onClick={handleCancelAddSpotModal}>
                    Cancel
                </Button>
                <Button disabled={isSubmitButtonDisabled} variant="primary" type="submit" onClick={() => formRef.current && formRef.current.requestSubmit()}>
                    Add Spot
                </Button>
            </Modal.Footer>
        </Modal>
    </>;
}