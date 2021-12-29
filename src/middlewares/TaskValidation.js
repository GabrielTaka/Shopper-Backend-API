const TaskModel = require("../model/TaskModel");

const TaskValidation = async (req, res, next) => {
    const {macaddress, type, title, description, when} = req.body;

    if (!macaddress) return res.status(400).json({error: 'macaddress is required'});
    else if (!type) return res.status(400).json({error: 'type is required'});
    else if (!title) return res.status(400).json({error: 'title is required'});
    else if (!description) return res.status(400).json({error: 'description is required'});
    else if (!when) return res.status(400).json({error: 'when is required'});
    else {
        let exists;

        if(req.params.id) {
            exists = await TaskModel.findOne(
                {
                    'when': {'$eq': new Date(when)}, 
                    'macaddress': {'$in': macaddress},
                    '_id': {'$ne': req.params.id}
                });
        } else {
            exists = await TaskModel.findOne(
                {
                    'when': {'$eq': new Date(when)}, 
                    'macaddress': {'$in': macaddress} 
                });
        }

        if (exists) return res.status(400).json({error: 'when already registered with this macaddress, please choose another date'});
        next();
    }
}

module.exports = TaskValidation;