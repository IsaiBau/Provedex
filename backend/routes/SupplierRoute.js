import express from "express"
import{
    getSuppliers,
} from "../controllers/Supplier.js"

const router = express.Router();

router.get('/suppliers', getSuppliers)
//router.get('/suppliers/:id', getUserById)
//router.post('/suppliers', createUser)
//router.patch('/suppliers/:id', updateUser)
//router.delete('/suppliers/:id', deleteUser)

export default router;