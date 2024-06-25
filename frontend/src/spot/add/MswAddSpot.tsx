import './MswAddSpot.scss'
import React, {FormEvent, useState} from "react";
import {Button, Form} from 'react-bootstrap';
import {ApiSpot, ApiSpotSpotTypeEnum, Configuration, SpotsApi} from '../../gen/msw-api-ts';
import {authConfiguration} from '../../api/config/AuthConfiguration';
import {useUserAuth} from '../../user/UserAuthContext';
import {useNavigate} from 'react-router-dom';

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
    authConfiguration(token, (config: Configuration) => {
      const apiSpot: ApiSpot = {
        name: spotName,
        stationId: stationId,
        spotType: type,
        isPublic: false,
        minFlow: minFlow,
        maxFlow: maxFlow,
      };
      // TODO: position should not be 0, but riversurfspots.length + 1, or bungeesurfSpots.length + 1
      new SpotsApi(config).addPrivateSpot({spot: apiSpot, position: 0})
        .then((response) => {
          if (response.status === 200) {
            navigate('/');
          } else {
            alert('StationId is not valid. Please check your entered data.');
          }
        });
    });
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

            <Form.Label htmlFor="formBasicStationId">The stationId of the Spot
              (from <a href="https://www.hydrodaten.admin.ch/">hydrodaten.admin.ch</a>)</Form.Label>
            <Form.Group className="mb-3" controlId="formBasicStationId">
              <Form.Control
                required
                type="number"
                placeholder="The id from BAFU's station"
                // @ts-ignore
                onChange={(e) => setStationId(e.target.value)}
              />
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
              <Button variant="primary" type="submit">
                Save
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </>;
}