import express from "express"
import{
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    updateProductStock,
    deleteProduct
} from "../controllers/Products.js"

const router = express.Router();

router.get('/products', getProducts)
router.get('/products/:uuid', getProductById)
router.post('/products', createProduct)
router.put('/products/:uuid', updateProduct)
router.patch('/products/:uuid/stock', updateProductStock)
router.delete('/products/:uuid', deleteProduct)

export default router;