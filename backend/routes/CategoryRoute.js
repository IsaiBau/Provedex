import express from "express"
import{
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controllers/Categories.js"

const router = express.Router();

router.get('/categories', getCategories)
router.get('/categories/:uuid', getCategoryById)
router.post('/categories', createCategory)
router.put('/categories/:uuid', updateCategory)
router.delete('/categories/:uuid', deleteCategory)

export default router;