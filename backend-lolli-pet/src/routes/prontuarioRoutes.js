import { Router } from 'express'
import prontuarioController from '../controllers/ProntuarioController.js'
import loginRequired from '../middlewares/loginRequired.js'

const router = new Router()

// Permite desabilitar checagem de auth em dev definindo DISABLE_AUTH=true no .env
const authMiddleware = process.env.DISABLE_AUTH === 'true' ? (req, res, next) => next() : loginRequired

// Rotas específicas de prontuário (devem vir antes das rotas com :id)
router.put('/:id', authMiddleware, prontuarioController.update)
router.delete('/:id', authMiddleware, prontuarioController.delete)

// Rotas de pet (devem vir depois para não conflitar)
router.get('/:petId', authMiddleware, prontuarioController.index)
router.post('/:petId', authMiddleware, prontuarioController.store)

export default router
