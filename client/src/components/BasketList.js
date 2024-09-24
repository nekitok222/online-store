import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import BasketItem from "./BasketItem";
import Spinner from 'react-bootstrap/Spinner';
import { $authHost } from '../http';
import jwtDecode from 'jwt-decode';
import { fetchBasket } from '../http/basketAPI';

const BasketList = observer(() => {
    const {device} = useContext(Context)
    const [isReady, setIsReady] = useState(false)
    const [cost, setCost] = useState(0)
    const [devices, setDevices] = useState([])

    useEffect(() => {
        async function getBasket() {
            const {data} = await $authHost.get('api/user/auth' )
            const decoded = jwtDecode(data.token, process.env.SECRET_KEY)
            const devFromBasket = fetchBasket(decoded.id).then(data => {
                setDevices(data)
            })
        }
    
        getBasket()
      }, [])

    
    useEffect(() => {
        let allcost = 0
        devices.map(devBasket => 
            allcost += device.devices.find(device => device.id === devBasket.deviceId).price * devBasket.amount    
        )
        setIsReady(true)
        setCost(allcost)
    }, [device, devices])

    useEffect(() => {

    }, [isReady])

    return (
        <div>
            {
                !isReady
                        ?   <Spinner animation="border" />
                        : devices.map(devBasket =>          
                            <BasketItem key={devBasket.deviceId} device={device.devices.find(device => device.id === devBasket.deviceId)} amount={devBasket.amount} sum={device.devices.find(device => device.id === devBasket.deviceId).price}/>                             
                        )
            }
            <div className='mt-3'>
                <p>СУММА: {cost}</p>
            </div>
        </div>
    );
});

export default BasketList;