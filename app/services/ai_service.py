import json
import os

from openai import OpenAI


class AIServiceError(Exception):
    """Error controlado del servicio de inteligencia artificial."""


def _get_client() -> OpenAI:
    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        raise AIServiceError(
            "OPENAI_API_KEY no está configurada."
        )

    return OpenAI(api_key=api_key)


def analyze_ticket(
    title: str,
    description: str,
    priority: str = "medium",
) -> dict:
    """
    Analiza un ticket y devuelve información estructurada
    para un sistema profesional de soporte.
    """

    client = _get_client()

    prompt = f"""
Eres un sistema profesional de clasificación y asistencia
para tickets de soporte al cliente.

Analiza este ticket:

Título:
{title}

Descripción:
{description}

Prioridad indicada:
{priority}

Devuelve ÚNICAMENTE JSON válido con esta estructura exacta:

{{
    "category": "string",
    "urgency": "low | medium | high | critical",
    "summary": "string",
    "sentiment": "positive | neutral | frustrated | angry",
    "suggested_response": "string"
}}

Reglas:

- category debe ser una categoría breve en inglés.
  Ejemplos:
  account_access
  billing
  technical_issue
  password_reset
  bug
  feature_request
  general_question
  other

- urgency debe reflejar la urgencia real del problema.

- summary debe resumir el problema en una sola oración.

- sentiment debe representar el tono aparente del cliente.

- suggested_response debe ser una respuesta útil,
  profesional y clara para enviar al cliente.

- Responde suggested_response en el mismo idioma
  utilizado por el cliente.

- No inventes datos.

- No menciones que eres una inteligencia artificial.

- No incluyas texto fuera del JSON.
"""

    try:
        response = client.responses.create(
            model="gpt-5.6-luna",
            input=prompt,
        )

        raw_output = response.output_text.strip()

        if not raw_output:
            raise AIServiceError(
                "La IA devolvió una respuesta vacía."
            )

        # Limpiar posibles bloques ```json
        if raw_output.startswith("```"):
            raw_output = raw_output.replace("```json", "")
            raw_output = raw_output.replace("```", "")
            raw_output = raw_output.strip()

        try:
            result = json.loads(raw_output)

        except json.JSONDecodeError as exc:
            raise AIServiceError(
                "La IA devolvió un formato JSON inválido."
            ) from exc

        required_fields = {
            "category",
            "urgency",
            "summary",
            "sentiment",
            "suggested_response",
        }

        if not required_fields.issubset(result.keys()):
            raise AIServiceError(
                "La respuesta de IA no contiene todos los campos requeridos."
            )

        return result

    except AIServiceError:
        raise

    except Exception as exc:
        raise AIServiceError(
            f"No se pudo analizar el ticket con IA: {exc}"
        ) from exc


def generate_ticket_response(
    title: str,
    description: str,
    priority: str = "medium",
) -> str:
    """
    Compatibilidad con el endpoint anterior.
    Devuelve solamente la respuesta sugerida.
    """

    analysis = analyze_ticket(
        title=title,
        description=description,
        priority=priority,
    )

    return analysis["suggested_response"]