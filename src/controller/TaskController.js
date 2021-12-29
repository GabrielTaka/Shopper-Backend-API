const TaskModel = require("../model/TaskModel");

class TaskController {

    async create(req, res) {
        const task = new TaskModel(req.body);
        await task
                .save()
                .then((result) => {
                    return res.status(200).json(result);
                }).catch((err) => {
                    return res.status(500).json(err);
                });
    }

    async update(req, res) { 
        await TaskModel.findByIdAndUpdate({'_id': req.params.id}, req.body, {new: true})
        .then((result) => {
            return res.status(200).json(result);
        }).catch((err) => {
            return res.status(500).json(err);
        });
    }

    async all(req, res) { 
        await TaskModel.find({macaddress: {'$in': req.params.macaddress }}).sort('when')
        .then((result) => {
            return res.status(200).json(result);
        }).catch((err) => {
            return res.status(500).json(err);           
        });
    }

    async show(req, res) { 
        await TaskModel.findById(req.params.id)
        .then((result) => {
            return res.status(200).json(result);
        }).catch((err) => {
            return res.status(500).json(err);
        });
    }

    async delete(req, res) { 
        await TaskModel.deleteOne({'_id': req.params.id})
        .then((result) => {
            return res.status(200).json(result);
        }).catch((err) => {
            return res.status(500).json(err);
        });
    }

    async done(req, res) { 
        await TaskModel.findByIdAndUpdate(
            {'_id': req.params.id},
            {'done': req.params.done},
            {new: true},
        ).then((result) => {
            return res.status(200).json(result);
        }).catch((err) => {
            return res.status(500).json(err);
        });

    }
}

module.exports = new TaskController();