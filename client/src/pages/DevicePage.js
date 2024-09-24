import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Container, Image, Row, Form} from "react-bootstrap";
import bigStar from '../assets/bigStar.png'
import {useHistory, useParams} from 'react-router-dom'
import {fetchOneDevice} from "../http/deviceAPI";
import { BASKET_ROUTE } from '../utils/consts';
import { $authHost } from '../http';
import { observer } from 'mobx-react-lite';
import jwtDecode from 'jwt-decode';
import { addDevice } from '../http/basketAPI';

const DevicePage = observer(() => {
    const history = useHistory()
    const [device, setDevice] = useState({info: []})
    const [amount, setAmount] = useState(1)
    const [value, setValue] = useState('')
    const {id} = useParams()
    
    const click = async () => {
        try {
            const {data} = await $authHost.get('api/user/auth' )
            const decoded = jwtDecode(data.token, process.env.SECRET_KEY)
            addDevice({id: decoded.id, deviceId: id, amount: amount}).then(data => {
                history.push(BASKET_ROUTE + '/' + decoded.id)
            })
        } catch (e) {
            alert(e.response.data.message)
        }

    }
    
    useEffect(() => {
        fetchOneDevice(id).then(data => setDevice(data))
    }, [])

    return (
        <Container className="mt-3">
            <Row>
                <Col md={4}>
                    <Image width={300} height={300} src={process.env.REACT_APP_API_URL + device.img}/>
                </Col>
                <Col md={4}>
                    <Row className="d-flex flex-column align-items-center">
                        <h2>{device.name}</h2>
                        <div
                            className="d-flex align-items-center justify-content-center"
                            style={{background: `url(${bigStar}) no-repeat center center`, width:240, height: 240, backgroundSize: 'cover', fontSize:64}}
                        >
                            {device.rating}
                        </div>
                    </Row>
                </Col>
                <Col md={4}>
                    <Card
                        className="d-flex flex-column align-items-center justify-content-around"
                        style={{width: 300, height: 300, fontSize: 32, border: '5px solid lightgray'}}
                    >
                        <h3>{device.price * amount} руб.</h3>
                        <Form>
                            <h6 className="m-3">Введите колличество товара</h6>
                            <Form.Control
                                value={amount}
                                onChange={e => setAmount(Number(e.target.value))}
                                className="mt-3"
                                placeholder="Введите стоимость устройства"
                                type="number"
                            />
                        </Form>
                        <Button variant={"outline-dark"} onClick={click}>Добавить в корзину</Button>
                    </Card>
                </Col>
            </Row>
            <Row className="d-flex flex-column m-3">
                <h1>Характеристики</h1>
                {device.info.map((info, index) =>
                    <Row key={info.id} style={{background: index % 2 === 0 ? 'lightgray' : 'transparent', padding: 10}}>
                        {info.title}: {info.description}
                    </Row>
                )}
            </Row>
        </Container>
    );
});

export default DevicePage;
