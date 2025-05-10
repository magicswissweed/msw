import './Spot.scss'
import React, {useState} from 'react';
import {ApiSpotInformation, SpotsApi} from '../../../gen/msw-api-ts';
import {MswEditSpot} from "../../../spot/edit/MswEditSpot";
import {MswMeasurement} from './measurement/MswMeasurement';
import {MswMiniGraph} from './graph/miniGraph/MswMiniGraph';
import arrow_down_icon from '../../../assets/arrow_down.svg';
import delete_icon from '../../../assets/trash.svg';
import link_icon from '../../../assets/link.svg';
import drag_drop_icon from '../../../assets/drag_drop_icon.svg';
import {authConfiguration} from '../../../api/config/AuthConfiguration';
import {useUserAuth} from '../../../user/UserAuthContext';
import Modal from 'react-bootstrap/Modal';
import {Button} from "react-bootstrap";
import {spotsService} from "../../../service/SpotsService";
import {MswHistoricalYearsGraph} from "./graph/historical/MswHistoricalYearsGraph";
import {MswForecastGraph} from "./graph/forecast/MswForecastGraph";
import {MswLastMeasurementsGraph} from "./graph/historical/MswLastMeasurementsGraph";
import {GraphTypeEnum} from "../../MswOverviewPage";

interface SpotProps {
    spot: ApiSpotInformation,
    dragHandleProps: any,
    showGraphOfType: GraphTypeEnum
}

export const Spot = (props: SpotProps) => {
    // @ts-ignore
    const {token, user} = useUserAuth();

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const handleDeleteSpotAndCloseModal = (spot: ApiSpotInformation) => deleteSpot(spot).then(handleCancelConfirmationModal);
    const handleCancelConfirmationModal = () => setShowConfirmationModal(false);
    const handleShowConfirmationModal = () => setShowConfirmationModal(true);


    return <>
        <details key={props.spot.name} className="spot spot-desktop">
            <summary className="spotname">
                {getSpotSummaryContent(props.spot)}
            </summary>
            {getCollapsibleContent(props.spot)}
        </details>
        <div className="spot spot-mobile">
            <div className={"spot-overview"}>
                {getSpotSummaryContent(props.spot)}
            </div>
            {getCollapsibleContent(props.spot, false, true, true, true, true)}
        </div>
    </>;

    function getSpotSummaryContent(spot: ApiSpotInformation) {
        let link = "https://www.hydrodaten.admin.ch/de/seen-und-fluesse/stationen-und-daten/" + spot.stationId;

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
                    {spot.name}
                </div>
                <MswMeasurement spot={spot}/>
                <MswMiniGraph spot={spot} showGraphOfType={props.showGraphOfType}/>
            </div>
            <div className="icons-container">
                <div className="icon">
                    <a href={link} target="_blank" rel="noreferrer">
                        <img src={link_icon} alt="Link to the BAFU station" title="Link to the BAFU station"/>
                    </a>
                </div>
                {user &&
                    <MswEditSpot spot={spot}/>
                }
                {user &&
                    <div className="icon" onClick={() => handleShowConfirmationModal()}>
                        <img alt="Delete this spot from your dashboard." title="Delete this spot from your dashboard."
                             src={delete_icon}/>
                    </div>
                }
                <Modal show={showConfirmationModal} onHide={handleCancelConfirmationModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>You won't be able to retrieve this spot. If you need it again you will have to add a new
                        one.</Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-dark" onClick={handleCancelConfirmationModal}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteSpotAndCloseModal(spot)}>
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

    function getCollapsibleContent(spot: ApiSpotInformation,
                                   withLegend: boolean = true,
                                   withXAxis: boolean = true,
                                   withYAxis: boolean = true,
                                   withMinMaxReferenceLines: boolean = true,
                                   withTooltip: boolean = true) {
        let forecastContent = <>
            <MswForecastGraph spot={spot}
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
                <MswLastMeasurementsGraph spot={spot}
                                          aspectRatio={2}
                                          withLegend={withLegend}
                                          withXAxis={withXAxis}
                                          withYAxis={withYAxis}
                                          withMinMaxReferenceLines={withMinMaxReferenceLines}
                                          withTooltip={withTooltip}/>
            </div>
        </>;

        let historicalYearsContent = <>
            <MswHistoricalYearsGraph spot={spot}
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
                    (spot.forecast ? forecastContent : lastMeasurementsContent) :
                    historicalYearsContent}
            </div>
        </>;
    }

    async function deleteSpot(spot: ApiSpotInformation) {
        let config = await authConfiguration(token);
        new SpotsApi(config).deletePrivateSpot(spot.id!); // no await to not be blocking
        spotsService.deleteSpot(spot.id!);
    }

}
