import { Request, Response } from 'express';
import { 
  getCandidatesByPositionController,
  updateCandidateStageController
} from '../presentation/controllers/applicationController';
import { 
  getCandidatesByPositionId,
  updateCandidateStage
} from '../application/services/applicationService';

// Mock de servicios
jest.mock('../application/services/applicationService');

describe('Application Controllers', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  
  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCandidatesByPositionController', () => {
    it('debería devolver una lista de candidatos cuando la posición existe', async () => {
      // Configuración
      const mockCandidates = [
        {
          candidateId: 1,
          fullName: 'Juan Pérez',
          current_interview_step: 'TECHNICAL_INTERVIEW',
          averageScore: 4.2
        },
        {
          candidateId: 2,
          fullName: 'María López',
          current_interview_step: 'HR_INTERVIEW',
          averageScore: 3.8
        }
      ];
      
      mockRequest.params = { id: '1' };
      (getCandidatesByPositionId as jest.Mock).mockResolvedValue(mockCandidates);

      // Ejecución
      await getCandidatesByPositionController(
        mockRequest as Request, 
        mockResponse as Response
      );

      // Verificación
      expect(getCandidatesByPositionId).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCandidates);
    });

    it('debería manejar IDs de posición inválidos', async () => {
      mockRequest.params = { id: 'invalid' };

      await getCandidatesByPositionController(
        mockRequest as Request, 
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'ID de posición inválido',
        error: 'El ID debe ser un número'
      });
    });

    it('debería manejar errores del servicio', async () => {
      mockRequest.params = { id: '1' };
      const errorMessage = 'La posición no existe';
      (getCandidatesByPositionId as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await getCandidatesByPositionController(
        mockRequest as Request, 
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error al obtener candidatos',
        error: errorMessage
      });
    });
  });

  describe('updateCandidateStageController', () => {
    it('debería actualizar la etapa del candidato correctamente', async () => {
      const mockUpdatedApplication = {
        applicationId: 5,
        candidateId: 1,
        positionId: 3,
        current_interview_step: 'FINAL_INTERVIEW',
        updatedAt: new Date().toISOString()
      };
      
      mockRequest.params = { id: '1' };
      mockRequest.body = { current_interview_step: '3' };
      (updateCandidateStage as jest.Mock).mockResolvedValue(mockUpdatedApplication);

      await updateCandidateStageController(
        mockRequest as Request, 
        mockResponse as Response
      );

      expect(updateCandidateStage).toHaveBeenCalledWith(1, 3);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedApplication);
    });

    it('debería manejar IDs de candidato inválidos', async () => {
      mockRequest.params = { id: 'invalid' };
      mockRequest.body = { current_interview_step: '3' };

      await updateCandidateStageController(
        mockRequest as Request, 
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'ID de candidato inválido',
        error: 'El ID debe ser un número'
      });
    });

    it('debería manejar etapas de entrevista inválidas', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { current_interview_step: 'invalid' };

      await updateCandidateStageController(
        mockRequest as Request, 
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Parámetro current_interview_step inválido',
        error: 'Debe proporcionar un ID válido para la etapa de entrevista'
      });
    });

    it('debería manejar errores del servicio', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { current_interview_step: '3' };
      const errorMessage = 'El candidato no existe';
      (updateCandidateStage as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await updateCandidateStageController(
        mockRequest as Request, 
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error al actualizar la etapa del candidato',
        error: errorMessage
      });
    });
  });
}); 