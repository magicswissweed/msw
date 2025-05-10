import './MswEditSpot.scss';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import React, {useEffect, useRef, useState} from "react";
import {
    ApiSpot,
    ApiSpotInformation,
    ApiSpotSpotTypeEnum,
    ApiStation,
    EditPrivateSpotRequest,
    SpotsApi,
    StationApi
} from '../../gen/msw-api-ts';
import {useUserAuth} from '../../user/UserAuthContext';
import {AxiosResponse} from "axios";
import {authConfiguration} from "../../api/config/AuthConfiguration";
import {spotsService} from "../../service/SpotsService";
import edit_icon from "../../assets/edit.svg";
import {MswAddOrEditSpotModal} from "../MswAddOrEditUtil";

// specify the properties (inputs) for the MswEditSpot component
interface MswEditSpotProps {
    location: ApiSpotInformation;
}

export const MswEditSpot: React.FC<MswEditSpotProps> = ({location}) => {
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
            await spotsService.fetchData(token, true).then(() => {
                handleCancelEditSpotModal();
                window.location.reload();   // TODO: find better solution to bring data to charts
            });
        } else {
            // TODO: filter all spots where flow is not measured
            alert("Sorry, it looks like we can't update that spot. Maybe the flow is not measured at this station?");
        }
    }

    let isEditMode = true;
    return <>
        <div className="icon" onClick={() => handleShowEditSpotModal()}>
            <img alt="Edit this private spot." title="Edit this private spot." src={edit_icon}/>
        </div>
        {MswAddOrEditSpotModal(
            showEditSpotModal,
            handleCancelEditSpotModal,
            formRef,
            handleEditSpotAndCloseModal,
            spotName,
            setSpotName,
            type,
            setType,
            setStationId,
            setStationSelectionError,
            stations,
            stationId,
            stationSelectionError,
            minFlow,
            setMinFlow,
            maxFlow,
            setMaxFlow,
            isSubmitButtonDisabled,
            setIsSubmitButtonDisabled,
            isEditMode)}
    </>;
}
