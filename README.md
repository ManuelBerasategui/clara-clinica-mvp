# Clara · clínica dental (prototipo)

Es un prototipo navegable de una clínica dental con agentes de IA. Sirve para mostrárselo a clínicas, sobre todo desde el celular. Todos los datos son ficticios. No se conecta a WhatsApp, a obras sociales ni a ARCA. Los agentes están **simulados** con reglas en el navegador.

**Ver online:** https://manuelberasategui.github.io/clara-clinica-mvp/

## Qué se puede probar

- **WhatsApp del paciente en vivo.** Tocá el botón verde "Probar".
  - Escribí como paciente, por ejemplo: "quiero un turno mañana a la tarde", "¿qué turnos tiene la Dra. Quiroga el jueves?", "tengo IAPOS, ¿qué llevo para una limpieza?", "cancelar", "me duele una muela" o "quiero hablar con una persona".
  - El turno aparece en la agenda al instante. En la compu, el teléfono queda al costado del panel.
  - Arriba del teléfono podés elegir quién escribe: un paciente nuevo o uno ya cargado.
- **Bandeja de WhatsApp de la clínica.** Muestra qué agente respondió cada mensaje. Recepción puede tomar la conversación y devolvérsela a Clara.
- **Agenda.** En el celular es una lista por día. En la compu es una grilla por profesional, con vista de semana.
- **Obras sociales.**
  - Revisión con IA antes de presentar: faltan firmas, bonos, radiografías o autorizaciones, o se supera la frecuencia.
  - Débitos ordenados por motivo, con el borrador del reclamo.
- **Recordatorios.** Se envían desde "Hoy". Algunos pacientes confirman solos y otro pide cambiar el turno.
- **Historia clínica.** Resumen previo al turno y evolución dictada, que queda como borrador hasta que la firma el profesional.

## Archivos

| Archivo | Qué tiene |
|---|---|
| `index.html` | Estructura de la página |
| `styles.css` | Estilos; primero celular, después escritorio desde 900 px |
| `data.js` | Clínica, profesionales, prestaciones, pacientes y **reglas de obras sociales de ejemplo** |
| `agent.js` | Motor de conversación simulado: entiende el mensaje, busca horarios, agenda y deriva |
| `app.js` | Estado, pantallas, simulador y agentes que se disparan desde el panel |

Los cambios que hace quien prueba la demo se guardan en su navegador (localStorage) y se reinician cada día. También se pueden reiniciar desde Configuración.

## Cómo pasarlo a real (resumen)

1. Reemplazar `agent.js` por un servidor que reciba los mensajes de la **API oficial de WhatsApp (Meta)** y llame a Claude. Claude usaría las mismas "herramientas" que usa la simulación: buscar horarios, crear, cancelar o mover turnos, consultar reglas de cobertura y derivar a una persona.
2. Guardar los datos de cada clínica por separado, por ejemplo en Supabase.
3. Cargar las normas reales de 3 a 5 obras sociales por clínica.
4. Revisión legal: datos de salud (Ley 25.326), registro ante la AAIP y contrato de tratamiento de datos con cada clínica.

## Cómo colaborar

1. Creá una rama, hacé los cambios y abrí un Pull Request.
2. GitHub Pages publica solo cuando se actualiza `main`.

No agregues datos reales de pacientes, claves, certificados ni credenciales al repositorio.
