const Message = require('../models/message');

const create = async (data) =>
{
    const result = await Message.create(data);
    return result;
};

const getAll = async () =>
{
    const result = await Message.find();
    return result;
};

module.exports = {
    create, getAll
}