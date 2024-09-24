import React, {useContext, useEffect, useState} from 'react';
import {Button, Container} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import BasketList from '../components/BasketList';
import { fetchBasket } from '../http/basketAPI';
import { $authHost } from '../http';
import jwtDecode from 'jwt-decode';

const Basket = observer(() => {
    return (
        <Container className='flex-column'>
                <BasketList/>
            <Button className='mt-3'>Перейти к оплате</Button>
        </Container>
    );
});

export default Basket;