import express from "express"
import{
    deleteProductSupplier,
    updateProductSupplier,
} from "../controllers/ProductSupplier.js"

const router = express.Router();

router.patch('/products-supplier/:uuid/stock', updateProductSupplier)
router.delete('/products-supplier/:uuid', deleteProductSupplier)

export default router;