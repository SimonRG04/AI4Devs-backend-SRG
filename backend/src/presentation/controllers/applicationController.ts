import { Request, Response } from 'express';
import { getCandidatesByPositionId, updateCandidateStage } from '../../application/services/applicationService';

/**
 * Obtiene todos los candidatos para una posición específica
 */
export const getCandidatesByPositionController = async (req: Request, res: Response) => {
  try {
    const positionId = parseInt(req.params.id, 10);
    
    if (isNaN(positionId)) {
      return res.status(400).json({ 
        message: 'ID de posición inválido',
        error: 'El ID debe ser un número' 
      });
    }
    
    const candidates = await getCandidatesByPositionId(positionId);
    res.status(200).json(candidates);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ 
        message: 'Error al obtener candidatos',
        error: error.message 
      });
    } else {
      res.status(500).json({ 
        message: 'Error inesperado al obtener candidatos',
        error: 'Error desconocido' 
      });
    }
  }
};

/**
 * Actualiza la etapa de entrevista de un candidato
 */
export const updateCandidateStageController = async (req: Request, res: Response) => {
  try {
    const candidateId = parseInt(req.params.id, 10);
    const { current_interview_step } = req.body;
    
    if (isNaN(candidateId)) {
      return res.status(400).json({ 
        message: 'ID de candidato inválido',
        error: 'El ID debe ser un número' 
      });
    }
    
    if (!current_interview_step || isNaN(parseInt(current_interview_step, 10))) {
      return res.status(400).json({ 
        message: 'Parámetro current_interview_step inválido',
        error: 'Debe proporcionar un ID válido para la etapa de entrevista' 
      });
    }
    
    const updatedApplication = await updateCandidateStage(
      candidateId, 
      parseInt(current_interview_step, 10)
    );
    
    res.status(200).json(updatedApplication);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ 
        message: 'Error al actualizar la etapa del candidato',
        error: error.message 
      });
    } else {
      res.status(500).json({ 
        message: 'Error inesperado al actualizar la etapa del candidato',
        error: 'Error desconocido' 
      });
    }
  }
}; 