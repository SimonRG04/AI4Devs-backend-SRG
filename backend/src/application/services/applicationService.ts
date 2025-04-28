import { PrismaClient } from '@prisma/client';
import { Application } from '../../domain/models/Application';

const prisma = new PrismaClient();

/**
 * Obtiene todos los candidatos de una posición específica con sus puntuaciones medias
 * @param positionId - ID de la posición
 * @returns Lista de candidatos con sus datos y puntuación media
 */
export const getCandidatesByPositionId = async (positionId: number) => {
  try {
    // Validar que la posición existe
    const position = await prisma.position.findUnique({
      where: { id: positionId }
    });

    if (!position) {
      throw new Error(`La posición con ID ${positionId} no existe`);
    }

    // Obtener todas las aplicaciones para esta posición con candidatos y entrevistas
    const applications = await prisma.application.findMany({
      where: { positionId },
      include: {
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        interviewStep: {
          select: {
            name: true
          }
        },
        interviews: {
          select: {
            score: true
          }
        }
      }
    });

    // Transformar los datos para el formato de respuesta esperado
    return applications.map((app: any) => {
      // Calcular la puntuación media si hay entrevistas con puntuaciones
      let averageScore = null;
      const scores = app.interviews
        .filter((interview: any) => interview.score !== null)
        .map((interview: any) => interview.score!);
      
      if (scores.length > 0) {
        averageScore = parseFloat((scores.reduce((a: number, b: number) => a + b, 0) / scores.length).toFixed(1));
      }

      return {
        candidateId: app.candidate.id,
        fullName: `${app.candidate.firstName} ${app.candidate.lastName}`,
        current_interview_step: app.interviewStep.name,
        averageScore
      };
    });
  } catch (error) {
    console.error('Error al obtener candidatos por posición:', error);
    throw error;
  }
};

/**
 * Actualiza la etapa de entrevista de un candidato
 * @param candidateId - ID del candidato
 * @param currentInterviewStep - ID de la nueva etapa de entrevista
 * @returns La aplicación actualizada
 */
export const updateCandidateStage = async (candidateId: number, currentInterviewStep: number) => {
  try {
    // Validar que el candidato existe
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId }
    });

    if (!candidate) {
      throw new Error(`El candidato con ID ${candidateId} no existe`);
    }

    // Validar que la etapa de entrevista existe
    const interviewStep = await prisma.interviewStep.findUnique({
      where: { id: currentInterviewStep }
    });

    if (!interviewStep) {
      throw new Error(`La etapa de entrevista con ID ${currentInterviewStep} no existe`);
    }

    // Buscar la aplicación del candidato (asumimos que hay solo una aplicación activa por candidato)
    const application = await prisma.application.findFirst({
      where: { candidateId }
    });

    if (!application) {
      throw new Error(`No se encontró ninguna aplicación para el candidato con ID ${candidateId}`);
    }

    // Actualizar la etapa de entrevista
    const updatedApplication = await prisma.application.update({
      where: { id: application.id },
      data: { 
        currentInterviewStep,
        // Actualizar la fecha de modificación
        updatedAt: new Date()
      },
      include: {
        position: true,
        interviewStep: true
      }
    });

    return {
      applicationId: updatedApplication.id,
      candidateId,
      positionId: updatedApplication.positionId,
      current_interview_step: updatedApplication.interviewStep.name,
      updatedAt: updatedApplication.updatedAt
    };
  } catch (error) {
    console.error('Error al actualizar la etapa del candidato:', error);
    throw error;
  }
}; 