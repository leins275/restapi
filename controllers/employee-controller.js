const Boom = require('boom');
const StatusCodes = require('http-status-codes');
const { employeeMsg } = require('../utils/messages');
const { employeeCollection } = require('../utils/constants');
const { specifyService } = require('../utils/utils');
const Service = specifyService(require('../services/lowdb-service'), employeeCollection);

function getById(req, res) {
    const employeeId = Number.parseInt(req.params.id, 10);

    Service.getItem(employeeId, employeeMsg.NOT_FOUND(employeeId))
        .then(data => res.status(StatusCodes.OK).send(data))
        .catch(error => res.json(error));
}

function get(req, res) {
    const filters = { ...req.query };
    delete filters.page_num;

    Service.getCollection(filters, req.query.page_num || 1)
        .then(data => res.status(StatusCodes.OK).send(data))
        .catch(() => res.json(Boom.notFound(employeeMsg.NO_COLLECTION)));
}

function create(req, res) {
    const item = {
        ...req.body,
        salary: Number.parseInt(req.body.salary, 10),
    };
    Service.addItem(item)
        .then(data => res.status(StatusCodes.OK).send(data))
        .catch(error => res.json(Boom.internal(error)));
}

function update(req, res) {
    const employeeId = Number.parseInt(req.params.id, 10);
    Service.updateItem(employeeId, req.body)
        .then(data => res.status(StatusCodes.OK).send(data))
        .catch(error => res.json(Boom.internal(error)));
}

function del(req, res) {
    const employeeId = Number.parseInt(req.params.id, 10);

    Service.deleteItem(employeeId)
        .then(data => res.status(StatusCodes.OK).send(data))
        .catch(() => res.json(Boom.notFound(employeeMsg.NOT_FOUND(employeeId))));
}

module.exports = {
    getById,
    get,
    update,
    create,
    del
};
