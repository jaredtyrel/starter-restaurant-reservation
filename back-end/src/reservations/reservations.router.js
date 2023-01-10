const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed")

// edit specific reservation ID
router.route("/:reservation_id/edit")
    .get(controller.read)
    .put(controller.update)
    .all(methodNotAllowed);

// status for a specific reservation ID
router.route("/:reservation_id/status")
    .get(controller.read)
    .put(controller.updateStatus)
    .all(methodNotAllowed)

// specific reservation ID
router.route("/:reservation_id")
    .get(controller.read)
    .put(controller.update)
    .all(methodNotAllowed)

// reservations route
router.route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed)
    
module.exports = router;