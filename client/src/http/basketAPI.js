import {$authHost, $host} from "./index";

export const addDevice = async (id ,deviceId, amount = 1) => {
    const {data} = await $authHost.post('api/basket', id, deviceId, amount)
    return data
}

export const fetchBasket = async (id) => {
    const {data} = await $host.get('api/basket/' + id)
    return data
}

export const deleteDevice = async (deviceId, userId) => {
    const {data} = await $authHost.delete('api/basket', deviceId, userId)
    return data
}