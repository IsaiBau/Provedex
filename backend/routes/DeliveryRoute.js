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
router.get('/deliveries/:id', getDeliveryById)
router.post('/deliveries', createDelivery)
router.patch('/deliveries/:id', updateDelivery)
router.delete('/deliveries/:id', deleteDelivery)

export default router;