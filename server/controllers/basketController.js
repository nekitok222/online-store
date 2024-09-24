const {Basket, User, Device} = require('../models/models');
const {BasketDevice} = require('../models/models');
const ApiError = require('../error/ApiError');


class BasketController {
    async addDevice(req, res, next) {
        const { id, deviceId, amount } = req.body

        if (!id) {
            return next(ApiError.badRequest('Пользователь не авторизован'))
        }

        if (!deviceId) {
            return next(ApiError.badRequest('Не выбрано устройство'))
        }

        if (!amount) {
            return next(ApiError.badRequest('Не задано колличество'))
        }

        const user = await User.findAll({
            where: {
                id: id
            }
        })

        if (!user[0]) {
            return next(ApiError.badRequest('Не удалось создать корзину, авторизуйтесь для совершения покупок.'))
        }

        const device = await Device.findByPk(deviceId)

        if(!device) {
            return next(ApiError.badRequest('Такого устройства на сайте нет!'))
        }

        let isBasket = await Basket.findAll({
            where: {
                userId: id
            }
        })

        if (!isBasket[0]) {   
            isBasket = await Basket.create(
                {
                    userId: id
                }
            )

            isBasket = await Basket.findAll({
                where: {
                    userId: id
                }
            })
        }

        const basketCheck = await BasketDevice.findAll({
            where: {
                deviceId: deviceId
            }
        })

        if (!basketCheck[0]) {
            const basketDevice = await BasketDevice.create(
                {
                    basketId: isBasket[0].dataValues.id,
                    deviceId: deviceId,
                    amount: amount
                }
            )
            return res.json(basketDevice)
        }

        const amounts = basketCheck[0].dataValues.amount
        await BasketDevice.update({amount: amounts + amount}, {
            where: {
                deviceId: deviceId
            }
        })

        return res.json(true)
    }

    async deleteDevice(req, res, next) {
        try {
            const { deviceId, userId } = req.body

            if (!deviceId) {
                return next(ApiError.badRequest('Не указан идентификатор устройства'))
            }

            if (!userId) {
                return next(ApiError.badRequest('Не указан идентификатор корзины'))
            }

            const basket = await Basket.findAll({
                where: {
                    userId: userId
                }
            })

            if (!basket[0]) {   
                return next(ApiError.badRequest('Корзина отсутствует'))
            }

            const device = await Device.findByPk(deviceId)

            if (!device) {
                return next(ApiError.badRequest('Такого устройства нет'))
            }

            const basketInDevice = await BasketDevice.findAll({
                where: {
                    deviceId: deviceId,
                    basketId: basket[0].dataValues.id
                }
            })

            if (!basketInDevice[0]) {
                return next(ApiError.badRequest('Нечего удалять'))
            }

            const basketDevice = await BasketDevice.destroy({
                where: {
                    deviceId: deviceId,
                    basketId: basket[0].dataValues.id
                }
            })

            return res.json(true)

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }  
    }

    async getBasket(req, res, next) {
        const { id } = req.params

        if (!id) {
            return next(ApiError.badRequest('Такого пользователя нет'))
        }

        const basket = await Basket.findAll({
            where: {
                userId: id
            }
        })

        const basketDevice = await BasketDevice.findAll({
            where: {
                basketId: basket[0].id
            }
        })
        return res.json(basketDevice)
    }

}

module.exports = new BasketController()