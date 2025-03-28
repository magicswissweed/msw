import React from "react";
import {ApiSpotSpotTypeEnum, ApiStation} from "../gen/msw-api-ts";
import {Button, Form} from "react-bootstrap";
import {Typeahead} from "react-bootstrap-typeahead";
import Modal from "react-bootstrap/Modal";

export function MswAddOrEditSpotModal(showModal: boolean | undefined, handleCancelModal: (() => void) | undefined, formRef: React.MutableRefObject<HTMLFormElement | null>, handleSaveAndCloseModal: (e: { preventDefault: any }) => void, spotName: string, setSpotName: (value: (((prevState: string) => string) | string)) => void, type: ApiSpotSpotTypeEnum, setType: (value: (((prevState: (ApiSpotSpotTypeEnum)) => (ApiSpotSpotTypeEnum)) | ApiSpotSpotTypeEnum)) => void, setStationId: (value: (((prevState: (number | undefined)) => (number | undefined)) | number | undefined)) => void, setStationSelectionError: (value: (((prevState: string) => string) | string)) => void, stations: ApiStation[], stationId: number | undefined, stationSelectionError: string, minFlow: number | undefined, setMinFlow: (value: (((prevState: (number | undefined)) => (number | undefined)) | number | undefined)) => void, maxFlow: number | undefined, setMaxFlow: (value: (((prevState: (number | undefined)) => (number | undefined)) | number | undefined)) => void, isSubmitButtonDisabled: boolean | undefined, modalTitle: React.JSX.Element) {
    return <>
        <Modal show={showModal} onHide={handleCancelModal}>
            <Modal.Header closeButton>
                <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form">
                    <p className="info">This spot will only be visible to you. Other surfers will have to find this spot
                        themselves.</p>
                    <Form ref={formRef} onSubmit={handleSaveAndCloseModal}>
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
                            (from <a href="https://www.hydrodaten.admin.ch/" target="_blank"
                                     rel="noopener noreferrer">hydrodaten.admin.ch</a>)</Form.Label>
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
                <Button variant="outline-dark" onClick={handleCancelModal}>
                    Cancel
                </Button>
                <Button disabled={isSubmitButtonDisabled} variant="primary" type="submit"
                        onClick={() => formRef.current && formRef.current.requestSubmit()}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    </>;
}