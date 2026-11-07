/* Clara · motor de agentes SIMULADO.
   Corre todo en el navegador con reglas simples (no hay IA real ni WhatsApp real).
   Sirve para mostrar el flujo: el paciente escribe, "Recepción" agenda, "Coberturas"
   le dice qué traer, y el panel de la clínica se actualiza en vivo.
   Para pasar a producción, esta capa se reemplaza por un servidor que reciba los
   mensajes de la API oficial de WhatsApp y llame a Claude con estas mismas
   herramientas (buscar horarios, crear turno, consultar reglas, derivar a persona). */
(function () {
  const D = window.CLARA_DATA;
  const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const DIAS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

  /* ---------- Interpretación del mensaje ---------- */
  function parseServicio(s) {
    const map = [
      ['endodoncia', /endodon|conducto|nervio/], ['limpieza', /limpieza|sarro|tartrect|higiene/],
      ['extraccion', /extrac|sacar (una|la|el) (muela|diente)|sacarme/], ['ortodoncia', /ortodon|brackets|aparato|frenillos/],
      ['blanqueamiento', /blanque/], ['implante', /implante/], ['control', /\bcontrol\b|revision|chequeo/],
      ['consulta', /consulta|primera vez|evaluacion|revisar/]
    ];
    for (const [id, re] of map) if (re.test(s)) return id;
    return null;
  }
  function parseProf(s) {
    if (/mendez|lucia/.test(s)) return 'mendez';
    if (/salas|nicolas/.test(s)) return 'salas';
    if (/quiroga|\bana\b/.test(s)) return 'quiroga';
    return null;
  }
  function parseDay(s, api) {
    const base = api.today();
    let t = s.replace(/(a|por|de) la manana/g, ' ').replace(/temprano/g, ' ');
    if (/pasado manana/.test(t)) return api.addDays(base, 2);
    if (/\bhoy\b/.test(t)) return base;
    if (/\bmanana\b/.test(t)) return api.addDays(base, 1);
    for (let i = 0; i < 7; i++) {
      if (new RegExp('\\b' + DIAS[i] + '\\b').test(t)) {
        const d = new Date(base); const diff = (i - d.getDay() + 7) % 7;
        return api.addDays(base, diff);
      }
    }
    let m = t.match(/\b(\d{1,2})\/(\d{1,2})\b/);
    if (m) { const d = new Date(base.getFullYear(), +m[2] - 1, +m[1]); if (d < base) d.setFullYear(d.getFullYear() + 1); return d; }
    m = t.match(/\bel (\d{1,2})\b(?!\s*(hs|h|:))/);
    if (m && +m[1] >= 1 && +m[1] <= 31) {
      const d = new Date(base.getFullYear(), base.getMonth(), +m[1]);
      if (d < base) d.setMonth(d.getMonth() + 1);
      return d;
    }
    return null;
  }
  function parseTime(s) {
    let m = s.match(/\b(\d{1,2})[:.](\d{2})\b/);
    if (!m) m = s.match(/\b(?:a las|las|tipo|a eso de)\s+(\d{1,2})(?:\s*y\s*(media|cuarto))?/);
    if (!m) m = s.match(/\b(\d{1,2})\s*(?:hs|h|horas)\b/);
    if (m) {
      let h = +m[1]; let min = 0;
      if (m[2] === 'media') min = 30; else if (m[2] === 'cuarto') min = 15; else if (m[2] && /^\d+$/.test(m[2])) min = +m[2];
      if (h >= 1 && h <= 7) h += 12; // "a las 5" = 17 h
      if (h >= 7 && h <= 21) return { exact: h * 60 + min };
    }
    if (/(a|por|de) la manana|temprano/.test(s)) return { pref: 'manana' };
    if (/(a|por|de) la tarde|despues del mediodia/.test(s)) return { pref: 'tarde' };
    return null;
  }
  function parseCobertura(s) {
    const all = Object.keys(D.coberturas).filter(k => k !== 'Particular').concat(D.sinConvenio);
    for (const k of all) {
      const key = norm(k).split(' ')[0];
      if (s.includes(key)) return k;
    }
    if (/particular|no tengo|sin obra|ninguna|no uso/.test(s)) return 'Particular';
    return null;
  }
  function parseChoice(s, options) {
    if (!options || !options.length) return null;
    const ord = [/\b(1|uno|primer[oa]?)\b/, /\b(2|dos|segund[oa])\b/, /\b(3|tres|tercer[oa]?)\b/, /\b(4|cuatro|cuart[oa])\b/, /\b(5|cinco|quint[oa])\b/, /\b(6|seis|sext[oa])\b/];
    const tm = parseTime(s);
    if (tm && tm.exact != null) {
      const hit = options.findIndex(o => o.start === tm.exact);
      if (hit >= 0) return options[hit];
    }
    if (/^\s*\d\s*$/.test(s) || /\b(la|el|opcion|numero)\b/.test(s) || s.trim().split(/\s+/).length <= 2) {
      for (let i = 0; i < Math.min(options.length, ord.length); i++) if (ord[i].test(s)) return options[i];
    }
    if (options.length === 1 && isYes(s)) return options[0];
    return null;
  }
  const isYes = s => /^(si|sí|dale|ok|okey|perfecto|listo|de una|bueno|confirmo|joya|genial|va|claro|ese|esa|me sirve)\b/.test(s.trim()) || /\b(si,? por favor|me sirve|confirmo)\b/.test(s);
  const isNo = s => /^(no|nop|mejor no|ninguno|ninguna|otro|otra)\b/.test(s.trim());

  /* ---------- Utilidades de respuesta ---------- */
  function slotLabel(api, o) {
    return `${api.dayLabel(o.date)} ${api.hhmm(o.start)} · ${api.prof(o.prof).corto}`;
  }
  function optionsText(api, opts) {
    return opts.map((o, i) => `${i + 1}) ${slotLabel(api, o)}`).join('\n');
  }
  function traerPara(cob, servicio) {
    const c = D.coberturas[cob];
    if (!c) return ['DNI'];
    return (c.traer[servicio] || c.traer._default || ['DNI']).slice();
  }
  function firstName(n) { return (n || '').split(' ')[0]; }
  function titleCase(s) { return s.toLowerCase().replace(/(^|\s)\S/g, x => x.toUpperCase()); }

  /* ---------- Motor de conversación ---------- */
  function reply(conv, text, api) {
    const s = norm(text);
    const ctx = conv.ctx || (conv.ctx = {});
    const out = []; // [{agent, text}]
    const say = (t, agent = 'recepcion') => out.push({ agent, text: t });
    const patient = conv.patientId ? api.patient(conv.patientId) : null;
    const nombre = patient ? firstName(patient.nombre) : (ctx.nombre ? firstName(ctx.nombre) : '');

    // 0) Si una persona tomó la conversación, el agente no responde
    if (conv.mode === 'human') return out;

    // 1) Urgencia o dolor: se avisa a la clínica y se ofrece el primer turno de urgencia
    if (/dolor|me duele|urgen|sangr|hinch|inflam|absceso|flemon|se me rompio|accidente|golpe/.test(s)) {
      api.flag(conv, 'Urgencia: ' + text.slice(0, 80));
      api.log('recepcion', `Detectó una posible urgencia de ${patient ? patient.nombre : 'un paciente nuevo'} y avisó a recepción`, 'warn');
      const opts = api.findSlots({ servicio: 'urgencia', limit: 2, soon: true });
      ctx.flow = 'book'; ctx.servicio = 'urgencia'; ctx.options = opts; ctx.step = 'pick';
      say(`Lamento que estés con molestias${nombre ? ', ' + nombre : ''}. Ya le avisé al equipo para que te miren con prioridad. No puedo darte indicaciones médicas, pero si tenés fiebre, mucha hinchazón o sangrado que no para, andá a una guardia.`);
      if (opts.length) say(`Te puedo reservar ahora el primer turno de urgencia:\n${optionsText(api, opts)}\n¿Tomo alguno? Respondé con el número.`);
      return out;
    }

    // 2) Pide hablar con una persona
    if (/persona|humano|secretari|recepcionista|hablar con alguien|operador/.test(s)) {
      conv.mode = 'human';
      api.flag(conv, 'Pidió hablar con una persona');
      api.log('recepcion', `Derivó la conversación con ${patient ? patient.nombre : 'un paciente nuevo'} a recepción`, 'warn');
      say('¡Claro! Ya le pasé la conversación a una persona de recepción. Te responden por acá en un ratito.');
      return out;
    }

    // 3) Si estamos esperando un dato, intentamos completarlo
    if (ctx.step) {
      const handled = continueFlow(conv, text, s, api, say);
      if (handled) return out;
    }

    // 4) Intenciones
    const servicio = parseServicio(s);
    const prof = parseProf(s);
    const day = parseDay(s, api);
    const time = parseTime(s);
    const cob = parseCobertura(s);

    if (/cancel|anular|no voy a poder ir|no puedo ir/.test(s)) return startCancel(conv, api, say), out;
    if (/reprogram|cambiar (el|mi) turno|mover (el|mi) turno|pasar (el|mi) turno|otro dia/.test(s)) return startReschedule(conv, api, say, { day, time, prof }), out;
    if (/\bconfirmo\b|^si,? (voy|asisto)|confirmar (el|mi) turno/.test(s)) return doConfirm(conv, api, say), out;

    const wantsBooking = /turno|reserv|agend|sacar|pedir|disponib|lugar|horario(s)? (libre|disponible)|tiene(n)? (algo|lugar)|atiende/.test(s) || ((day || time || prof) && !cob);
    const asksCoverage = cob || /obra social|prepaga|cobertura|cubre|que (tengo que )?llev|que necesito|bono|orden|credencial|coseguro/.test(s);

    if (asksCoverage && !wantsBooking) return coverageAnswer(conv, api, say, cob, servicio), out;

    if (wantsBooking || servicio) {
      ctx.flow = 'book';
      if (servicio) ctx.servicio = servicio;
      if (prof) ctx.prof = prof;
      ctx.day = day ? api.key(day) : null;
      ctx.time = time;
      if (cob) ctx.cob = cob;
      ctx.listMode = /disponib|que (turnos|horarios)|tiene(n)? (lugar|algo)|libres/.test(s);
      offerSlots(conv, api, say);
      return out;
    }

    if (/direccion|donde (estan|queda|quedan)|ubicacion|como llego/.test(s)) { say(`Estamos en ${D.clinic.direccion}. 📍`); return out; }
    if (/horario|a que hora (abren|cierran)|atienden/.test(s)) { say(`Atendemos ${D.clinic.horarios}.`); return out; }
    if (/precio|cuanto (sale|cuesta|esta)|valor|costo|arancel/.test(s)) {
      const sv = api.servicio(servicio || 'consulta');
      say(`El valor particular de ${sv.nombre.toLowerCase()} es de $ ${sv.precio.toLocaleString('es-AR')} (valor de ejemplo). Los tratamientos se presupuestan después de la evaluación. Con obra social te digo qué cubre si me contás cuál tenés.`);
      return out;
    }
    if (/gracias|genial|buenisimo|perfecto/.test(s)) { say(`¡De nada${nombre ? ', ' + nombre : ''}! Cualquier cosa escribime por acá. 😊`); return out; }
    if (/^(hola|buen(as|os)|que tal|hey)/.test(s)) {
      say(`¡Hola${nombre ? ' ' + nombre : ''}! Soy Clara, la asistente virtual de ${D.clinic.nombre} (soy una inteligencia artificial). Puedo:\n• Darte un turno o decirte qué horarios hay\n• Cancelar o reprogramar tu turno\n• Decirte qué tenés que llevar según tu obra social\n¿En qué te ayudo?`);
      return out;
    }
    say('No estoy segura de haber entendido. Puedo darte un turno, decirte qué horarios hay, cancelar o reprogramar, o decirte qué llevar según tu obra social. Si preferís, escribí "persona" y te atiende alguien de recepción.');
    return out;
  }

  function offerSlots(conv, api, say) {
    const ctx = conv.ctx;
    const sv = api.servicio(ctx.servicio || 'consulta');
    if (ctx.prof && !sv.profs.includes(ctx.prof)) {
      say(`${api.prof(ctx.prof).nombre} no hace ${sv.nombre.toLowerCase()}. Te busco con quien sí lo hace.`);
      ctx.prof = null;
    }
    const q = { servicio: sv.id, prof: ctx.prof, day: ctx.day, time: ctx.time, limit: ctx.listMode || ctx.day ? 5 : 3, exclude: ctx.targetAppt };
    let opts = api.findSlots(q);
    let intro = '';
    if (!opts.length && ctx.day) {
      const closed = api.isClosed(ctx.day);
      intro = closed ? `El ${api.dayLabel(ctx.day)} la clínica está cerrada${ctx.prof ? '' : ''}. Lo más cercano que tengo:\n` : `Para el ${api.dayLabel(ctx.day)} no me quedan horarios${ctx.prof ? ' con ' + api.prof(ctx.prof).corto : ''}. Lo más cercano que tengo:\n`;
      if (!closed && ctx.prof && !api.profWorks(ctx.prof, ctx.day)) intro = `${api.prof(ctx.prof).nombre} no atiende el ${api.dayLabel(ctx.day)}. Sus próximos horarios:\n`;
      opts = api.findSlots(Object.assign({}, q, { day: null, from: ctx.day, limit: 3 }));
    }
    if (!opts.length) { say('Uy, no encuentro horarios libres en las próximas dos semanas. Le aviso a recepción para que te contacte.'); api.flag(conv, 'Sin disponibilidad para ' + sv.nombre); ctx.step = null; return; }
    ctx.options = opts; ctx.step = 'pick';
    const exact = ctx.time && ctx.time.exact != null && opts[0].start === ctx.time.exact;
    if (exact && opts.length) {
      ctx.options = [opts[0]];
      say(`${intro}Tengo libre ${slotLabel(api, opts[0])} para ${sv.nombre.toLowerCase()}. ¿Te lo reservo?`);
      return;
    }
    say(`${intro}${intro ? '' : `Para ${sv.nombre.toLowerCase()} tengo estos horarios:\n`}${optionsText(api, opts)}\n\nRespondé con el número. Si preferís otro día, decime cuál.`);
  }

  function continueFlow(conv, text, s, api, say) {
    const ctx = conv.ctx;
    const patient = conv.patientId ? api.patient(conv.patientId) : null;

    if (ctx.step === 'pick') {
      const choice = parseChoice(s, ctx.options);
      if (choice) { ctx.slot = choice; ctx.options = null; return nextBookingStep(conv, api, say); }
      if (isNo(s) || parseDay(s, api) || parseTime(s) || parseProf(s)) {
        const d = parseDay(s, api); const t = parseTime(s); const p = parseProf(s);
        if (d) ctx.day = api.key(d); if (t) ctx.time = t; if (p) ctx.prof = p;
        if (!d && !t && !p) { say('Dale. ¿Qué día u horario te queda mejor? Por ejemplo: "el jueves a la tarde".'); return true; }
        offerSlots(conv, api, say); return true;
      }
      return false;
    }
    if (ctx.step === 'name') {
      const n = text.replace(/^(hola,?\s*)?(soy|me llamo|mi nombre es)\s+/i, '').replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñü\s']/g, '').trim();
      if (n.split(/\s+/).length >= 2 && n.length < 50) { ctx.nombre = titleCase(n); return nextBookingStep(conv, api, say); }
      say('¿Me pasás tu nombre y apellido?'); return true;
    }
    if (ctx.step === 'cob') {
      const c = parseCobertura(s);
      if (!c) { say('¿Qué obra social o prepaga tenés? Si no tenés, escribí "particular".'); return true; }
      if (D.sinConvenio.includes(c)) {
        say(`Por ahora la clínica no tiene convenio con ${c}. Te puedo atender como particular (la consulta sale $ ${api.servicio('consulta').precio.toLocaleString('es-AR')}, valor de ejemplo). ¿Seguimos como particular?`);
        ctx.step = 'cobParticular'; return true;
      }
      ctx.cob = c;
      return nextBookingStep(conv, api, say);
    }
    if (ctx.step === 'cobParticular') {
      if (isYes(s)) { ctx.cob = 'Particular'; return nextBookingStep(conv, api, say); }
      say('Entiendo. Si querés, te paso con recepción para ver otras opciones.'); ctx.step = null; return true;
    }
    if (ctx.step === 'afiliado') {
      const digits = text.replace(/[^\dA-Za-z]/g, '');
      if (digits.replace(/\D/g, '').length >= 5) {
        ctx.afiliado = text.trim();
        const check = api.checkAfiliado(ctx.cob, digits);
        api.log('coberturas', `Verificó el afiliado ${ctx.afiliado} de ${ctx.cob}: ${check.ok ? 'activo' : 'no figura activo'} (simulado)`, check.ok ? 'ok' : 'warn');
        if (!check.ok) {
          say(`Revisé el padrón de ${ctx.cob} y ese número no me figura activo hoy (en esta demo los números con "000" salen inactivos). Puede ser un error de tipeo: ¿me lo mandás de nuevo? Si no, podés venir como particular.`, 'coberturas');
          return true;
        }
        return nextBookingStep(conv, api, say);
      }
      say(`¿Me pasás tu número de afiliado de ${ctx.cob}? Está en la credencial.`, 'coberturas'); return true;
    }
    if (ctx.step === 'confirm') {
      if (isYes(s)) return finishBooking(conv, api, say);
      if (isNo(s)) { ctx.step = 'pick'; ctx.slot = null; offerSlots(conv, api, say); return true; }
      return false;
    }
    if (ctx.step === 'cancelPick') {
      const appts = ctx.cancelList || [];
      const idx = parseChoice(s, appts.map((a, i) => ({ start: a.start, i })));
      const a = idx ? appts[idx.i] : (appts.length === 1 && isYes(s) ? appts[0] : null);
      if (a) {
        api.updateAppt(a.id, { status: 'cancelado' });
        api.log('recepcion', `Canceló el turno de ${api.patient(a.patientId).nombre} del ${api.dayLabel(a.date)} ${api.hhmm(a.start)} y liberó el horario`, 'info');
        say(`Listo, cancelé tu turno del ${api.dayLabel(a.date)} a las ${api.hhmm(a.start)}. ¿Querés que te busque otro día?`);
        ctx.step = 'afterCancel'; return true;
      }
      if (isNo(s)) { say('Perfecto, no toco nada. Tu turno sigue en pie.'); ctx.step = null; return true; }
      return false;
    }
    if (ctx.step === 'afterCancel') {
      ctx.step = null;
      if (isYes(s)) { ctx.flow = 'book'; ctx.day = null; ctx.time = null; offerSlots(conv, api, say); return true; }
      if (isNo(s)) { say('Dale. Cuando quieras sacar otro, escribime. 👋'); return true; }
      return false;
    }
    if (ctx.step === 'reschedPick') {
      const appts = ctx.cancelList || [];
      const idx = parseChoice(s, appts.map((a, i) => ({ start: a.start, i })));
      const a = idx ? appts[idx.i] : (appts.length === 1 && isYes(s) ? appts[0] : null);
      if (a) { ctx.targetAppt = a.id; ctx.servicio = a.servicio; ctx.prof = ctx.prof || a.prof; offerSlots(conv, api, say); return true; }
      return false;
    }
    return false;
  }

  function nextBookingStep(conv, api, say) {
    const ctx = conv.ctx;
    const patient = conv.patientId ? api.patient(conv.patientId) : null;
    if (ctx.targetAppt) return finishBooking(conv, api, say); // reprogramación: no pide datos de nuevo
    if (!patient && !ctx.nombre) { ctx.step = 'name'; say('¡Buenísimo! Para dejarlo a tu nombre, ¿me pasás tu nombre y apellido?'); return true; }
    if (!patient && !ctx.cob) { ctx.step = 'cob'; say(`Gracias, ${firstName(ctx.nombre)}. ¿Tenés obra social o prepaga? Si no, escribí "particular".`); return true; }
    const cob = patient ? patient.cob : ctx.cob;
    if (!patient && cob !== 'Particular' && !ctx.afiliado) { ctx.step = 'afiliado'; say(`¿Me pasás tu número de afiliado de ${cob}? Está en la credencial.`, 'coberturas'); return true; }
    const sv = api.servicio(ctx.slot.servicio);
    const c = D.coberturas[cob];
    if (c && c.noCubre.includes(sv.id)) {
      say(`Te aviso: ${cob} no cubre ${sv.nombre.toLowerCase()}, así que sería particular ($ ${sv.precio.toLocaleString('es-AR')}, valor de ejemplo).`, 'coberturas');
    }
    ctx.step = 'confirm';
    say(`Te resumo:\n📅 ${slotLabel(api, ctx.slot)}\n🦷 ${sv.nombre}\n👤 ${patient ? patient.nombre : ctx.nombre} · ${cob}\n¿Lo confirmo?`);
    return true;
  }

  function finishBooking(conv, api, say) {
    const ctx = conv.ctx;
    let patient = conv.patientId ? api.patient(conv.patientId) : null;
    if (ctx.targetAppt) {
      const old = api.appt(ctx.targetAppt);
      api.updateAppt(old.id, { date: ctx.slot.date, start: ctx.slot.start, prof: ctx.slot.prof, status: 'confirmado' });
      api.log('recepcion', `Reprogramó el turno de ${api.patient(old.patientId).nombre} al ${slotLabel(api, ctx.slot)}`, 'ok', old.id);
      say(`¡Listo! Tu turno quedó para el ${slotLabel(api, ctx.slot)}. Te mando un recordatorio el día anterior.`);
      conv.ctx = {}; return true;
    }
    if (!patient) {
      patient = api.upsertPatient({ nombre: ctx.nombre, tel: conv.tel, cob: ctx.cob || 'Particular', afiliado: ctx.afiliado || '', alergias: '' });
      conv.patientId = patient.id; conv.nombre = patient.nombre;
      api.log('recepcion', `Dio de alta a ${patient.nombre} como paciente nuevo (${patient.cob})`, 'info');
    }
    const sv = api.servicio(ctx.slot.servicio);
    const traer = traerPara(patient.cob, sv.id);
    const status = api.cfg().autoConfirm ? 'confirmado' : 'pendiente';
    const a = api.createAppt({ patientId: patient.id, prof: ctx.slot.prof, servicio: sv.id, date: ctx.slot.date, start: ctx.slot.start, dur: sv.dur, status, source: 'whatsapp', traer });
    api.log('recepcion', `Agendó a ${patient.nombre}: ${sv.nombre} el ${slotLabel(api, ctx.slot)}${status === 'pendiente' ? ' (espera aprobación de recepción)' : ''}`, 'ok', a.id);
    if (status === 'pendiente') {
      say(`¡Listo, ${firstName(patient.nombre)}! Dejé pedido el turno. Recepción lo confirma en breve y te aviso por acá.`);
    } else {
      say(`¡Listo, ${firstName(patient.nombre)}! Tu turno quedó confirmado para el ${slotLabel(api, ctx.slot)}. 🦷`);
    }
    const c = D.coberturas[patient.cob];
    let msg = `Para ese día traé:\n${traer.map(t => '• ' + t).join('\n')}`;
    if (c && c.tip) msg += `\n\n💡 ${c.tip}`;
    msg += '\n\nTe mando un recordatorio el día anterior con esta lista.';
    say(msg, 'coberturas');
    api.log('coberturas', `Le avisó a ${patient.nombre} qué traer según ${patient.cob}: ${traer.join(', ')}`, 'info', a.id);
    conv.ctx = {};
    return true;
  }

  function coverageAnswer(conv, api, say, cob, servicio) {
    const patient = conv.patientId ? api.patient(conv.patientId) : null;
    const which = cob || (patient && patient.cob) || conv.ctx.cob;
    if (!which) { conv.ctx.step = 'covAsk'; say('¿Qué obra social o prepaga tenés? Así te digo si la tomamos y qué tenés que llevar.', 'coberturas'); return; }
    if (D.sinConvenio.includes(which)) {
      say(`Por ahora la clínica no tiene convenio con ${which}. Te podemos atender como particular. ¿Querés que te busque un turno?`, 'coberturas');
      api.log('coberturas', `Informó que no hay convenio con ${which}`, 'info');
      return;
    }
    const c = D.coberturas[which];
    const sv = servicio ? api.servicio(servicio) : null;
    let msg = `Sí, trabajamos con ${c.nombre}. ${c.general}`;
    if (sv) {
      if (c.noCubre.includes(sv.id)) msg += `\n\n${sv.nombre} no está cubierto: sería particular ($ ${sv.precio.toLocaleString('es-AR')}, valor de ejemplo).`;
      else msg += `\n\nPara ${sv.nombre.toLowerCase()} tenés que traer:\n${traerPara(which, sv.id).map(t => '• ' + t).join('\n')}`;
    } else {
      msg += `\n\nPara una consulta traé:\n${traerPara(which, 'consulta').map(t => '• ' + t).join('\n')}`;
    }
    if (c.tip) msg += `\n\n💡 ${c.tip}`;
    msg += '\n\n¿Querés que te busque un turno?';
    say(msg, 'coberturas');
    conv.ctx.cob = which; conv.ctx.step = 'covBook'; if (sv) conv.ctx.servicio = sv.id;
    api.log('coberturas', `Respondió qué cubre ${which}${sv ? ' para ' + sv.nombre.toLowerCase() : ''} y qué hay que traer`, 'info');
  }

  function startCancel(conv, api, say) {
    if (!conv.patientId) { say('No encuentro turnos asociados a este número. Si sacaste el turno con otro teléfono, decime tu nombre y apellido y le pido a recepción que lo revise.'); return; }
    const list = api.upcoming(conv.patientId).slice(0, 4);
    if (!list.length) { say('No tenés turnos próximos a tu nombre. ¿Querés sacar uno?'); conv.ctx.step = 'afterCancel'; return; }
    conv.ctx.cancelList = list; conv.ctx.step = 'cancelPick';
    if (list.length === 1) say(`Tenés turno el ${api.dayLabel(list[0].date)} a las ${api.hhmm(list[0].start)} con ${api.prof(list[0].prof).corto}. ¿Lo cancelo?`);
    else say(`Tenés estos turnos:\n${list.map((a, i) => `${i + 1}) ${api.dayLabel(a.date)} ${api.hhmm(a.start)} · ${api.servicio(a.servicio).nombre}`).join('\n')}\n¿Cuál cancelo?`);
  }
  function startReschedule(conv, api, say, pref) {
    if (!conv.patientId) { say('No encuentro turnos con este número. ¿Querés sacar uno nuevo?'); conv.ctx.step = 'afterCancel'; return; }
    const list = api.upcoming(conv.patientId).slice(0, 4);
    if (!list.length) { say('No tenés turnos próximos. ¿Querés sacar uno?'); conv.ctx.step = 'afterCancel'; return; }
    const ctx = conv.ctx;
    ctx.flow = 'book';
    if (pref.day) ctx.day = api.key(pref.day); if (pref.time) ctx.time = pref.time; if (pref.prof) ctx.prof = pref.prof;
    if (list.length === 1) { ctx.targetAppt = list[0].id; ctx.servicio = list[0].servicio; ctx.prof = ctx.prof || list[0].prof; say(`Dale, movemos tu turno del ${api.dayLabel(list[0].date)} ${api.hhmm(list[0].start)}.`); offerSlots(conv, api, say); return; }
    ctx.cancelList = list; ctx.step = 'reschedPick';
    say(`¿Cuál querés mover?\n${list.map((a, i) => `${i + 1}) ${api.dayLabel(a.date)} ${api.hhmm(a.start)} · ${api.servicio(a.servicio).nombre}`).join('\n')}`);
  }
  function doConfirm(conv, api, say) {
    const list = conv.patientId ? api.upcoming(conv.patientId).filter(a => a.status === 'por_confirmar') : [];
    if (!list.length) { say('¡Gracias! No tenés turnos pendientes de confirmar. Nos vemos. 😊'); return; }
    const a = list[0];
    api.updateAppt(a.id, { status: 'confirmado' });
    api.log('recordatorios', `${api.patient(a.patientId).nombre} confirmó su turno del ${api.dayLabel(a.date)} ${api.hhmm(a.start)}`, 'ok', a.id);
    say(`¡Gracias! Quedó confirmado tu turno del ${api.dayLabel(a.date)} a las ${api.hhmm(a.start)}. Acordate de traer: ${(a.traer || ['DNI']).join(', ')}.`);
  }

  // Respuestas cortas después de una pregunta de cobertura ("¿querés que te busque un turno?")
  const _reply = reply;
  function replyWrapper(conv, text, api) {
    const s = norm(text);
    const ctx = conv.ctx || (conv.ctx = {});
    if (ctx.step === 'covBook' && conv.mode !== 'human') {
      ctx.step = null;
      if (isYes(s)) { ctx.flow = 'book'; const out = []; offerSlots(conv, api, (t, a = 'recepcion') => out.push({ agent: a, text: t })); return out; }
    }
    if (ctx.step === 'covAsk' && conv.mode !== 'human') {
      const c = parseCobertura(s);
      ctx.step = null;
      if (c) { const out = []; coverageAnswer(conv, api, (t, a = 'coberturas') => out.push({ agent: a, text: t }), c, parseServicio(s)); return out; }
    }
    return _reply(conv, text, api);
  }

  window.ClaraAgent = { reply: replyWrapper, traerPara, norm };
})();
