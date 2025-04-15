import './MswSpotMap.scss';
import React, {useState} from "react";
import {ApiSpotInformation, ApiSpotSpotTypeEnum} from "../../../gen/msw-api-ts";
import {MswSpotMapPerCategory} from "./per-category/MswSpotMapPerCategory";
import {Col, Form, Row} from "react-bootstrap";

interface MswSpotMapProps {
    riverSurfLocations: Array<ApiSpotInformation>,
    bungeeSurfLocations: Array<ApiSpotInformation>
}

export const MswSpotMap: React.FC<MswSpotMapProps> = (props: MswSpotMapProps) => {
    const [showSpotCategory, setShowSpotCategory] = useState<ApiSpotSpotTypeEnum>(ApiSpotSpotTypeEnum.RiverSurf);

    return <>
        <div className='map-including-switch-container'>
            <MswSpotMapPerCategory spots={showSpotCategory == ApiSpotSpotTypeEnum.RiverSurf ?
                props.riverSurfLocations : props.bungeeSurfLocations}/>

            <Form>
                <Row className="align-items-center">
                    <Col className="text-end">Riversurf</Col>
                    <Col xs="auto">
                        <Form.Check
                            type="switch"
                            id="graph-toggle"
                            checked={showSpotCategory === ApiSpotSpotTypeEnum.BungeeSurf}
                            onChange={() => {
                                if (showSpotCategory === ApiSpotSpotTypeEnum.RiverSurf) {
                                    setShowSpotCategory(ApiSpotSpotTypeEnum.BungeeSurf)
                                } else {
                                    setShowSpotCategory(ApiSpotSpotTypeEnum.RiverSurf)
                                }
                            }}
                        />
                    </Col>
                    <Col className="text-start">Bungeesurf</Col>
                </Row>
            </Form>
        </div>
    </>;
};
