import express from "express"
import{
    getDeliveries,
    getDeliveryById,
    createDelivery,
    updateDelivery,
    deleteDelivery
} from "../controllers/Delivery.js"

const router = express.Router();

router.get('/deliveries', getDeliveries)
router.get('/deliveries/:uuid', getDeliveryById)
router.post('/deliveries', createDelivery)
router.patch('/deliveries/:uuid', updateDelivery)
router.delete('/deliveries/:uuid', deleteDelivery)

export default router;