import { Router } from 'express';
import { 
  getCandidatesByPositionController,
  updateCandidateStageController
} from '../presentation/controllers/applicationController';

const router = Router();

// Endpoint para obtener candidatos por posición
router.get('/positions/:id/candidates', getCandidatesByPositionController);

// Endpoint para actualizar la etapa de un candidato
router.put('/candidates/:id/stage', updateCandidateStageController);

export default router; 