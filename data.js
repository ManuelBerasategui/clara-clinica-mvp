/* Clara · datos de demostración.
   Todo es ficticio. Las reglas de obras sociales son EJEMPLOS para mostrar cómo
   funcionaría el agente: cada clínica las carga según las normas vigentes de su
   círculo o colegio y de cada financiador. */
(function () {
  const clinic = {
    nombre: 'Clínica Dental Centro',
    direccion: 'Av. Pellegrini 1500, Rosario (dirección de ejemplo)',
    telefono: '0341 555-0100 (ejemplo)',
    horarios: 'Lunes a viernes de 8 a 13 y de 14 a 19 · sábados de 9 a 13',
    bloques: { // minutos desde las 00:00, por día de la semana (0 = domingo)
      1: [[480, 780], [840, 1140]], 2: [[480, 780], [840, 1140]], 3: [[480, 780], [840, 1140]],
      4: [[480, 780], [840, 1140]], 5: [[480, 780], [840, 1140]], 6: [[540, 780]]
    }
  };

  const profs = [
    { id: 'mendez', nombre: 'Dra. Lucía Méndez', corto: 'Dra. Méndez', esp: 'General · Estética · Implantes', dias: [1, 2, 3, 4, 5], color: 'teal', ini: 'LM' },
    { id: 'salas', nombre: 'Dr. Nicolás Salas', corto: 'Dr. Salas', esp: 'General · Ortodoncia', dias: [1, 2, 4, 5, 6], color: 'blue', ini: 'NS' },
    { id: 'quiroga', nombre: 'Dra. Ana Quiroga', corto: 'Dra. Quiroga', esp: 'Endodoncia', dias: [2, 4], color: 'amber', ini: 'AQ' }
  ];

  // cod = código de ejemplo, no un código real de nomenclador
  const servicios = [
    { id: 'consulta', nombre: 'Consulta', dur: 30, profs: ['mendez', 'salas', 'quiroga'], cod: 'EJ-0101', precio: 28000 },
    { id: 'control', nombre: 'Control', dur: 30, profs: ['mendez', 'salas', 'quiroga'], cod: 'EJ-0102', precio: 22000 },
    { id: 'limpieza', nombre: 'Limpieza', dur: 30, profs: ['mendez', 'salas'], cod: 'EJ-0501', precio: 42000 },
    { id: 'endodoncia', nombre: 'Endodoncia', dur: 60, profs: ['quiroga'], cod: 'EJ-0301', precio: 180000 },
    { id: 'extraccion', nombre: 'Extracción', dur: 30, profs: ['mendez'], cod: 'EJ-1001', precio: 65000 },
    { id: 'ortodoncia', nombre: 'Control de ortodoncia', dur: 30, profs: ['salas'], cod: 'EJ-0801', precio: 35000 },
    { id: 'blanqueamiento', nombre: 'Blanqueamiento', dur: 60, profs: ['mendez'], cod: '—', precio: 150000 },
    { id: 'implante', nombre: 'Evaluación de implante', dur: 30, profs: ['mendez'], cod: 'EJ-0901', precio: 30000 },
    { id: 'urgencia', nombre: 'Urgencia', dur: 30, profs: ['mendez', 'salas', 'quiroga'], cod: 'EJ-0199', precio: 35000 }
  ];

  /* Reglas por financiador (EJEMPLO). "traer" = qué tiene que llevar el paciente.
     "pre" = qué revisa el agente de facturación antes de presentar. */
  const coberturas = {
    IAPOS: {
      nombre: 'IAPOS', convenio: true, via: 'Círculo / Colegio de Odontólogos',
      general: 'Orden de consulta y bonos. Se pueden sacar en la app Mi IAPOS (pago digital) o en Santa Fe Servicios.',
      traer: {
        consulta: ['1 orden de consulta (digital en la app Mi IAPOS o en papel)', 'DNI'],
        control: ['1 orden de consulta', 'DNI'],
        limpieza: ['1 orden de consulta', '1 bono asistencial', 'DNI'],
        endodoncia: ['1 orden de consulta', 'Bonos asistenciales según la pieza (te los confirma la clínica)', 'Radiografía si tenés una reciente', 'DNI'],
        extraccion: ['1 orden de consulta', '1 bono asistencial', 'DNI'],
        _default: ['1 orden de consulta', 'DNI']
      },
      tip: 'Si sacás la orden o el bono digital en la app Mi IAPOS, pagás menos coseguro y no tenés que ir a buscar papeles.',
      noCubre: ['blanqueamiento']
    },
    OSDE: {
      nombre: 'OSDE', convenio: true, via: 'Directo',
      general: 'Credencial digital. La clínica valida la prestación en línea con el token del afiliado.',
      traer: { _default: ['Credencial digital de OSDE en el celular', 'DNI'], endodoncia: ['Credencial digital de OSDE', 'DNI', 'Radiografía si tenés una reciente'] },
      tip: 'Tené abierta la app de OSDE: puede que la recepción te pida el token.',
      noCubre: ['blanqueamiento']
    },
    'Swiss Medical': {
      nombre: 'Swiss Medical', convenio: true, via: 'Directo',
      general: 'Credencial digital y validación en línea. El coseguro depende del plan.',
      traer: { _default: ['Credencial digital de Swiss Medical', 'DNI'] },
      tip: 'Según tu plan puede haber coseguro: la recepción te lo informa antes de atenderte.',
      noCubre: ['blanqueamiento']
    },
    'Sancor Salud': {
      nombre: 'Sancor Salud', convenio: true, via: 'Directo',
      general: 'Credencial y autorización previa para endodoncias (ejemplo).',
      traer: { _default: ['Credencial de Sancor Salud', 'DNI'], endodoncia: ['Credencial de Sancor Salud', 'DNI', 'Autorización previa (la gestiona la clínica)'] },
      tip: 'Para tratamientos largos, la clínica pide la autorización antes del turno.',
      noCubre: ['blanqueamiento']
    },
    'Jerárquicos': {
      nombre: 'Jerárquicos', convenio: true, via: 'Círculo / Colegio de Odontólogos',
      general: 'Orden y validación en línea.',
      traer: { _default: ['Credencial de Jerárquicos', 'DNI'] },
      tip: '',
      noCubre: ['blanqueamiento']
    },
    Particular: {
      nombre: 'Particular', convenio: true, via: '—',
      general: 'Sin trámites de obra social. Se abona en la clínica (efectivo, transferencia o Mercado Pago).',
      traer: { _default: ['DNI'] }, tip: '', noCubre: []
    }
  };
  const sinConvenio = ['PAMI', 'Galeno', 'OMINT', 'Medifé', 'IOMA', 'OSECAC', 'Avalian', 'Prevención Salud'];

  const patients = [
    { id: 'p1', nombre: 'Camila Torres', tel: '+54 9 341 555-0101', cob: 'Particular', afiliado: '', alergias: 'Penicilina', nac: '1992-03-14' },
    { id: 'p2', nombre: 'Mateo Ríos', tel: '+54 9 341 555-0102', cob: 'OSDE', plan: '310', afiliado: '61 234567 8 01', alergias: '', nac: '1987-07-02' },
    { id: 'p3', nombre: 'Valentina Paz', tel: '+54 9 341 555-0103', cob: 'IAPOS', afiliado: '27-34567890-1', alergias: '', nac: '1995-11-21' },
    { id: 'p4', nombre: 'Tomás Acosta', tel: '+54 9 341 555-0104', cob: 'Swiss Medical', plan: 'SMG20', afiliado: '80 0012 3456', alergias: '', nac: '1979-01-30' },
    { id: 'p5', nombre: 'Sofía Luna', tel: '+54 9 341 555-0105', cob: 'Particular', afiliado: '', alergias: '', nac: '2008-05-09' },
    { id: 'p6', nombre: 'Julia Fernández', tel: '+54 9 341 555-0106', cob: 'OSDE', plan: '210', afiliado: '61 998877 2 02', alergias: 'Látex', nac: '1990-09-17' },
    { id: 'p7', nombre: 'Pedro Medina', tel: '+54 9 341 555-0107', cob: 'IAPOS', afiliado: '20-28765432-9', alergias: '', nac: '1968-12-04' },
    { id: 'p8', nombre: 'Clara Díaz', tel: '+54 9 341 555-0108', cob: 'Sancor Salud', afiliado: '1100 4455 66', alergias: '', nac: '1983-04-25' },
    { id: 'p9', nombre: 'Lucas Benítez', tel: '+54 9 341 555-0109', cob: 'IAPOS', afiliado: '20-40111222-3', alergias: '', nac: '1999-08-12' },
    { id: 'p10', nombre: 'Martina Gómez', tel: '+54 9 341 555-0110', cob: 'Jerárquicos', afiliado: 'J-552211', alergias: '', nac: '1975-02-18' }
  ];

  // Quiénes puede "ser" quien prueba el WhatsApp
  const personas = [
    { id: 'nuevo', label: 'Paciente nuevo', sub: 'No está cargado en la clínica', tel: '+54 9 341 555-0199', patientId: null },
    { id: 'p3', label: 'Valentina Paz', sub: 'Paciente · IAPOS', tel: '+54 9 341 555-0103', patientId: 'p3' },
    { id: 'p2', label: 'Mateo Ríos', sub: 'Paciente · OSDE 310', tel: '+54 9 341 555-0102', patientId: 'p2' }
  ];

  window.CLARA_DATA = { clinic, profs, servicios, coberturas, sinConvenio, patients, personas };
})();
