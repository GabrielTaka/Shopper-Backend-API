const express = require("express");
const router = express.Router();

const TaskController = require("../controller/TaskController");
const TaskValidation = require("../middlewares/TaskValidation");

router.post('/', TaskValidation, TaskController.create);
router.put('/:id', TaskController.update);
router.get('/:id', TaskController.show);
router.get('/filter/all/:macaddress', TaskController.all);
router.delete('/:id', TaskController.delete);
router.put('/:id/:done', TaskController.done);


module.exports = router;