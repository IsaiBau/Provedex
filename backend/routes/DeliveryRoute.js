import express from "express"
import{
    getDeliveries,
    getDeliveryById,
    createDelivery,
    updateDelivery,
    deleteDelivery,
    updateDeliveryStatus
} from "../controllers/Delivery.js"

const router = express.Router();

router.get('/deliveries', getDeliveries)
router.get('/deliveries/:uuid', getDeliveryById)
router.post('/deliveries', createDelivery)
router.put('/deliveries/:uuid', updateDelivery)
router.patch('/deliveries/:uuid/status', updateDeliveryStatus)
router.delete('/deliveries/:uuid', deleteDelivery)

export default router;