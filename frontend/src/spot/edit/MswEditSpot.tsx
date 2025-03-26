import './MswEditSpot.scss';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import React, {useEffect, useRef, useState} from "react";
import {Button, Form} from 'react-bootstrap';
import {ApiSpot, ApiSpotInformation, ApiSpotSpotTypeEnum, ApiStation, SpotsApi, StationApi, EditPrivateSpotRequest} from '../../gen/msw-api-ts';
import {useUserAuth} from '../../user/UserAuthContext';
import {AxiosResponse} from "axios";
import {v4 as uuid} from 'uuid';
import {Typeahead} from "react-bootstrap-typeahead";
import Modal from "react-bootstrap/Modal";
import {authConfiguration} from "../../api/config/AuthConfiguration";
import {locationsService} from "../../service/LocationsService";
import edit_icon from "../../assets/edit.svg";

// specify the properties (inputs) for the MswEditSpot component
interface MswEditSpotProps {
    location: ApiSpotInformation;
}

export const MswEditSpot: React.FC<MswEditSpotProps> = ({ location }) => {
    // define modal states
    const [showEditSpotModal, setShowEditSpotModal] = useState(false);
    const handleShowEditSpotModal = () => setShowEditSpotModal(true);
    const handleEditSpotAndCloseModal = (e: { preventDefault: any; }) => {
      // TODO: this prevents page reload (needed for min/maxFlow changes to show) -> remove?
      e.preventDefault();
      editSpot().then(() => setIsSubmitButtonDisabled(false));
    }
    const handleCancelEditSpotModal = () => setShowEditSpotModal(false);

    // define form states and use the current location data as initial values
    const [spotName, setSpotName] = useState(location.name || "");
    const [type, setType] = useState<ApiSpotSpotTypeEnum>(location.spotType || ApiSpotSpotTypeEnum.RiverSurf);
    const [stationId, setStationId] = useState<number | undefined>(location.stationId);
    const [minFlow, setMinFlow] = useState<number | undefined>(location.minFlow);
    const [maxFlow, setMaxFlow] = useState<number | undefined>(location.maxFlow);
    const [stations, setStations] = useState<ApiStation[]>([])
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);
    const [stationSelectionError, setStationSelectionError] = useState('');

    // initial loading of stations (needed for Typeahead)
    useEffect(() => {
        new StationApi().getStations().then((response) => setStations(response.data));
    }, []);

    // @ts-ignore
    const {token} = useUserAuth();

    const formRef = useRef<HTMLFormElement | null>(null);

    async function editSpot() {
        // set potential error message if no station is selected
        if (!stationId) {
            setStationSelectionError('Please select a valid option.');
            return;
        } else {
            setStationSelectionError('');
        }

        setIsSubmitButtonDisabled(true);
        let config = await authConfiguration(token);

        // make formerly public spot private
        if (location.isPublic) {
            // assign new unique id to the spot
            location.id = uuid();
        }

        // create new spot object with the updated values
        const apiSpot: ApiSpot = {
            id: location.id,
            name: spotName,
            stationId: stationId!,
            spotType: type,
            isPublic: false,
            minFlow: minFlow!,
            maxFlow: maxFlow!,
            station: stations.filter(s => s.id === stationId).pop()!
        };

        // wrap spot object in request object and send to API
        const editPrivateSpotRequest: EditPrivateSpotRequest = {
            spot: apiSpot
        };
        let response: AxiosResponse<void, any> = await new SpotsApi(config).editPrivateSpot(location.id, editPrivateSpotRequest)
        if (response.status === 200) {
            // close the modal
            handleCancelEditSpotModal();
            // refresh data via the service
            await locationsService.fetchData(token, true);
            // TODO: is there a better way to enforce changes in min/maxFlow other than a reload?
            // window.location.reload();
        } else {
            // TODO: filter all spots where flow is not measured
            alert("Sorry, it looks like we can't update that spot. Maybe the flow is not measured at this station?");
        }
    }

    return <>
        <div className="icon" onClick={() => handleShowEditSpotModal()}>
            <img alt="Edit this private spot." title="Edit this private spot." src={edit_icon}/>
        </div>
        <Modal show={showEditSpotModal} onHide={handleCancelEditSpotModal}>
            <Modal.Header closeButton>
                <Modal.Title>Edit private Spot</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form">
                    <p className="info">This spot will only be visible to you. Other surfers will have to find this spot themselves.</p>
                    <Form ref={formRef} onSubmit={handleEditSpotAndCloseModal}>
                        <Form.Label htmlFor="formBasicSpotName">Name of the Spot</Form.Label>
                        <Form.Group className="mb-3" controlId="formBasicSpotName">
                            <Form.Control
                                required
                                type="string"
                                placeholder="Name of the Spot"
                                value={spotName}
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
                                onChange={(selected) => {
                                    // distinguish between a valid selection and no selection
                                    if (selected && selected.length > 0) {
                                        const station = selected[0] as ApiStation; // Safely access the first selected item
                                        setStationId(station.id); // Update the stationId state
                                        setStationSelectionError(''); // Clear any selection error
                                    } else {
                                        setStationId(undefined); // Clear the stationId if no selection
                                        setStationSelectionError('Please select a valid option.'); // set an error
                                    }
                                }}
                                options={stations}
                                placeholder="Station"
                                selected={stations.filter(station => station.id === stationId)}
                            />
                            {stationSelectionError && <div style={{color: 'red'}}>{stationSelectionError}</div>}
                        </Form.Group>

                        <Form.Label htmlFor="formBasicMinFlow">Minimum Flow for Spot to Work</Form.Label>
                        <Form.Group className="mb-3" controlId="formBasicMinFlow">
                            <Form.Control
                                required
                                type="number"
                                placeholder="Minimum Flow"
                                value={minFlow}
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
                                value={maxFlow}
                                // @ts-ignore
                                onChange={(e) => setMaxFlow(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-dark" onClick={handleCancelEditSpotModal}>
                    Cancel
                </Button>
                <Button disabled={isSubmitButtonDisabled} variant="primary" type="submit" onClick={() => formRef.current && formRef.current.requestSubmit()}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    </>;
}
