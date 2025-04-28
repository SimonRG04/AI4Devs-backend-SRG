# Prompt #1 para Claude 3.7 utilizando modo Thinking y Agent

Como experto en prompt engineering, buenas practicas de prompting y como experto en backend. Utilizando el contexto que hay en el @README.md, construye un prompt en @prompts-SRG.md con las siguientes instrucciones: "Tu misión en este ejercicio es crear dos nuevos endpoints que nos permitirán manipular la lista de candidatos de una aplicación en una interfaz tipo kanban.

GET /positions/:id/candidates
Este endpoint recogerá todos los candidatos en proceso para una determinada posición, es decir, todas las aplicaciones para un determinado positionID. Debe proporcionar la siguiente información básica:

Nombre completo del candidato (de la tabla candidate).
current_interview_step: en qué fase del proceso está el candidato (de la tabla application).
La puntuación media del candidato. Recuerda que cada entrevist (interview) realizada por el candidato tiene un score
PUT /candidates/:id/stage
Este endpoint actualizará la etapa del candidato movido. Permite modificar la fase actual del proceso de entrevista en la que se encuentra un candidato específico."

# Prompt #2 para la Implementación de Endpoints de Kanban para Candidatos. Utilizando Claude 3.7 modo Thinking y Agent

## Contexto
Estás trabajando en un Sistema de Seguimiento de Talento que utiliza Node.js con Express en el backend y Prisma como ORM. El sistema actual permite gestionar candidatos y sus procesos de entrevista, pero necesitamos extenderlo para ofrecer una funcionalidad de tablero kanban.

## Objetivo
Tu misión es implementar dos nuevos endpoints que permitirán manipular la lista de candidatos en una interfaz tipo kanban:

### 1. GET /positions/:id/candidates
Este endpoint debe recuperar todos los candidatos en proceso para una posición específica (todas las aplicaciones para un determinado positionID).

**Requisitos:**
- Debes obtener todas las aplicaciones asociadas al ID de posición proporcionado
- Para cada aplicación, devolver:
  - Nombre completo del candidato (de la tabla `candidate`)
  - `current_interview_step`: fase actual del proceso del candidato (de la tabla `application`)
  - Puntuación media del candidato (calculada a partir de los `score` de todas sus entrevistas)

**Consideraciones de implementación:**
- Utiliza Prisma para las consultas a la base de datos
- Sigue la arquitectura del proyecto (application, domain, infrastructure, presentation)
- Implementa las validaciones necesarias para el parámetro `id`
- Maneja correctamente los casos donde no existan candidatos para una posición

### 2. PUT /candidates/:id/stage
Este endpoint debe actualizar la etapa (fase del proceso de entrevista) en la que se encuentra un candidato específico.

**Requisitos:**
- Recibir el ID del candidato en la URL
- Recibir en el cuerpo de la petición la nueva etapa (`current_interview_step`)
- Actualizar la información en la tabla `application` correspondiente

**Consideraciones de implementación:**
- Validar que el candidato exista
- Validar que la nueva etapa sea válida según el dominio de la aplicación
- Devolver el recurso actualizado en la respuesta
- Implementar el manejo adecuado de errores

## Instrucciones para la implementación
1. Analiza el modelo de datos existente a través del esquema de Prisma
2. Crea los controladores necesarios en la capa de presentación
3. Implementa la lógica de negocio en la capa de dominio
4. Configura las rutas en el directorio de rutas
5. Asegúrate de que la implementación siga las convenciones del proyecto
6. Implementa tests para verificar el funcionamiento correcto

## Ejemplos de respuestas esperadas

### Para GET /positions/:id/candidates
```json
[
  {
    "candidateId": 1,
    "fullName": "Juan Pérez",
    "current_interview_step": "TECHNICAL_INTERVIEW",
    "averageScore": 4.2
  },
  {
    "candidateId": 2,
    "fullName": "María López",
    "current_interview_step": "HR_INTERVIEW",
    "averageScore": 3.8
  }
]
```

### Para PUT /candidates/:id/stage
**Request:**
```json
{
  "current_interview_step": "FINAL_INTERVIEW"
}
```

**Response:**
```json
{
  "applicationId": 5,
  "candidateId": 1,
  "positionId": 3,
  "current_interview_step": "FINAL_INTERVIEW",
  "updatedAt": "2023-09-15T14:30:45.000Z"
}
```

- Para este ejercicio decidí explorar más a fondo el modo Thinking, que habitualmente reservo solo para meta prompting, ya que en ocasiones percibo que al utilizarlo para tareas específicas puede generar resultados inesperados (Alucina mucho 🤯). Por ejemplo, en este caso, aunque no lo solicité explícitamente, Claude elaboró pruebas unitarias para el código. Si bien aprecio este nivel de detalle, reconozco que dependiendo del contexto y objetivos específicos, estas adiciones podrían resultar innecesarias y no aportar valor significativo a la tarea principal.