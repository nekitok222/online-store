import React, { useEffect, useState } from 'react';
import {Card, Col} from "react-bootstrap";
import Image from "react-bootstrap/Image";
import star from '../assets/star.png'
import {useHistory} from "react-router-dom"
import {DEVICE_ROUTE} from "../utils/consts";
import { fetchOneDevice } from '../http/deviceAPI';

const DeviceItem = ({device, amount, sum}) => {
    const history = useHistory()
    const [deviceInfo, setDeviceInfo] = useState({info: []})

    useEffect(() => {
        fetchOneDevice(device.id).then(data => setDeviceInfo(data))
    }, [])

    return (
        <div className='d-flex border-bottom'>
            <Col md={3} className={"mt-3"} onClick={() => history.push(DEVICE_ROUTE + '/' + device.id)}>
            <Card className='mb-3' style={{width: 150, cursor: 'pointer'}} border={"light"}>
                <Image width={150} height={150} src={process.env.REACT_APP_API_URL + device.img}/>
                <div className="text-black-50 mt-1 d-flex justify-content-between align-items-center">
                    <div>{device.name}</div>
                    <div className="d-flex align-items-center">
                        <div>{device.rating}</div>
                        <Image width={18} height={18} src={star}/>
                    </div>
                </div>
            </Card>
            </Col>
            <div className='m-3 d-flex justify-content-around flex-grow-1'>
                <div>{device.name}</div>
                <div className='font-weight-bold'>КОЛЛИЧЕСТВО: {amount}</div>
                <div className='font-weight-bold'>ЦЕНА: {amount * sum}</div>
            </div>
        </div>
    );
};

export default DeviceItem;