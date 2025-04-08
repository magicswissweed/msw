import './Spot.scss'
import React, {useState} from 'react';
import {ApiSpotInformation, EditPrivateSpotRequest, SpotsApi} from '../../../gen/msw-api-ts';
import {MswEditSpot} from "../../../spot/edit/MswEditSpot";
import {MswMeasurement} from './measurement/MswMeasurement';
import {MswMiniGraph} from './graph/miniGraph/MswMiniGraph';
import arrow_down_icon from '../../../assets/arrow_down.svg';
import lock_icon from '../../../assets/lock.svg';
import delete_icon from '../../../assets/trash.svg';
import globe_icon from '../../../assets/globe.svg';
import link_icon from '../../../assets/link.svg';
import drag_drop_icon from '../../../assets/drag_drop_icon.svg';
import {authConfiguration} from '../../../api/config/AuthConfiguration';
import {useUserAuth} from '../../../user/UserAuthContext';
import Modal from 'react-bootstrap/Modal';
import {Button} from "react-bootstrap";
import {locationsService} from "../../../service/LocationsService";
import {MswHistoricalYearsGraph} from "./graph/historical/MswHistoricalYearsGraph";
import {MswForecastGraph} from "./graph/forecast/MswForecastGraph";
import {MswLastMeasurementsGraph} from "./graph/historical/MswLastMeasurementsGraph";
import {GraphTypeEnum} from "../../MswOverviewPage";

interface SpotProps {
    location: ApiSpotInformation,
    dragHandleProps: any,
    showGraphOfType: GraphTypeEnum
}

export const Spot = (props: SpotProps) => {
    // @ts-ignore
    const {token, user} = useUserAuth();

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const handleDeleteSpotAndCloseModal = (location: ApiSpotInformation) => deleteSpot(location).then(handleCancelConfirmationModal);
    const handleCancelConfirmationModal = () => setShowConfirmationModal(false);
    const handleShowConfirmationModal = () => setShowConfirmationModal(true);


    return <>
        <details key={props.location.name} className="spot spot-desktop">
            <summary className="spotname">
                {getSpotSummaryContent(props.location)}
            </summary>
            {getCollapsibleContent(props.location)}
        </details>
        <div className="spot spot-mobile">
            <div className={"spot-overview"}>
                {getSpotSummaryContent(props.location)}
            </div>
            {getCollapsibleContent(props.location, false, true, true, true, true)}
        </div>
    </>;

    function getSpotSummaryContent(location: ApiSpotInformation) {
        let link = "https://www.hydrodaten.admin.ch/de/seen-und-fluesse/stationen-und-daten/" + location.stationId;

        return <>
            <div className='icons-container'>
              {user &&
                <div className={'icon drag-drop-icon arrow-icon'} {...props.dragHandleProps}>
                  <img alt="Sort the spots on your dashboard." src={drag_drop_icon}/>
                </div>
              }
            </div>
            <div className="spotContainer">
                <div className="spot-title">
                    <a href={link} target="_blank" rel="noreferrer">{location.name}</a>
                </div>
                <MswMeasurement location={location}/>
                <MswMiniGraph location={location} showGraphOfType={props.showGraphOfType}/>
            </div>
            <div className="icons-container">
                <div className="icon">
                    {location.isPublic ?
                        <img className={"public"}
                             alt="This is a public spot. Everyone can see it."
                             title="This is a public spot. Everyone can see it."
                             src={globe_icon}/> :
                        <img alt="This is a private spot. Only you can see it."
                             title="This is a private spot. Only you can see it."
                             src={lock_icon}/>
                    }

                </div>
                {user &&
                    <MswEditSpot location={location}/>
                }
                {user &&
                    <div className="icon" onClick={() => handleShowConfirmationModal()}>
                        <img alt="Delete this spot from your dashboard." title="Delete this spot from your dashboard." src={delete_icon}/>
                    </div>
                }
                <Modal show={showConfirmationModal} onHide={handleCancelConfirmationModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>You won't be able to retrieve this spot. If you need it again you will have to add a new one.</Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-dark" onClick={handleCancelConfirmationModal}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteSpotAndCloseModal(location)}>
                            Delete Spot
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div className="collapsible-icon icon arrow-icon">
                    <img alt="extend forecast" src={arrow_down_icon}/>
                </div>
            </div>
        </>
    }

    function getCollapsibleContent(location: ApiSpotInformation,
                                   withLegend: boolean = true,
                                   withXAxis: boolean = true,
                                   withYAxis: boolean = true,
                                   withMinMaxReferenceLines: boolean = true,
                                   withTooltip: boolean = true) {
        let forecastContent = <>
            <MswForecastGraph location={location}
                              aspectRatio={2}
                              withLegend={withLegend}
                              withXAxis={withXAxis}
                              withYAxis={withYAxis}
                              withMinMaxReferenceLines={withMinMaxReferenceLines}
                              withTooltip={withTooltip}/>
        </>;

        let lastMeasurementsContent = <>
            <div className="last40days-container">
                <p>Forecast unavailable - showing last 40 days</p>
                <MswLastMeasurementsGraph location={location}
                                          aspectRatio={2}
                                          withLegend={withLegend}
                                          withXAxis={withXAxis}
                                          withYAxis={withYAxis}
                                          withMinMaxReferenceLines={withMinMaxReferenceLines}
                                          withTooltip={withTooltip}/>
            </div>
        </>;

        let historicalYearsContent = <>
            <MswHistoricalYearsGraph location={location}
                                     aspectRatio={2}
                                     withLegend={withLegend}
                                     withXAxis={withXAxis}
                                     withYAxis={withYAxis}
                                     withMinMaxReferenceLines={withMinMaxReferenceLines}
                                     withTooltip={withTooltip}/>
        </>;

        return <>
            <div className="collapsibleContent">
                {props.showGraphOfType === GraphTypeEnum.Forecast ?
                    (location.forecast ? forecastContent : lastMeasurementsContent) :
                    historicalYearsContent}
            </div>
        </>;
    }

    async function deleteSpot(location: ApiSpotInformation) {
        let config = await authConfiguration(token);
        new SpotsApi(config).deletePrivateSpot(location.id!); // no await to not be blocking
        locationsService.deleteLocation(location.id!);
    }

    async function editSpot(location: ApiSpotInformation, editPrivateSpotRequest: EditPrivateSpotRequest) {
        let config = await authConfiguration(token);
        new SpotsApi(config).editPrivateSpot(location.id!, editPrivateSpotRequest!); // no await to not be blocking
    }
}