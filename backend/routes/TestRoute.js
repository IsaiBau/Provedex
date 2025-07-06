import express from "express"
import{
    getTests,
    getTestById,
    createTest,
    updateTest,
    deleteTest
} from "../controllers/Test.js"

const router = express.Router();

router.get('/tests', getTests)
router.get('/tests/:id', getTestById)
router.post('/tests', createTest)
router.patch('/tests/:id', updateTest)
router.delete('/tests/:id', deleteTest)

export default router;