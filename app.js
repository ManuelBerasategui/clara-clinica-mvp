/* Clara · aplicación (estado, pantallas y simulador). Sin dependencias. */
(function () {
  const D = window.CLARA_DATA, A = window.ClaraAgent;
  const $ = s => document.querySelector(s);

  /* ---------- Íconos ---------- */
  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    calendar: '<rect x="3" y="4.5" width="18" height="16.5" rx="2.5"/><path d="M16 2.5v4M8 2.5v4M3 10h18"/>',
    chat: '<path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.3A8.5 8.5 0 1 1 21 11.5z"/>',
    users: '<circle cx="9" cy="8" r="3.6"/><path d="M2.5 20.5a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.6 3.6 0 0 1 0 6.8M21.5 20.5a6.5 6.5 0 0 0-3.6-5.8"/>',
    shield: '<path d="M12 3 4.5 6v5.5c0 4.7 3.2 7.9 7.5 9.5 4.3-1.6 7.5-4.8 7.5-9.5V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
    bot: '<rect x="4" y="8" width="16" height="12" rx="3.5"/><path d="M12 4.5V8M9 13.5v.5M15 13.5v.5M9.5 17h5"/><circle cx="12" cy="3.5" r="1"/>',
    wallet: '<rect x="3" y="5.5" width="18" height="14.5" rx="2.5"/><path d="M3 10h18M16 15h2"/>',
    settings: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
    phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18h2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    chevL: '<path d="m15 18-6-6 6-6"/>', chevR: '<path d="m9 18 6-6-6-6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>',
    send: '<path d="M21.5 2.5 10.8 13.2"/><path d="m21.5 2.5-6.8 19-3.9-8.3-8.3-3.9z"/>',
    alert: '<path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9.5v4M12 17h.01"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    sparkle: '<path d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.5l-1.9-5.7-5.6-1.9L10.1 9z"/><path d="M19 3v3M17.5 4.5h3"/>',
    more: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    file: '<path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    refresh: '<path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1L20.5 8.5"/><path d="M20.5 3.5v5h-5"/>',
    bell: '<path d="M6 8.5a6 6 0 1 1 12 0c0 6.5 2.8 8 2.8 8H3.2S6 15 6 8.5"/><path d="M10 20a2.2 2.2 0 0 0 4 0"/>',
    tooth: '<path d="M7.2 3C4.6 3 3 5 3 7.6c0 3 1.5 4.1 2 7.1.5 3 1 6.3 2.6 6.3 1.4 0 1.6-3 2.5-4.9.6-1.2 1.3-1.2 1.9 0 .9 1.9 1.1 4.9 2.5 4.9 1.6 0 2.1-3.3 2.6-6.3.5-3 2-4.1 2-7.1C19 5 17.4 3 14.8 3c-1.6 0-2 .8-3 .8S8.8 3 7.2 3z"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    hand: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11M11 10V4.5a1.5 1.5 0 0 1 3 0V11M14 10.5V6a1.5 1.5 0 0 1 3 0v8a7 7 0 0 1-7 7 6.5 6.5 0 0 1-5.4-2.9L2.8 15a1.5 1.5 0 0 1 2.5-1.7L8 16"/>',
    receipt: '<path d="M5 3h14v18l-2.3-1.5L14.3 21 12 19.5 9.7 21l-2.4-1.5L5 21z"/><path d="M9 8h6M9 12h6"/>',
    copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>'
  };
  const ic = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
  function hydrate(root = document) { root.querySelectorAll('[data-icon]:not([data-done])').forEach(el => { el.innerHTML = ic(el.dataset.icon); el.dataset.done = 1; }); }

  /* ---------- Utilidades ---------- */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = n => '$ ' + Math.round(n).toLocaleString('es-AR');
  const pad = n => String(n).padStart(2, '0');
  const uid = () => Math.random().toString(36).slice(2, 9);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const initials = n => (n || '?').split(' ').filter(Boolean).slice(0, 2).map(x => x[0]).join('').toUpperCase();
  const first = n => (n || '').split(' ')[0];

  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const addDays = (d, n) => { const x = new Date(typeof d === 'string' ? fromKey(d) : d); x.setDate(x.getDate() + n); return x; };
  const key = d => typeof d === 'string' ? d : `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromKey = k => { const [y, m, dd] = k.split('-').map(Number); return new Date(y, m - 1, dd); };
  const nowMin = () => { const n = new Date(); return n.getHours() * 60 + n.getMinutes(); };
  const hhmm = m => pad(Math.floor(m / 60)) + ':' + pad(m % 60);
  const WD = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  const WDL = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const tk = () => key(today());
  const dm = k => { const d = fromKey(key(k)); return `${d.getDate()}/${d.getMonth() + 1}`; };
  const dayLong = k => { const d = fromKey(key(k)); return `${WDL[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`; };
  function dayRel(k) { k = key(k); const diff = Math.round((fromKey(k) - today()) / 864e5); if (diff === 0) return 'Hoy'; if (diff === 1) return 'Mañana'; if (diff === -1) return 'Ayer'; const d = fromKey(k); return `${WD[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`; }
  function dayTitle(k) { const d = fromKey(key(k)); const rel = dayRel(k); const base = `${WDL[d.getDay()]} ${d.getDate()} de ${MES[d.getMonth()]}`; return (rel === 'Hoy' || rel === 'Mañana') ? `${rel} · ${base}` : base; }
  const timeAgo = t => { const s = (Date.now() - t) / 1000; if (s < 60) return 'recién'; if (s < 3600) return `hace ${Math.floor(s / 60)} min`; if (s < 86400) return `hace ${Math.floor(s / 3600)} h`; return `hace ${Math.floor(s / 86400)} d`; };
  const clock = t => { const d = new Date(t); return pad(d.getHours()) + ':' + pad(d.getMinutes()); };

  const prof = id => D.profs.find(p => p.id === id);
  const servicio = id => D.servicios.find(s => s.id === id) || D.servicios[0];
  const patient = id => S.patients.find(p => p.id === id);
  const appt = id => S.appts.find(a => a.id === id);
  const cobLabel = p => p ? (p.cob + (p.plan ? ' ' + p.plan : '')) : '';

  /* ---------- Estado ---------- */
  const LS = 'clara-demo-v3';
  let S;
  const UI = { page: 'hoy', agendaDay: null, agendaView: 'dia', agendaProf: 'all', inboxConv: null, highlight: null, typing: {}, osTab: 'pre', form: null, pendingToasts: [], checking: false, sheet: null };

  function save() { try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) { /* sin almacenamiento: la demo sigue en memoria */ } }
  function load() {
    try { const raw = localStorage.getItem(LS); if (raw) { const s = JSON.parse(raw); if (s && s.v === 3 && s.seededFor === tk()) return s; } } catch (e) { }
    return seed();
  }

  function seed() {
    const s = { v: 3, seededFor: tk(), cfg: { autoConfirm: true, agents: { recepcion: true, coberturas: true, recordatorios: true, facturacion: true, historia: true } }, patients: JSON.parse(JSON.stringify(D.patients)), appts: [], convs: [], activity: [], prestaciones: [], debitos: [], flags: {}, persona: 'nuevo' };
    const pattern = {
      mendez: [[540, 'control'], [600, 'consulta'], [660, 'limpieza'], [720, 'extraccion'], [870, 'consulta'], [930, 'implante'], [1020, 'control']],
      salas: [[510, 'limpieza'], [570, 'ortodoncia'], [630, 'consulta'], [690, 'ortodoncia'], [870, 'ortodoncia'], [960, 'control'], [1050, 'limpieza']],
      quiroga: [[540, 'endodoncia'], [660, 'endodoncia'], [870, 'consulta'], [960, 'endodoncia']]
    };
    const T = today(), nm = nowMin();
    for (let off = -3; off <= 12; off++) {
      const d = addDays(T, off), k = key(d), wd = d.getDay(), blocks = D.clinic.bloques[wd];
      if (!blocks) continue;
      D.profs.forEach((P, pi) => {
        if (!P.dias.includes(wd)) return;
        pattern[P.id].forEach(([start, sv], j) => {
          const dur = servicio(sv).dur;
          if (!blocks.some(([b0, b1]) => start >= b0 && start + dur <= b1)) return;
          if ((off * 7 + j * 3 + pi * 5 + 40) % 5 === 0) return; // huecos libres
          if (off > 4 && (j + off) % 3 === 0) return;
          let pat = s.patients[(off * 3 + j + pi * 4 + 40) % s.patients.length];
          if (off >= 0 && (pat.id === 'p2' || pat.id === 'p3')) pat = s.patients[4 + ((off + j) % 6)]; // las personas del simulador arrancan con pocos turnos
          let status = 'confirmado';
          if (off < 0 || (off === 0 && start + dur < nm)) status = 'atendido';
          else if (off === 0 && start <= nm) status = 'llego';
          else if (off <= 2 && (j + pi) % 3 === 1) status = 'por_confirmar';
          s.appts.push({ id: uid(), patientId: pat.id, prof: P.id, servicio: sv, date: k, start, dur, status, source: (j + off) % 4 === 0 ? 'whatsapp' : 'recepcion', traer: A.traerPara(pat.cob, sv), traerOk: [] });
        });
      });
    }
    // Un turno próximo para cada paciente del simulador (para probar cancelar / reprogramar / confirmar)
    const addFree = (pid, profId, sv, status, fromOff) => {
      for (let off = fromOff; off < 14; off++) {
        const d = addDays(T, off), k = key(d), blocks = D.clinic.bloques[d.getDay()];
        if (!blocks || !prof(profId).dias.includes(d.getDay())) continue;
        for (const [b0, b1] of blocks) for (let t = b0 + 60; t + 30 <= b1; t += 30) {
          if (s.appts.some(a => a.prof === profId && a.date === k && t < a.start + a.dur && a.start < t + 30)) continue;
          const p = s.patients.find(x => x.id === pid);
          s.appts.push({ id: uid(), patientId: pid, prof: profId, servicio: sv, date: k, start: t, dur: 30, status, source: 'recepcion', traer: A.traerPara(p.cob, sv), traerOk: [] });
          return;
        }
      }
    };
    addFree('p2', 'salas', 'control', 'por_confirmar', 1);
    addFree('p3', 'mendez', 'limpieza', 'confirmado', 2);

    // Historia clínica de ejemplo
    const ev = (fecha, profId, txt) => ({ id: uid(), fecha, prof: profId, firmado: true, ...txt });
    s.patients.find(p => p.id === 'p1').evols = [ev(key(addDays(T, -16)), 'mendez', { motivo: 'Control semestral', hallazgos: 'Sensibilidad leve en pieza 16.', procedimiento: 'Limpieza profesional.', indicaciones: 'Pasta para sensibilidad.', proximo: 'Restauración de 16.' })];
    s.patients.find(p => p.id === 'p1').odonto = { mark: [16], done: [26] };
    s.patients.find(p => p.id === 'p4').evols = [ev(key(addDays(T, -9)), 'quiroga', { motivo: 'Dolor espontáneo en 36', hallazgos: 'Pulpitis irreversible en 36.', procedimiento: 'Apertura y conductometría (1.ª sesión).', indicaciones: 'Ibuprofeno según indicación médica.', proximo: 'Obturación de conductos.' })];
    s.patients.find(p => p.id === 'p4').odonto = { mark: [36], done: [] };
    s.patients.forEach(p => { p.evols = p.evols || []; p.odonto = p.odonto || { mark: [], done: [] }; });

    // Conversaciones de ejemplo
    const ago = m => Date.now() - m * 60000;
    const mk = (pid, msgs, extra) => { const p = s.patients.find(x => x.id === pid); return Object.assign({ id: uid(), tel: p.tel, patientId: pid, nombre: p.nombre, mode: 'agent', needsHuman: false, ctx: {}, unread: 0, updated: msgs[msgs.length - 1].t, msgs }, extra || {}); };
    s.convs.push(mk('p9', [
      { from: 'patient', text: 'Hola, me duele mucho una muela desde anoche, no pude dormir', t: ago(12) },
      { from: 'agent', agent: 'recepcion', text: 'Lamento que estés con molestias, Lucas. Ya le avisé al equipo para que te miren con prioridad. Si tenés fiebre o mucha hinchazón, andá a una guardia.', t: ago(12) },
      { from: 'agent', agent: 'recepcion', text: 'Te puedo reservar el primer turno de urgencia disponible. ¿Lo tomo?', t: ago(11) },
      { from: 'patient', text: 'Prefiero que me llamen, gracias', t: ago(9) }
    ], { needsHuman: true, flagReason: 'Urgencia: dolor de muela, pide que lo llamen', unread: 1 }));
    s.convs.push(mk('p6', [
      { from: 'patient', text: 'Hola! ¿Aceptan OSDE 210 para una limpieza?', t: ago(48) },
      { from: 'agent', agent: 'coberturas', text: 'Sí, trabajamos con OSDE. Para la limpieza traé la credencial digital de OSDE y tu DNI. ¿Querés que te busque un turno?', t: ago(48) },
      { from: 'patient', text: 'Más tarde les escribo, gracias!', t: ago(45) },
      { from: 'agent', agent: 'recepcion', text: '¡De nada, Julia! Cualquier cosa escribime por acá. 😊', t: ago(45) }
    ]));
    s.convs.push(mk('p2', [
      { from: 'agent', agent: 'recordatorios', text: 'Hola Mateo, te recuerdo tu turno de mañana. Traé la credencial digital de OSDE y tu DNI. ¿Confirmás?', t: ago(130) },
      { from: 'patient', text: 'Confirmo 👍', t: ago(122) },
      { from: 'agent', agent: 'recordatorios', text: '¡Gracias! Quedó confirmado.', t: ago(122) }
    ]));

    // Actividad inicial de los agentes
    const act = (agent, text, m, level = 'info') => s.activity.push({ id: uid(), agent, text, t: ago(m), level });
    act('recepcion', 'Detectó una posible urgencia de Lucas Benítez y avisó a recepción', 11, 'warn');
    act('coberturas', 'Respondió a Julia Fernández qué cubre OSDE para limpieza y qué tiene que traer', 48);
    act('recordatorios', 'Envió 9 recordatorios para hoy: 7 confirmaron, 1 reprogramó y 1 no respondió', 140, 'ok');
    act('facturacion', 'Ordenó la liquidación de septiembre: 6 débitos, 4 se pueden reclamar', 600);

    // Prestaciones del mes anterior para presentar (obras sociales)
    const pm = new Date(T.getFullYear(), T.getMonth() - 1, 1);
    const pd = n => key(new Date(pm.getFullYear(), pm.getMonth(), n));
    const base = { firma: true, orden: true, bono: true, rxPre: true, rxPost: true, autorizacion: true, frecuencia: true, pieza: '' };
    const P = (pid, sv, dia, prof, over) => { const p = s.patients.find(x => x.id === pid); return Object.assign({ id: uid(), patientId: pid, cob: p.cob, servicio: sv, fecha: pd(dia), prof, monto: Math.round(servicio(sv).precio * 0.62 / 100) * 100, checked: false }, base, over || {}); };
    s.prestaciones = [
      P('p2', 'limpieza', 3, 'salas', { firma: false }),
      P('p4', 'endodoncia', 5, 'quiroga', { pieza: '36', rxPost: false }),
      P('p3', 'consulta', 6, 'mendez'),
      P('p7', 'limpieza', 8, 'mendez', { bono: false }),
      P('p6', 'limpieza', 10, 'salas', { frecuencia: false }),
      P('p8', 'endodoncia', 12, 'quiroga', { pieza: '46', autorizacion: false }),
      P('p9', 'consulta', 14, 'salas'),
      P('p10', 'extraccion', 15, 'mendez', { pieza: '' }),
      P('p2', 'consulta', 17, 'mendez'),
      P('p7', 'consulta', 19, 'salas'),
      P('p4', 'consulta', 21, 'quiroga'),
      P('p3', 'limpieza', 24, 'mendez', { orden: false })
    ];
    // Débitos de la última liquidación
    const pm2 = new Date(T.getFullYear(), T.getMonth() - 2, 1);
    s.debitosMes = MES[pm2.getMonth()];
    const Db = (pid, sv, monto, raw, cat) => { const p = s.patients.find(x => x.id === pid); return { id: uid(), patientId: pid, cob: p.cob, servicio: sv, monto, raw, cat, classified: false, estado: 'nuevo' }; };
    s.debitos = [
      Db('p4', 'endodoncia', 98000, 'COD 14 · FALTA RX POST CONDUCTOMETRÍA', 'rx'),
      Db('p7', 'limpieza', 26000, 'COD 03 · FALTA FIRMA AFILIADO', 'firma'),
      Db('p9', 'consulta', 17400, 'COD 21 · AFILIADO NO HABILITADO A LA FECHA', 'afiliado'),
      Db('p6', 'limpieza', 26000, 'COD 09 · SUPERA FRECUENCIA PERMITIDA', 'frecuencia'),
      Db('p2', 'extraccion', 40300, 'COD 11 · CÓDIGO NO CORRESPONDE A PIEZA INFORMADA', 'codigo'),
      Db('p8', 'blanqueamiento', 93000, 'COD 30 · PRÁCTICA NO CONTEMPLADA EN EL PLAN', 'nocubre')
    ];
    return s;
  }

  /* ---------- Turnos y disponibilidad ---------- */
  const live = a => a.status !== 'cancelado';
  const apptsOn = (k, profF) => S.appts.filter(a => a.date === k && live(a) && (!profF || profF === 'all' || a.prof === profF)).sort((a, b) => a.start - b.start);
  function upcoming(pid) {
    const k = tk(), nm = nowMin();
    return S.appts.filter(a => a.patientId === pid && ['confirmado', 'por_confirmar', 'pendiente'].includes(a.status) && (a.date > k || (a.date === k && a.start > nm))).sort((a, b) => (a.date + hhmm(a.start)).localeCompare(b.date + hhmm(b.start)));
  }
  function findSlots(q) {
    const sv = servicio(q.servicio || 'consulta'), dur = sv.dur;
    const profs = q.prof ? [q.prof] : sv.profs;
    const start = q.from ? fromKey(q.from) : today();
    const days = q.day ? [fromKey(q.day)] : Array.from({ length: 14 }, (_, i) => addDays(start, i));
    const k0 = tk(), nm = nowMin();
    let res = [];
    for (const d of days) {
      const k = key(d); if (k < k0) continue;
      const wd = d.getDay(), blocks = D.clinic.bloques[wd]; if (!blocks) continue;
      for (const p of profs) {
        if (!prof(p).dias.includes(wd)) continue;
        const busy = S.appts.filter(a => a.prof === p && a.date === k && live(a) && a.id !== q.exclude);
        for (const [b0, b1] of blocks) for (let t = b0; t + dur <= b1; t += 30) {
          if (k === k0 && t < nm + 30) continue;
          if (busy.some(a => t < a.start + a.dur && a.start < t + dur)) continue;
          res.push({ date: k, start: t, prof: p, servicio: sv.id });
        }
      }
    }
    res.sort((a, b) => (a.date + hhmm(a.start)).localeCompare(b.date + hhmm(b.start)));
    const limit = q.limit || 3;
    if (q.time) {
      if (q.time.exact != null) {
        const ex = res.filter(o => o.start === q.time.exact);
        if (ex.length) return [ex[0]].concat(res.filter(o => o !== ex[0] && o.date === ex[0].date).slice(0, limit - 1));
        res.sort((a, b) => a.date === b.date ? Math.abs(a.start - q.time.exact) - Math.abs(b.start - q.time.exact) : a.date.localeCompare(b.date));
      } else if (q.time.pref) {
        const f = res.filter(o => q.time.pref === 'manana' ? o.start < 780 : o.start >= 840);
        if (f.length) res = f;
      }
    }
    if (q.day) {
      const out = [], seenT = new Set();
      for (const o of res) { if (seenT.has(o.start) && !q.prof) continue; seenT.add(o.start); out.push(o); if (out.length >= limit) break; }
      return out;
    }
    const out = [];
    for (const o of res) {
      if (out.some(x => x.date === o.date && (x.prof === o.prof || Math.abs(x.start - o.start) < 90))) continue;
      out.push(o); if (out.length >= limit) break;
    }
    return out;
  }

  function createAppt(o) {
    const a = Object.assign({ id: uid(), traerOk: [], created: Date.now() }, o);
    S.appts.push(a);
    if (o.source === 'whatsapp') {
      UI.highlight = a.id;
      const p = patient(a.patientId);
      UI.pendingToasts.push({ title: a.status === 'pendiente' ? 'Turno pedido por WhatsApp (a aprobar)' : 'Nuevo turno por WhatsApp', text: `${p.nombre} · ${dayRel(a.date)} ${hhmm(a.start)} · ${prof(a.prof).corto}`, action: 'Ver en agenda', fn: () => showAppt(a.id) });
    }
    save(); return a;
  }
  function updateAppt(id, patch) { const a = appt(id); if (a) Object.assign(a, patch); if (a && patch.date) UI.highlight = id; save(); return a; }
  function upsertPatient(p) { const n = Object.assign({ id: 'n' + uid(), evols: [], odonto: { mark: [], done: [] }, nuevo: true }, p); S.patients.unshift(n); save(); return n; }
  function log(agent, text, level = 'info', apptId) { S.activity.unshift({ id: uid(), agent, text, level, apptId, t: Date.now(), fresh: true }); S.activity = S.activity.slice(0, 80); save(); }
  function flag(conv, reason) {
    conv.needsHuman = true; conv.flagReason = reason; conv.unread = (conv.unread || 0) + 1;
    UI.pendingToasts.push({ title: 'Clara necesita a una persona', text: `${conv.nombre || conv.tel}: ${reason}`, action: 'Abrir chat', fn: () => { closePhone(); UI.inboxConv = conv.id; go('whatsapp'); }, warn: true });
  }

  /* API que usa el motor de agentes */
  const API = {
    today, addDays, key, hhmm, prof, servicio, patient, appt, findSlots, createAppt, updateAppt, upsertPatient, upcoming, flag, log,
    dayLabel: k => dayLong(k), cfg: () => S.cfg,
    checkAfiliado: (cob, digits) => ({ ok: !/000/.test(digits) }),
    isClosed: k => !D.clinic.bloques[fromKey(key(k)).getDay()],
    profWorks: (p, k) => prof(p).dias.includes(fromKey(key(k)).getDay())
  };

  /* ---------- Conversaciones ---------- */
  function convByTel(tel) { return S.convs.find(c => c.tel === tel); }
  function convFor(tel, patientId, nombre) {
    let c = convByTel(tel);
    if (!c) { c = { id: uid(), tel, patientId, nombre, mode: 'agent', needsHuman: false, ctx: {}, unread: 0, msgs: [], updated: Date.now() }; S.convs.unshift(c); }
    return c;
  }
  function addMsg(conv, m) { m.t = m.t || Date.now(); conv.msgs.push(m); conv.updated = m.t; }
  async function incoming(conv, text, opts = {}) {
    addMsg(conv, { from: 'patient', text });
    if (conv.mode === 'human' || conv.needsHuman) conv.unread = (conv.unread || 0) + 1;
    if (!S.cfg.agents.recepcion && conv.mode !== 'human') { conv.mode = 'human'; flag(conv, 'Clara está apagada: responder a mano'); }
    save(); refresh();
    const replies = A.reply(conv, text, API);
    if (conv.patientId && !conv.nombre) conv.nombre = patient(conv.patientId).nombre;
    for (const r of replies) {
      if (!opts.instant) { UI.typing[conv.id] = true; renderPhone(); await sleep(450 + Math.min(1300, r.text.length * 7)); UI.typing[conv.id] = false; }
      if (r.agent === 'coberturas' && !S.cfg.agents.coberturas) continue;
      addMsg(conv, { from: 'agent', agent: r.agent, text: r.text });
      save(); refresh();
    }
    flushToasts();
  }

  /* ---------- Navegación ---------- */
  const PAGES = {
    hoy: ['Hoy', 'home'], agenda: ['Agenda', 'calendar'], whatsapp: ['WhatsApp', 'chat'], pacientes: ['Pacientes', 'users'],
    obras: ['Obras sociales', 'shield'], finanzas: ['Finanzas', 'wallet'], agentes: ['Agentes IA', 'bot'], config: ['Configuración', 'settings']
  };
  function go(p, push = true) {
    if (!PAGES[p]) p = 'hoy';
    UI.page = p;
    if (push && location.hash !== '#' + p) history.pushState(null, '', '#' + p);
    closeSheet(true);
    render(); window.scrollTo(0, 0);
  }
  window.addEventListener('popstate', () => go((location.hash || '#hoy').slice(1), false));

  function needsHumanCount() { return S.convs.filter(c => c.needsHuman).length; }
  function renderNav() {
    const n = needsHumanCount();
    const item = (p) => `<button class="${UI.page === p ? 'active' : ''}" data-act="go" data-page="${p}">${ic(PAGES[p][1])}<span class="navtxt">${PAGES[p][0]}</span>${p === 'whatsapp' && n ? `<span class="count">${n}</span>` : ''}</button>`;
    $('#sidenav').innerHTML = `<div class="navlabel">DÍA A DÍA</div>${['hoy', 'agenda', 'whatsapp', 'pacientes'].map(item).join('')}<div class="navlabel">ADMINISTRACIÓN</div>${['obras', 'finanzas'].map(item).join('')}<div class="navlabel">INTELIGENCIA</div>${['agentes', 'config'].map(item).join('')}`;
    const b = (p, label, icon, dot) => `<button class="${UI.page === p || (p === 'mas' && ['obras', 'finanzas', 'agentes', 'config'].includes(UI.page)) ? 'active' : ''}" data-act="${p === 'mas' ? 'more' : 'go'}" data-page="${p}">${ic(icon)}<span>${label}</span>${dot ? `<span class="dot">${dot}</span>` : ''}</button>`;
    $('#bottomnav').innerHTML = b('hoy', 'Hoy', 'home') + b('agenda', 'Agenda', 'calendar') + b('whatsapp', 'WhatsApp', 'chat', n) + b('pacientes', 'Pacientes', 'users') + b('mas', 'Más', 'more');
    const bc = $('#bellcount'); bc.textContent = n; bc.classList.toggle('hidden', !n);
    $('#crumb').textContent = PAGES[UI.page][0];
    document.title = `${PAGES[UI.page][0]} · Clara`;
    $('.fab').classList.toggle('hidden', !['hoy', 'agenda', 'pacientes'].includes(UI.page));
  }

  /* ---------- Piezas comunes ---------- */
  const STATUS = { confirmado: ['ok', 'Confirmado'], por_confirmar: ['warn', 'Por confirmar'], pendiente: ['blue', 'A aprobar'], llego: ['teal', 'En sala'], atendido: ['', 'Atendido'], cancelado: ['red', 'Cancelado'] };
  const statusChip = s => `<span class="chip ${STATUS[s][0]}">${STATUS[s][1]}</span>`;
  const AGENTS = {
    recepcion: { n: 'Recepción', ini: 'R', icon: 'chat' }, coberturas: { n: 'Coberturas', ini: 'C', icon: 'shield' },
    recordatorios: { n: 'Recordatorios', ini: 'Rc', icon: 'bell' }, facturacion: { n: 'Facturación', ini: 'F', icon: 'receipt' },
    historia: { n: 'Historia clínica', ini: 'H', icon: 'file' }, persona: { n: 'Persona', ini: 'P', icon: 'user' }
  };
  const agentBadge = a => `<span class="agent-badge ag-${a}">${ic(AGENTS[a].icon, 'sm')}</span>`;
  const profColor = id => prof(id).color === 'teal' ? '' : prof(id).color;

  function apptRow(a, quick) {
    const p = patient(a.patientId), sv = servicio(a.servicio), P = prof(a.prof);
    let q = '';
    if (quick) {
      if (['confirmado', 'por_confirmar'].includes(a.status) && a.date === tk()) q = `<button class="btn sm soft" data-act="appt-status" data-id="${a.id}" data-s="llego">Llegó</button>`;
      else if (a.status === 'llego') q = `<button class="btn sm soft" data-act="appt-status" data-id="${a.id}" data-s="atendido">Atendido</button>`;
      else if (a.status === 'pendiente') q = `<button class="btn sm primary" data-act="appt-status" data-id="${a.id}" data-s="confirmado">Aprobar</button>`;
    }
    return `<div class="row tap ${UI.highlight === a.id ? 'flash' : ''}" data-act="appt" data-id="${a.id}">
      <div class="time">${hhmm(a.start)}<small>${a.dur} min</small></div>
      <div class="grow"><div class="title">${esc(p.nombre)}</div><div class="meta">${esc(sv.nombre)} · ${esc(P.corto)} · ${esc(cobLabel(p))}</div></div>
      ${a.source === 'whatsapp' ? `<span class="chip wa" title="Lo agendó Clara por WhatsApp">${ic('chat')}</span>` : ''}
      ${q || statusChip(a.status)}</div>`;
  }

  function feedHTML(n = 8) {
    const items = S.activity.slice(0, n);
    if (!items.length) return '<div class="empty">Todavía no hay actividad.</div>';
    return `<div class="feed">${items.map(x => `<div class="feed-item ${x.fresh ? 'flash' : ''}">${agentBadge(x.agent)}<div><div class="f-text">${esc(x.text)}</div><div class="f-meta">${AGENTS[x.agent].n} · ${timeAgo(x.t)}</div></div></div>`).join('')}</div>`;
  }

  /* ---------- Página: Hoy ---------- */
  function pageHoy() {
    const k = tk();
    let dayK = k, list = apptsOn(k), isToday = true;
    if (!list.length) { for (let i = 1; i < 8; i++) { const kk = key(addDays(today(), i)); const l = apptsOn(kk); if (l.length) { dayK = kk; list = l; isToday = false; break; } } }
    const done = list.filter(a => a.status === 'atendido').length;
    const tomorrow = key(addDays(today(), 1));
    const porConf = S.appts.filter(a => (a.date === k || a.date === tomorrow) && a.status === 'por_confirmar').length;
    const nh = needsHumanCount();
    const issues = S.prestaciones.filter(x => !x.excluded && issuesOf(x).length);
    const issuesAmt = issues.reduce((s, x) => s + x.monto, 0);
    const h = new Date().getHours();
    const saludo = h < 13 ? 'Buen día' : h < 20 ? 'Buenas tardes' : 'Buenas noches';

    // Requiere atención
    const attn = [];
    S.convs.filter(c => c.needsHuman).forEach(c => attn.push(`<div class="attn"><div class="a-ico red">${ic('alert')}</div><div class="a-body"><div class="a-title">${esc(c.nombre || c.tel)}</div><div class="a-text">${esc(c.flagReason || 'Necesita una persona')}</div><div class="a-actions"><button class="btn sm primary" data-act="open-conv" data-id="${c.id}">Abrir chat</button><button class="btn sm ghost" data-act="resolve" data-id="${c.id}">Ya lo resolví</button></div></div></div>`));
    S.appts.filter(a => a.status === 'pendiente').forEach(a => { const p = patient(a.patientId); attn.push(`<div class="attn"><div class="a-ico blue">${ic('calendar')}</div><div class="a-body"><div class="a-title">Turno pedido por WhatsApp</div><div class="a-text">${esc(p.nombre)} · ${dayRel(a.date)} ${hhmm(a.start)} · ${esc(servicio(a.servicio).nombre)} · ${esc(prof(a.prof).corto)}</div><div class="a-actions"><button class="btn sm primary" data-act="appt-status" data-id="${a.id}" data-s="confirmado">Aprobar</button><button class="btn sm ghost" data-act="appt" data-id="${a.id}">Ver</button></div></div></div>`); });
    const remDay = nextWorkingDay();
    const remPend = S.appts.filter(a => a.date === remDay && a.status === 'por_confirmar').length;
    if (remPend && S.flags.reminders !== remDay) attn.push(`<div class="attn"><div class="a-ico">${ic('bell')}</div><div class="a-body"><div class="a-title">${remPend} turno${remPend > 1 ? 's' : ''} del ${dayLong(remDay)} sin confirmar</div><div class="a-text">El agente de recordatorios les escribe con la lista de qué traer y anota quién confirma.</div><div class="a-actions"><button class="btn sm primary" data-act="run-reminders">Enviar recordatorios</button></div></div></div>`);
    if (issues.length) attn.push(`<div class="attn"><div class="a-ico">${ic('receipt')}</div><div class="a-body"><div class="a-title">${issues.length} prestaciones con faltantes antes de presentar</div><div class="a-text">Si se presentan así, vuelven como débito: ${money(issuesAmt)}.</div><div class="a-actions"><button class="btn sm primary" data-act="go" data-page="obras">Revisar</button></div></div></div>`);

    return `
      <div class="pagehead"><div><h1>${saludo}, Lucía</h1><p>${dayTitle(k)}</p></div><div class="actions"><button class="btn primary hide-m" data-act="new-appt">${ic('plus')}Nuevo turno</button></div></div>
      ${S.flags.bannerOff ? '' : `<div class="banner"><div class="b-ico">${ic('phone', 'lg')}</div><div><b>Probá a Clara como si fueras un paciente</b><span>Escribí por WhatsApp y mirá cómo aparece el turno en la agenda.</span></div><button class="btn sm" data-act="phone-open">Probar</button></div>`}
      <div class="kpis">
        <button class="card kpi" data-act="go" data-page="agenda"><div class="k-top"><span class="k-ico">${ic('calendar')}</span>Turnos ${isToday ? 'hoy' : dayRel(dayK).toLowerCase()}</div><div class="k-num">${list.length}</div><div class="k-sub">${done} atendidos · ${list.length - done} por venir</div></button>
        <button class="card kpi warn" data-act="go" data-page="agenda"><div class="k-top"><span class="k-ico">${ic('clock')}</span>Por confirmar</div><div class="k-num">${porConf}</div><div class="k-sub">Hoy y mañana</div></button>
        <button class="card kpi ${nh ? 'red' : ''}" data-act="go" data-page="whatsapp"><div class="k-top"><span class="k-ico">${ic('hand')}</span>Necesitan una persona</div><div class="k-num">${nh}</div><div class="k-sub">El resto lo responde Clara</div></button>
        <button class="card kpi blue" data-act="go" data-page="obras"><div class="k-top"><span class="k-ico">${ic('shield')}</span>Débitos a evitar</div><div class="k-num">${money(issuesAmt)}</div><div class="k-sub">${issues.length} prestaciones con faltantes</div></button>
      </div>
      <div class="grid-main">
        <div class="card"><div class="cardhead"><div><h2>${isToday ? 'Agenda de hoy' : 'Próximo día con turnos'}</h2><div class="sub">${isToday ? `${list.length} turnos` : dayTitle(dayK)}</div></div><button class="linkbtn" data-act="go" data-page="agenda">Ver agenda ${ic('arrow', 'sm')}</button></div>
          <div class="list">${list.length ? list.map(a => apptRow(a, true)).join('') : '<div class="empty">No hay turnos cargados.</div>'}</div></div>
        <div class="stack">
          <div class="card"><div class="cardhead"><div><h2>Requiere tu atención</h2><div class="sub">Lo que los agentes no resuelven solos</div></div></div><div class="list">${attn.join('') || '<div class="empty">Todo en orden. ✨</div>'}</div></div>
          <div class="card"><div class="cardhead"><div><h2>Lo que hicieron los agentes</h2><div class="sub">En tiempo real</div></div><button class="linkbtn" data-act="go" data-page="agentes">Agentes ${ic('arrow', 'sm')}</button></div>${feedHTML(7)}</div>
        </div>
      </div>`;
  }
  function nextWorkingDay() { for (let i = 1; i < 8; i++) { const d = addDays(today(), i); if (D.clinic.bloques[d.getDay()]) return key(d); } return key(addDays(today(), 1)); }

  /* ---------- Página: Agenda ---------- */
  function pageAgenda() {
    const k = UI.agendaDay || tk();
    const pf = UI.agendaProf;
    const profsShown = pf === 'all' ? D.profs : D.profs.filter(p => p.id === pf);
    const list = apptsOn(k, pf);
    const wd = fromKey(k).getDay();
    const strip = Array.from({ length: 15 }, (_, i) => addDays(today(), i - 1)).map(d => { const kk = key(d); const n = apptsOn(kk, pf).length; const closed = !D.clinic.bloques[d.getDay()]; return `<button class="daychip ${kk === k ? 'on' : ''} ${kk === tk() ? 'today' : ''} ${closed ? 'closed' : ''}" data-act="agenda-day" data-k="${kk}"><span class="dn">${kk === tk() ? 'hoy' : WD[d.getDay()]}</span><span class="dd">${d.getDate()}</span><span class="dc">${closed ? '' : n ? n + ' t.' : 'libre'}</span></button>`; }).join('');
    const chips = `<button class="fchip ${pf === 'all' ? 'on' : ''}" data-act="agenda-prof" data-p="all">Todos</button>` + D.profs.map(p => `<button class="fchip ${pf === p.id ? 'on' : ''}" data-act="agenda-prof" data-p="${p.id}"><i style="background:var(--${p.color === 'teal' ? 'teal' : p.color})"></i>${p.corto}</button>`).join('');
    const free = D.clinic.bloques[wd] ? findSlots({ servicio: 'consulta', day: k, prof: pf === 'all' ? null : pf, limit: 8 }) : [];

    // Vista celular: lista
    const mobile = `<div class="card agenda-mobile">
      ${!D.clinic.bloques[wd] ? '<div class="empty">La clínica está cerrada este día.</div>' : list.length ? `<div class="tl">${list.map(a => { const p = patient(a.patientId), sv = servicio(a.servicio); const cls = a.status === 'atendido' ? 'done' : ''; return `<button class="tl-item ${UI.highlight === a.id ? 'flash' : ''}" data-act="appt" data-id="${a.id}"><div class="time">${hhmm(a.start)}<small>${hhmm(a.start + a.dur)}</small></div><div class="appt-card ${profColor(a.prof)} ${cls}"><div class="ac-top"><div class="ac-name">${esc(p.nombre)}</div>${statusChip(a.status)}</div><div class="ac-meta">${esc(sv.nombre)} · ${esc(prof(a.prof).corto)} · ${esc(cobLabel(p))}</div>${a.source === 'whatsapp' ? `<div class="ac-tags"><span class="chip wa">${ic('chat')}Agendó Clara</span></div>` : ''}</div></button>`; }).join('')}</div>` : '<div class="empty">Sin turnos este día.</div>'}
      ${free.length ? `<div class="cardhead" style="padding-top:6px"><div><h2>Horarios libres</h2><div class="sub">Tocá uno para agendar</div></div></div><div class="slotgrid" style="padding:0 16px 16px">${free.map(o => `<button data-act="new-appt" data-k="${o.date}" data-t="${o.start}" data-p="${o.prof}">${hhmm(o.start)}</button>`).join('')}</div>` : ''}
    </div>`;

    // Vista escritorio: grilla por profesional
    const H0 = 480, H1 = 1140, CELL = 32;
    const blocks = D.clinic.bloques[wd] || [];
    const isOpen = (p, t) => p.dias.includes(wd) && blocks.some(([b0, b1]) => t >= b0 && t < b1);
    const rows = (H1 - H0) / 30;
    const nm = nowMin();
    const grid = `<div class="card grid-view" style="overflow:hidden"><div class="ag-grid" style="grid-template-columns:58px repeat(${profsShown.length}, minmax(160px,1fr))">
      <div class="ag-colhead" style="border-right:1px solid var(--line)"></div>
      ${profsShown.map(p => `<div class="ag-colhead"><span class="avatar ${p.color === 'teal' ? '' : p.color}" style="width:30px;height:30px;font-size:11px">${p.ini}</span><div>${p.corto}<small>${p.esp}</small></div></div>`).join('')}
      <div class="ag-hours">${Array.from({ length: rows / 2 }, (_, i) => `<div class="ag-hour">${hhmm(H0 + i * 60)}</div>`).join('')}</div>
      ${profsShown.map(p => `<div class="ag-col">${Array.from({ length: rows }, (_, i) => { const t = H0 + i * 30; const open = isOpen(p, t) && !(k < tk() || (k === tk() && t + 30 <= nm)); return open ? `<button class="ag-cell" data-act="new-appt" data-k="${k}" data-t="${t}" data-p="${p.id}" aria-label="Agendar ${hhmm(t)}"></button>` : '<div class="ag-cell off"></div>'; }).join('')}
        ${apptsOn(k, p.id).map(a => { const pt = patient(a.patientId); return `<button class="grid-appt ${profColor(a.prof)} ${a.status === 'atendido' ? 'done' : ''} ${UI.highlight === a.id ? 'flash' : ''}" style="top:${(a.start - H0) / 30 * CELL + 1}px;height:${a.dur / 30 * CELL - 3}px" data-act="appt" data-id="${a.id}"><span class="gi">${a.source === 'whatsapp' ? '<i style="background:#25d366"></i>' : ''}${a.status === 'por_confirmar' ? '<i style="background:#e0a32e"></i>' : ''}${a.status === 'pendiente' ? '<i style="background:#3f6fa6"></i>' : ''}</span><b>${hhmm(a.start)} ${esc(pt.nombre)}</b><span>${esc(servicio(a.servicio).nombre)} · ${esc(cobLabel(pt))}</span></button>`; }).join('')}
        ${k === tk() && nm > H0 && nm < H1 ? `<div class="nowline" style="top:${(nm - H0) / 30 * CELL}px"></div>` : ''}
      </div>`).join('')}
    </div></div>`;

    // Vista semana (escritorio)
    const d0 = fromKey(k); const monday = addDays(d0, -((d0.getDay() + 6) % 7));
    const week = `<div class="card week-view" style="overflow:hidden"><div class="wk">${Array.from({ length: 6 }, (_, i) => { const kk = key(addDays(monday, i)); const l = apptsOn(kk, pf); return `<div class="wk-day ${kk === tk() ? 'today' : ''}"><div class="wk-head"><span>${dayRel(kk)}</span><span class="muted">${l.length}</span></div>${l.map(a => `<button class="wk-appt ${profColor(a.prof)} ${a.status === 'atendido' ? 'done' : ''} ${UI.highlight === a.id ? 'flash' : ''}" data-act="appt" data-id="${a.id}"><b>${hhmm(a.start)} ${esc(patient(a.patientId).nombre)}</b>${esc(servicio(a.servicio).nombre)}</button>`).join('') || '<div class="empty small">—</div>'}</div>`; }).join('')}</div></div>`;

    return `
      <div class="pagehead"><div><h1>Agenda</h1><p>Turnos de recepción y los que agenda Clara por WhatsApp, todo junto.</p></div>
        <div class="actions"><div class="seg hide-m"><button class="${UI.agendaView === 'dia' ? 'on' : ''}" data-act="agenda-view" data-v="dia">Día</button><button class="${UI.agendaView === 'semana' ? 'on' : ''}" data-act="agenda-view" data-v="semana">Semana</button></div><button class="btn primary hide-m" data-act="new-appt" data-k="${k}">${ic('plus')}Nuevo turno</button></div></div>
      <div class="agenda-bar">
        <div class="datenav"><button class="iconbtn" data-act="agenda-shift" data-n="${UI.agendaView === 'semana' ? -7 : -1}" aria-label="Anterior">${ic('chevL')}</button><h2>${UI.agendaView === 'semana' ? 'Semana del ' + dm(key(monday)) : dayTitle(k)}</h2><button class="iconbtn" data-act="agenda-shift" data-n="${UI.agendaView === 'semana' ? 7 : 1}" aria-label="Siguiente">${ic('chevR')}</button>${k !== tk() ? '<button class="btn sm ghost" data-act="agenda-day" data-k="' + tk() + '">Hoy</button>' : ''}</div>
        <div class="chips">${chips}</div>
      </div>
      <div class="daystrip">${strip}</div>
      <div class="${UI.agendaView === 'semana' ? 'week-mode' : ''}">${mobile}${grid}${week}</div>
      <p class="tiny muted" style="margin-top:10px">Punto verde: lo agendó Clara · amarillo: falta que el paciente confirme · azul: espera aprobación de recepción.</p>`;
  }

  /* ---------- Página: WhatsApp ---------- */
  function convName(c) { return c.nombre || (c.patientId ? patient(c.patientId).nombre : c.tel); }
  function pageWhatsapp() {
    const convs = S.convs.slice().sort((a, b) => (b.needsHuman - a.needsHuman) || (b.updated - a.updated));
    const desktop = matchMedia('(min-width: 900px)').matches;
    if (!UI.inboxConv && desktop && convs.length) UI.inboxConv = convs[0].id;
    const cur = S.convs.find(c => c.id === UI.inboxConv);
    const listHTML = convs.map(c => { const last = c.msgs[c.msgs.length - 1] || { text: '' }; return `<button class="row tap ${cur && cur.id === c.id ? 'on' : ''}" data-act="open-conv" data-id="${c.id}"><div class="avatar ${c.needsHuman ? 'amber' : 'gray'}">${initials(convName(c))}</div><div class="grow"><div class="title">${esc(convName(c))}</div><div class="meta">${last.from === 'patient' ? '' : (last.from === 'staff' ? 'Vos: ' : 'Clara: ')}${esc(last.text.slice(0, 70))}</div></div><div style="text-align:right;display:grid;gap:4px;justify-items:end"><span class="tiny muted">${clock(c.updated)}</span>${c.needsHuman ? '<span class="chip red">Persona</span>' : c.mode === 'human' ? '<span class="chip">Recepción</span>' : '<span class="chip teal">Clara</span>'}</div></button>`; }).join('');
    return `
      <div class="pagehead"><div><h1>WhatsApp</h1><p>Un solo número. Clara responde y vos tomás el control cuando quieras.</p></div><div class="actions"><button class="btn ghost hide-m" data-act="phone-open">${ic('phone')}Probar como paciente</button></div></div>
      <div class="card inbox ${cur ? 'open' : ''}">
        <div class="inbox-list list">${listHTML || '<div class="empty">Sin conversaciones.</div>'}</div>
        <div class="inbox-conv">${cur ? convHTML(cur) : '<div class="empty" style="margin:auto">Elegí una conversación.</div>'}</div>
      </div>`;
  }
  function msgsHTML(c, side) {
    // side = 'clinic' (bandeja) o 'patient' (teléfono)
    return c.msgs.map(m => {
      if (m.from === 'sys') return `<div class="msg sys">${esc(m.text)}</div>`;
      const fromPatient = m.from === 'patient';
      const mine = side === 'clinic' ? !fromPatient : fromPatient;
      let tag = '';
      if (side === 'clinic' && !fromPatient) tag = m.from === 'staff' ? '<span class="m-tag tag-persona">Recepción (persona)</span>' : `<span class="m-tag tag-${m.agent}">Clara · agente de ${AGENTS[m.agent].n.toLowerCase()}</span>`;
      if (side === 'patient' && m.from === 'staff') tag = '<span class="m-tag tag-persona">Recepción</span>';
      return `<div class="msg ${mine ? 'out' : 'in'}">${tag}${esc(m.text)}<span class="m-time">${clock(m.t)}</span></div>`;
    }).join('');
  }
  function convHTML(c) {
    const p = c.patientId ? patient(c.patientId) : null;
    const foot = c.mode === 'human'
      ? `<form class="composer" id="staffform" data-id="${c.id}" autocomplete="off"><input id="staffinput" placeholder="Escribí como recepción…"><button class="sendbtn" aria-label="Enviar">${ic('send')}</button></form><div style="margin-top:8px;display:flex;gap:14px"><button class="linkbtn" data-act="give-back" data-id="${c.id}">${ic('bot', 'sm')}Devolver a Clara</button>${c.needsHuman ? `<button class="linkbtn" data-act="resolve" data-id="${c.id}">${ic('check', 'sm')}Marcar resuelto</button>` : ''}</div>`
      : `<div class="takeover"><div class="t-txt">${c.needsHuman ? `<b style="color:var(--red)">Necesita una persona:</b> ${esc(c.flagReason || '')}` : 'Clara está respondiendo sola.'}</div>${c.needsHuman ? `<button class="btn sm ghost" data-act="resolve" data-id="${c.id}">Resuelto</button>` : ''}<button class="btn sm primary" data-act="take-over" data-id="${c.id}">Tomar conversación</button></div>`;
    return `<div class="conv-head"><button class="iconbtn back-btn" data-act="close-conv" aria-label="Volver">${ic('chevL')}</button><div class="avatar gray">${initials(convName(c))}</div><div class="grow" style="min-width:0"><b>${esc(convName(c))}</b><div class="tiny muted">${esc(c.tel)}${p ? ' · ' + esc(cobLabel(p)) : ' · no está cargado'}</div></div>${p ? `<button class="btn sm ghost" data-act="patient" data-id="${p.id}">Ficha</button>` : ''}</div>
      <div class="conv-msgs" id="conv-msgs">${msgsHTML(c, 'clinic')}${UI.typing[c.id] ? '<div class="typing" style="align-self:flex-end"><i></i><i></i><i></i></div>' : ''}</div>
      <div class="conv-foot">${foot}</div>`;
  }

  /* ---------- Página: Pacientes ---------- */
  function pagePacientes() {
    const rows = S.patients.map(p => { const nx = upcoming(p.id)[0]; return `<button class="row tap" data-act="patient" data-id="${p.id}" data-name="${esc((p.nombre + ' ' + p.cob + ' ' + p.tel).toLowerCase())}"><div class="avatar gray">${initials(p.nombre)}</div><div class="grow"><div class="title">${esc(p.nombre)} ${p.nuevo ? '<span class="chip wa" style="margin-left:4px">Nuevo por WhatsApp</span>' : ''}</div><div class="meta">${esc(cobLabel(p))} · ${nx ? 'Próximo: ' + dayRel(nx.date) + ' ' + hhmm(nx.start) : 'Sin turnos próximos'}</div></div>${p.alergias ? `<span class="chip warn">${ic('alert')}${esc(p.alergias)}</span>` : ''}</button>`; }).join('');
    return `<div class="pagehead"><div><h1>Pacientes</h1><p>${S.patients.length} pacientes · datos ficticios</p></div><div class="actions"><button class="btn primary hide-m" data-act="new-appt">${ic('plus')}Nuevo turno</button></div></div>
      <div class="field" style="position:relative"><input id="psearch" placeholder="Buscar por nombre, obra social o teléfono" style="padding-left:40px" aria-label="Buscar paciente"><span style="position:absolute;left:12px;top:12px;color:var(--muted)">${ic('search')}</span></div>
      <div class="card list" id="plist">${rows}</div>`;
  }

  /* ---------- Página: Obras sociales ---------- */
  function issuesOf(x) {
    const r = [], sv = x.servicio;
    if (!x.firma || x.firma === 'pedido') r.push({ code: 'firma', text: 'Falta firma del paciente', fix: 'Pedir por WhatsApp', ask: true });
    if (x.cob === 'IAPOS') {
      if (!x.orden || x.orden === 'pedido') r.push({ code: 'orden', text: 'Falta orden de consulta', fix: 'Pedir por WhatsApp', ask: true });
      if (['limpieza', 'endodoncia', 'extraccion'].includes(sv) && (!x.bono || x.bono === 'pedido')) r.push({ code: 'bono', text: 'Falta bono asistencial', fix: 'Pedir por WhatsApp', ask: true });
    }
    if (sv === 'endodoncia') { if (!x.rxPre) r.push({ code: 'rxPre', text: 'Falta RX pre', fix: 'Adjuntar RX' }); if (!x.rxPost) r.push({ code: 'rxPost', text: 'Falta RX post', fix: 'Adjuntar RX' }); }
    if (['endodoncia', 'extraccion'].includes(sv) && !x.pieza) r.push({ code: 'pieza', text: 'Falta pieza / cara', fix: 'Completar pieza' });
    if (x.cob === 'Sancor Salud' && sv === 'endodoncia' && (!x.autorizacion || x.autorizacion === 'pedido')) r.push({ code: 'autorizacion', text: 'Falta autorización previa', fix: 'Pedir autorización' });
    if (x.frecuencia === false) r.push({ code: 'frecuencia', text: 'Supera la frecuencia (ej.: 1 limpieza cada 6 meses; la última fue hace 4)', fix: 'Pasar a particular' });
    return r;
  }
  const DEB = {
    rx: { label: 'Falta radiografía', rec: true, accion: 'Adjuntar la RX y reclamar', doc: 'radiografía post-conductometría' },
    firma: { label: 'Falta firma del paciente', rec: true, accion: 'Conseguir la firma y refacturar', doc: 'planilla firmada por el afiliado' },
    codigo: { label: 'Código mal cargado', rec: true, accion: 'Corregir el código y refacturar', doc: 'odontograma con la pieza correcta' },
    afiliado: { label: 'Afiliado no activo a la fecha', rec: false, accion: 'Cobrarle al paciente', doc: '' },
    frecuencia: { label: 'Supera la frecuencia permitida', rec: false, accion: 'Cobrar al paciente si firmó conformidad', doc: '' },
    nocubre: { label: 'No cubierto por el plan', rec: false, accion: 'Cobrarle al paciente', doc: '' }
  };
  function pageObras() {
    const pres = S.prestaciones.filter(x => !x.excluded);
    const total = pres.reduce((s, x) => s + x.monto, 0);
    const checked = pres.some(x => x.checked);
    const withIss = pres.filter(x => issuesOf(x).length);
    const debTot = S.debitos.reduce((s, x) => s + x.monto, 0);
    const recTot = S.debitos.filter(x => DEB[x.cat].rec).reduce((s, x) => s + x.monto, 0);
    const prevMes = MES[new Date(today().getFullYear(), today().getMonth() - 1, 1).getMonth()];
    let body = '';
    if (UI.osTab === 'pre') {
      body = `<div class="card"><div class="cardhead"><div><h2>Prestaciones de ${prevMes}</h2><div class="sub">${pres.length} prestaciones · ${money(total)} para presentar</div></div><button class="btn primary sm" data-act="run-precheck" ${UI.checking ? 'disabled' : ''}>${ic('sparkle', 'sm')}${UI.checking ? 'Revisando…' : checked ? 'Revisar de nuevo' : 'Revisar con IA'}</button></div>
        ${!checked ? `<div style="padding:0 16px 12px"><div class="note">El agente de facturación compara cada prestación con las normas de la obra social (papeles, firmas, radiografías, topes y autorizaciones) <b>antes</b> de presentar, para que no vuelva como débito. Tocá <b>Revisar con IA</b>.</div></div>` : ''}
        <div class="list">${pres.map(x => { const p = patient(x.patientId), sv = servicio(x.servicio), iss = issuesOf(x); const st = !x.checked ? '<span class="chip">Sin revisar</span>' : iss.length ? `<span class="chip warn">${iss.length} faltante${iss.length > 1 ? 's' : ''}</span>` : `<span class="chip ok">${ic('check')}Lista</span>`;
          return `<div class="attn"><div class="a-ico ${!x.checked ? 'teal' : iss.length ? '' : 'teal'}">${!x.checked ? ic('file') : iss.length ? ic('alert') : ic('check')}</div><div class="a-body"><div style="display:flex;justify-content:space-between;gap:8px"><div class="a-title">${esc(p.nombre)}</div><span class="money small">${money(x.monto)}</span></div><div class="a-text">${esc(sv.nombre)}${x.pieza ? ' · pieza ' + x.pieza : ''} · ${esc(x.cob)} · ${dm(x.fecha)} · ${esc(prof(x.prof).corto)}</div><div style="margin-top:6px">${st}</div>
          ${x.checked && iss.length ? `<div class="a-actions">${iss.map(i => { const pend = x[i.code] === 'pedido'; return `<div style="display:flex;align-items:center;gap:8px;width:100%;flex-wrap:wrap"><span class="small" style="flex:1;min-width:150px">• ${esc(i.text)}${pend ? ' <span class="chip blue">Pedido al paciente</span>' : ''}</span>${pend ? `<button class="btn sm ghost" data-act="fix" data-id="${x.id}" data-code="${i.code}" data-done="1">Marcar recibido</button>` : `<button class="btn sm soft" data-act="fix" data-id="${x.id}" data-code="${i.code}">${esc(i.fix)}</button>`}</div>`; }).join('')}</div>` : ''}</div></div>`; }).join('')}</div>
        ${checked ? `<div style="padding:12px 16px 16px;display:flex;gap:8px;flex-wrap:wrap;align-items:center"><button class="btn primary" data-act="build-batch" ${withIss.length ? 'disabled' : ''}>${ic('file')}Armar lote para presentar</button><span class="small muted">${withIss.length ? `Faltan resolver ${withIss.length}. Las listas ya se pueden presentar.` : 'Todo listo para presentar.'}</span></div>` : ''}
      </div>`;
    } else if (UI.osTab === 'deb') {
      const classified = S.debitos.some(d => d.classified);
      body = `<div class="card"><div class="cardhead"><div><h2>Débitos de la liquidación de ${S.debitosMes}</h2><div class="sub">${S.debitos.length} débitos · ${money(debTot)}</div></div><button class="btn primary sm" data-act="run-debitos">${ic('sparkle', 'sm')}${classified ? 'Ordenar de nuevo' : 'Ordenar con IA'}</button></div>
        ${!classified ? `<div style="padding:0 16px 12px"><div class="note">Así llegan los débitos: un código y un texto corto. El agente los ordena por motivo, separa los que se pueden reclamar y te arma el borrador del reclamo. Siempre lo revisa y lo manda una persona.</div></div>` : ''}
        <div class="list">${S.debitos.map(d => { const p = patient(d.patientId), cat = DEB[d.cat]; return `<div class="attn"><div class="a-ico ${!d.classified ? 'teal' : cat.rec ? 'teal' : 'red'}">${ic(d.classified ? (cat.rec ? 'refresh' : 'x') : 'receipt')}</div><div class="a-body"><div style="display:flex;justify-content:space-between;gap:8px"><div class="a-title">${esc(p.nombre)} · ${esc(servicio(d.servicio).nombre)}</div><span class="money small">${money(d.monto)}</span></div><div class="a-text">${esc(d.cob)} · <span style="font-family:ui-monospace,monospace;font-size:11.5px">${esc(d.raw)}</span></div>
          ${d.classified ? `<div class="a-actions"><span class="chip ${cat.rec ? 'ok' : 'red'}">${cat.rec ? 'Se puede reclamar' : 'No se recupera'}</span><span class="chip">${esc(cat.label)}</span></div><div class="small" style="margin-top:6px">→ ${esc(cat.accion)}</div>${cat.rec ? `<div class="a-actions">${d.estado === 'enviado' ? `<span class="chip blue">${ic('check')}Reclamo listo para enviar</span>` : `<button class="btn sm soft" data-act="claim" data-id="${d.id}">Ver borrador del reclamo</button>`}</div>` : `<div class="a-actions"><button class="btn sm ghost" data-act="charge" data-id="${d.id}">${d.estado === 'cobrar' ? 'Avisado al paciente ✓' : 'Avisar al paciente'}</button></div>`}` : ''}
          </div></div>`; }).join('')}</div></div>`;
    } else {
      body = `<div class="stack">${Object.values(D.coberturas).filter(c => c.nombre !== 'Particular').map(c => `<div class="card pad"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><h2 style="font-size:16px">${esc(c.nombre)}</h2><span class="chip teal">${esc(c.via)}</span></div><p class="small" style="margin:8px 0">${esc(c.general)}</p><div class="small"><b>Qué trae el paciente (consulta):</b> ${esc((c.traer.consulta || c.traer._default).join(' · '))}</div>${c.tip ? `<div class="small muted" style="margin-top:6px">💡 ${esc(c.tip)}</div>` : ''}<div class="small muted" style="margin-top:6px">No cubre: ${esc(c.noCubre.map(id => servicio(id).nombre).join(', ') || '—')}</div></div>`).join('')}
        <div class="note warn">Estas fichas son <b>ejemplos</b>. En el producto real, cada clínica carga las normas vigentes de su círculo o colegio y de cada obra social (topes, papeles, radiografías), y la secretaria las corrige cuando cambian. De ahí sale lo que dice el agente.</div></div>`;
    }
    return `<div class="pagehead"><div><h1>Obras sociales</h1><p>Revisar antes de presentar y recuperar los débitos.</p></div></div>
      <div class="kpis">
        <div class="card kpi"><div class="k-top"><span class="k-ico">${ic('file')}</span>Para presentar</div><div class="k-num">${money(total)}</div><div class="k-sub">${pres.length} prestaciones de ${prevMes}</div></div>
        <div class="card kpi warn"><div class="k-top"><span class="k-ico">${ic('alert')}</span>Con faltantes</div><div class="k-num">${checked ? withIss.length : '—'}</div><div class="k-sub">${checked ? money(withIss.reduce((s, x) => s + x.monto, 0)) + ' en riesgo' : 'Falta revisar'}</div></div>
        <div class="card kpi red"><div class="k-top"><span class="k-ico">${ic('receipt')}</span>Débitos último mes</div><div class="k-num">${money(debTot)}</div><div class="k-sub">${S.debitos.length} prestaciones</div></div>
        <div class="card kpi blue"><div class="k-top"><span class="k-ico">${ic('refresh')}</span>Se pueden reclamar</div><div class="k-num">${money(recTot)}</div><div class="k-sub">${S.debitos.filter(x => DEB[x.cat].rec).length} débitos</div></div>
      </div>
      <div class="seg" style="margin-bottom:12px;display:flex;width:fit-content;max-width:100%;overflow-x:auto"><button class="${UI.osTab === 'pre' ? 'on' : ''}" data-act="os-tab" data-t="pre">Antes de presentar</button><button class="${UI.osTab === 'deb' ? 'on' : ''}" data-act="os-tab" data-t="deb">Débitos</button><button class="${UI.osTab === 'reglas' ? 'on' : ''}" data-act="os-tab" data-t="reglas">Reglas</button></div>
      ${body}`;
  }

  /* ---------- Página: Agentes ---------- */
  function pageAgentes() {
    const count = a => S.activity.filter(x => x.agent === a).length;
    const card = (id, title, desc, hace, noHace, btn) => `<div class="card agent"><div class="ag-head">${agentBadge(id).replace('agent-badge', 'agent-badge')}<div style="flex:1"><h3>${title}</h3><div class="small muted">${desc}</div></div></div>
      <ul>${hace.map(x => `<li>${x}</li>`).join('')}</ul><div class="small muted" style="margin-top:8px"><b>No hace:</b> ${noHace}</div>
      <div class="ag-foot"><span class="small muted">${count(id)} acciones hoy</span><div style="display:flex;gap:10px;align-items:center">${btn || ''}<button class="toggle ${S.cfg.agents[id] ? 'on' : ''}" data-act="toggle-agent" data-id="${id}" aria-label="Encender o apagar ${title}"></button></div></div></div>`;
    return `<div class="pagehead"><div><h1>Agentes de IA</h1><p>Un solo número de WhatsApp. Varios agentes especializados atrás. Lo que importa lo aprueba una persona.</p></div></div>
      <div class="card" style="margin-bottom:14px"><div class="cardhead"><h2>Cómo trabajan juntos</h2></div><div class="flow"><span class="step">📱 El paciente escribe</span><span class="arrow">→</span><span class="step">Recepción entiende y agenda</span><span class="arrow">→</span><span class="step">Coberturas verifica y dice qué traer</span><span class="arrow">→</span><span class="step">Recordatorios confirma el día antes</span><span class="arrow">→</span><span class="step">Facturación revisa antes de presentar</span><span class="arrow">→</span><span class="step">👩‍⚕️ La clínica aprueba</span></div></div>
      <div class="agents">
        ${card('recepcion', 'Recepción', 'Atiende el WhatsApp de la clínica las 24 horas.', ['Da turnos mirando la agenda real de cada profesional', 'Responde qué horarios tiene un profesional un día', 'Cancela y reprograma', 'Detecta urgencias y avisa a una persona'], 'diagnósticos, indicaciones médicas ni precios de tratamientos sin evaluación.', `<button class="btn sm ghost" data-act="phone-open">Probar</button>`)}
        ${card('coberturas', 'Coberturas', 'Sabe las reglas de cada obra social que carga la clínica.', ['Pide obra social y número de afiliado', 'Verifica el padrón (en la demo, simulado)', 'Dice cuántas órdenes o bonos traer y si conviene sacarlos en la app (ej.: Mi IAPOS)', 'Avisa si algo no está cubierto'], 'compra bonos ni entra a portales de obras sociales con usuario y contraseña.', `<button class="btn sm ghost" data-act="phone-open" data-say="Tengo IAPOS, ¿qué tengo que llevar para una limpieza?">Probar</button>`)}
        ${card('recordatorios', 'Recordatorios', 'Baja el ausentismo sin que nadie llame.', ['Escribe el día anterior con qué traer', 'Marca quién confirmó en la agenda', 'Si piden cambiar, ofrece otro horario'], 'mensajes de marketing sin consentimiento.', `<button class="btn sm ghost" data-act="run-reminders">Enviar ahora</button>`)}
        ${card('facturacion', 'Facturación y débitos', 'Donde está la plata: que no te rechacen prestaciones.', ['Revisa cada prestación contra las normas antes de presentar', 'Pide al paciente la firma, orden o bono que falta', 'Ordena los débitos por motivo y arma el borrador del reclamo'], 'presenta ni reclama sin que una persona lo apruebe.', `<button class="btn sm ghost" data-act="go" data-page="obras">Ver</button>`)}
        ${card('historia', 'Historia clínica', 'Asistente del profesional, nunca reemplazo.', ['Resume al paciente antes del turno (alergias, últimas visitas, qué falta)', 'Ordena una evolución dictada en un borrador prolijo'], 'firma ni guarda nada en la historia sin la firma del profesional.', `<button class="btn sm ghost" data-act="patient" data-id="p1">Probar</button>`)}
        <div class="card agent"><div class="ag-head"><span class="agent-badge ag-persona">${ic('shield')}</span><div><h3>Límites y datos de salud</h3><div class="small muted">Lo que se le promete a la clínica</div></div></div><ul><li>Clara dice que es una IA y deriva a una persona cuando hace falta</li><li>Al modelo se manda lo mínimo: práctica, pieza, fecha y obra social, nunca la historia completa</li><li>Base registrada ante la AAIP y contrato de tratamiento de datos con cada clínica</li><li>Registro de accesos, cifrado y respaldos</li></ul></div>
      </div>`;
  }

  /* ---------- Página: Finanzas ---------- */
  function pageFinanzas() {
    const pres = S.prestaciones.reduce((s, x) => s + x.monto, 0);
    return `<div class="pagehead"><div><h1>Finanzas</h1><p>Cobros, saldos y cuándo pagan las obras sociales. Datos ficticios.</p></div></div>
      <div class="kpis">
        <div class="card kpi"><div class="k-top"><span class="k-ico">${ic('wallet')}</span>Cobrado este mes</div><div class="k-num">$ 3.840.000</div><div class="k-sub">↑ 12% vs. mes anterior</div></div>
        <div class="card kpi warn"><div class="k-top"><span class="k-ico">${ic('user')}</span>Saldos de pacientes</div><div class="k-num">$ 615.000</div><div class="k-sub">9 pacientes</div></div>
        <div class="card kpi blue"><div class="k-top"><span class="k-ico">${ic('shield')}</span>A cobrar de obras sociales</div><div class="k-num">${money(pres + 2140000)}</div><div class="k-sub">Pagan a 60–90 días</div></div>
        <div class="card kpi"><div class="k-top"><span class="k-ico">${ic('receipt')}</span>Facturas ARCA</div><div class="k-num">42</div><div class="k-sub">Este mes (demo)</div></div>
      </div>
      <div class="grid-main"><div class="card"><div class="cardhead"><h2>Últimos cobros</h2></div><div class="list">
        ${[['Camila Torres', 'Particular · Transferencia', 42000], ['Mateo Ríos', 'OSDE 310 · Coseguro', 15000], ['Tomás Acosta', 'Swiss Medical · Coseguro', 28500], ['Clara Díaz', 'Particular · Mercado Pago', 96000], ['Valentina Paz', 'IAPOS · Bono digital validado', 0]].map(([n, m, v]) => `<div class="row"><div class="avatar gray">${initials(n)}</div><div class="grow"><div class="title">${n}</div><div class="meta">${m}</div></div><span class="money">${v ? money(v) : '—'}</span></div>`).join('')}
      </div></div>
      <div class="card pad"><h2 style="font-size:15.5px;margin-bottom:10px">Deuda de obras sociales por antigüedad</h2>
        ${[['0–30 días', 54], ['31–60 días', 28], ['61–90 días', 12], ['Más de 90 días', 6]].map(([l, v], i) => `<div class="small" style="display:flex;justify-content:space-between"><span>${l}</span><b>${v}%</b></div><div class="bar"><i style="width:${v}%;background:${['var(--teal)', 'var(--blue)', '#d99a2b', 'var(--red)'][i]}"></i></div>`).join('')}
        <div class="note">Lo de más de 90 días es la primera señal de que una obra social se está atrasando o de que algo se rechazó sin que nadie lo reclamara.</div></div></div>`;
  }

  /* ---------- Página: Configuración ---------- */
  function pageConfig() {
    return `<div class="pagehead"><div><h1>Configuración</h1><p>Cómo trabaja Clara en esta clínica.</p></div></div>
      <div class="grid-main"><div class="stack">
        <div class="card pad"><div style="display:flex;gap:12px;align-items:center"><div style="flex:1"><h2 style="font-size:15.5px">Turnos que agenda Clara</h2><div class="small muted" style="margin-top:3px">${S.cfg.autoConfirm ? 'Se confirman solos. Recepción ve todo en la agenda.' : 'Quedan "a aprobar" hasta que recepción los acepta.'}</div></div><button class="toggle ${S.cfg.autoConfirm ? 'on' : ''}" data-act="toggle-auto" aria-label="Confirmar automáticamente"></button></div></div>
        <div class="card"><div class="cardhead"><h2>Profesionales</h2></div><div class="list">${D.profs.map(p => `<div class="row"><div class="avatar ${p.color === 'teal' ? '' : p.color}">${p.ini}</div><div class="grow"><div class="title">${p.nombre}</div><div class="meta">${p.esp} · ${p.dias.map(d => WD[d]).join(', ')}</div></div></div>`).join('')}</div></div>
        <div class="card pad"><h2 style="font-size:15.5px;margin-bottom:8px">Clínica</h2><dl class="kv"><dt>Nombre</dt><dd>${D.clinic.nombre}</dd><dt>Dirección</dt><dd>${D.clinic.direccion}</dd><dt>Horarios</dt><dd>${D.clinic.horarios}</dd></dl></div>
      </div><div class="stack">
        <div class="card pad"><h2 style="font-size:15.5px;margin-bottom:8px">Para usarlo de verdad</h2><div class="small" style="line-height:1.7">• Número de WhatsApp de la clínica conectado a la API oficial de Meta, con plantillas aprobadas.<br>• Reglas de 3 a 5 obras sociales cargadas por la clínica.<br>• Contrato de tratamiento de datos con la clínica y registro de la base ante la AAIP.<br>• Revisión de un abogado antes del primer cobro.</div></div>
        <div class="card pad"><h2 style="font-size:15.5px;margin-bottom:8px">Demostración</h2><p class="small muted" style="margin:0 0 12px">Los cambios que hacés se guardan solo en este navegador. Reiniciar vuelve todo al estado inicial.</p><button class="btn danger" data-act="reset-demo">${ic('refresh')}Reiniciar demo</button></div>
      </div></div>`;
  }

  /* ---------- Render principal ---------- */
  const RENDER = { hoy: pageHoy, agenda: pageAgenda, whatsapp: pageWhatsapp, pacientes: pagePacientes, obras: pageObras, agentes: pageAgentes, finanzas: pageFinanzas, config: pageConfig };
  function render() {
    renderNav();
    const v = $('#view');
    v.innerHTML = RENDER[UI.page]();
    hydrate(v);
    if (UI.page === 'whatsapp') { const m = $('#conv-msgs'); if (m) m.scrollTop = m.scrollHeight; }
    S.activity.forEach(x => { x.fresh = false; });
  }
  function refresh() {
    renderNav();
    const ae = document.activeElement;
    const typingInView = ae && $('#view').contains(ae) && /INPUT|TEXTAREA|SELECT/.test(ae.tagName);
    if (typingInView) {
      if (UI.page === 'whatsapp') { const c = S.convs.find(x => x.id === UI.inboxConv); const m = $('#conv-msgs'); if (c && m) { m.innerHTML = msgsHTML(c, 'clinic'); m.scrollTop = m.scrollHeight; } }
    } else {
      const y = window.scrollY; render(); window.scrollTo(0, y);
    }
    renderPhone();
    if (UI.sheet && UI.sheet.refresh) UI.sheet.refresh();
  }

  /* ---------- Simulador del paciente ---------- */
  const SUGG = ['Hola', 'Quiero un turno para mañana a la tarde', '¿Qué turnos tiene la Dra. Quiroga el jueves?', 'Tengo IAPOS, ¿qué tengo que llevar para una limpieza?', 'Necesito cancelar mi turno', 'Quiero cambiar mi turno', 'Me duele mucho una muela', 'Quiero hablar con una persona'];
  function persona() { return D.personas.find(p => p.id === S.persona) || D.personas[0]; }
  function simConv() { const pe = persona(); return convFor(pe.tel, pe.patientId || (convByTel(pe.tel) || {}).patientId || null, pe.patientId ? patient(pe.patientId).nombre : null); }
  function renderPhone() {
    if (!$('#phonedock').classList.contains('open')) return;
    const c = convByTel(persona().tel);
    const msgs = c ? c.msgs : [];
    const box = $('#ph-msgs');
    box.innerHTML = `<div class="ph-intro">Estás del lado del <b>paciente</b>. Lo que escribas acá lo responde Clara y se refleja en el panel de la clínica.${matchMedia('(min-width: 900px)').matches ? ' Mirá la agenda a la izquierda.' : ''}</div>` + (c ? msgsHTML(c, 'patient') : '') + (c && UI.typing[c.id] ? '<div class="typing"><i></i><i></i><i></i></div>' : '');
    box.scrollTop = box.scrollHeight;
    $('#ph-status').textContent = c && c.mode === 'human' ? 'en línea · te atiende recepción' : (c && UI.typing[c.id] ? 'escribiendo…' : 'en línea · responde Clara (IA)');
  }
  function openPhone(say) {
    $('#phonedock').classList.add('open'); $('#phonedock').setAttribute('aria-hidden', 'false');
    document.body.classList.add('dock-open');
    $('#ph-persona').innerHTML = D.personas.map(p => `<option value="${p.id}" ${p.id === S.persona ? 'selected' : ''}>${p.label}${p.patientId ? ' (' + patient(p.patientId).cob + ')' : ''}</option>`).join('');
    $('#ph-sugg').innerHTML = SUGG.map(s => `<button type="button" data-act="say" data-text="${esc(s)}">${esc(s)}</button>`).join('');
    renderPhone();
    if (S.flags.bannerOff !== true) { S.flags.bannerOff = true; save(); }
    if (UI.page === 'hoy') { const y = window.scrollY; render(); window.scrollTo(0, y); }
    if (matchMedia('(min-width: 900px)').matches && UI.page !== 'agenda' && UI.page !== 'whatsapp' && !say) go('agenda');
    if (say) setTimeout(() => sendFromPhone(say), 250);
    else if (matchMedia('(min-width: 900px)').matches) setTimeout(() => $('#ph-input').focus(), 60);
  }
  function closePhone() { $('#phonedock').classList.remove('open'); $('#phonedock').setAttribute('aria-hidden', 'true'); document.body.classList.remove('dock-open'); }
  function sendFromPhone(text) {
    text = (text || '').trim(); if (!text) return;
    const c = simConv();
    if (!c.nombre && c.patientId) c.nombre = patient(c.patientId).nombre;
    incoming(c, text);
  }

  /* ---------- Hojas (detalle y formularios) ---------- */
  function openSheet(title, bodyFn, footFn, opts = {}) {
    UI.sheet = { title, bodyFn, footFn, refresh: () => paintSheet() };
    paintSheet();
    $('#sheet').classList.add('open'); $('#sheetbg').classList.add('open');
    if (!opts.keepScroll) $('#sheet .sheet-body').scrollTop = 0;
  }
  function paintSheet() {
    if (!UI.sheet) return;
    const body = $('#sheet-inner'); const sb = body.querySelector('.sheet-body'); const top = sb ? sb.scrollTop : 0;
    const ae = document.activeElement; if (ae && body.contains(ae) && /INPUT|TEXTAREA/.test(ae.tagName) && !UI.sheet.force) return;
    UI.sheet.force = false;
    const foot = UI.sheet.footFn ? UI.sheet.footFn() : '';
    body.innerHTML = `<div class="sheet-head"><h2>${UI.sheet.title}</h2><button class="iconbtn" data-act="sheet-close" aria-label="Cerrar">${ic('x')}</button></div><div class="sheet-body">${UI.sheet.bodyFn()}</div>${foot ? `<div class="sheet-foot">${foot}</div>` : ''}`;
    $('#sheet-inner .sheet-body').scrollTop = top;
  }
  function closeSheet(silent) { UI.sheet = null; $('#sheet').classList.remove('open'); $('#sheetbg').classList.remove('open'); }

  function showAppt(id) {
    const a = appt(id); if (!a) return;
    closePhone();
    UI.agendaDay = a.date; UI.highlight = id;
    if (UI.page !== 'agenda') go('agenda'); else render();
    setTimeout(() => { const el = document.querySelector(`[data-id="${id}"].grid-appt, [data-id="${id}"].tl-item`); if (el && el.offsetParent) el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 80);
    setTimeout(() => { if (UI.highlight === id) UI.highlight = null; }, 6000);
  }

  function apptSheet(id) {
    openSheet('Turno', () => {
      const a = appt(id); const p = patient(a.patientId), sv = servicio(a.servicio), c = D.coberturas[p.cob];
      const conv = convByTel(p.tel);
      return `<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px"><div class="avatar gray" style="width:44px;height:44px">${initials(p.nombre)}</div><div style="flex:1"><div style="font:800 18px var(--display)">${esc(p.nombre)}</div><div class="small muted">${esc(p.tel)}</div></div>${statusChip(a.status)}</div>
        ${p.alergias ? `<div class="note warn" style="margin-bottom:12px">${ic('alert', 'sm')} <b>Alergia:</b> ${esc(p.alergias)}</div>` : ''}
        <dl class="kv"><dt>Cuándo</dt><dd>${dayTitle(a.date)} · ${hhmm(a.start)} a ${hhmm(a.start + a.dur)}</dd><dt>Profesional</dt><dd>${esc(prof(a.prof).nombre)}</dd><dt>Prestación</dt><dd>${esc(sv.nombre)} <span class="muted small">(${sv.cod})</span></dd><dt>Cobertura</dt><dd>${esc(cobLabel(p))}${p.afiliado ? ` · <span class="muted">${esc(p.afiliado)}</span>` : ''}</dd><dt>Origen</dt><dd>${a.source === 'whatsapp' ? '<span class="chip wa">' + ic('chat') + 'Lo agendó Clara por WhatsApp</span>' : 'Recepción'}</dd></dl>
        <div class="section-t">Qué tiene que traer</div>
        <div class="checklist">${(a.traer || []).map((t, i) => `<button class="check ${a.traerOk.includes(i) ? 'on' : ''}" data-act="traer" data-id="${a.id}" data-i="${i}"><span class="cb">${ic('check', 'sm')}</span>${esc(t)}</button>`).join('')}</div>
        <p class="tiny muted">Se lo dijo el agente de coberturas al sacar el turno y se lo recuerda el día anterior. Recepción tilda al llegar.</p>
        ${c && c.nombre !== 'Particular' ? `<div class="note" style="margin-top:10px"><b>${esc(c.nombre)}:</b> ${esc(c.general)}</div>` : ''}
        <div class="section-t">Acciones</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${conv ? `<button class="btn sm ghost" data-act="open-conv" data-id="${conv.id}">${ic('chat', 'sm')}Ver chat</button>` : ''}
          <button class="btn sm ghost" data-act="patient" data-id="${p.id}">${ic('user', 'sm')}Ficha</button>
          ${a.status === 'por_confirmar' ? `<button class="btn sm ghost" data-act="remind-one" data-id="${a.id}">${ic('bell', 'sm')}Recordar por WhatsApp</button>` : ''}
          ${!['cancelado', 'atendido'].includes(a.status) ? `<button class="btn sm danger" data-act="appt-status" data-id="${a.id}" data-s="cancelado">Cancelar turno</button>` : ''}
        </div>`;
    }, () => {
      const a = appt(id);
      if (a.status === 'pendiente') return `<button class="btn ghost" data-act="appt-status" data-id="${a.id}" data-s="cancelado">Rechazar</button><button class="btn primary" data-act="appt-status" data-id="${a.id}" data-s="confirmado">Aprobar turno</button>`;
      if (a.status === 'por_confirmar') return `<button class="btn primary" data-act="appt-status" data-id="${a.id}" data-s="confirmado">Marcar confirmado</button>`;
      if (a.status === 'confirmado') return `<button class="btn primary" data-act="appt-status" data-id="${a.id}" data-s="llego">Llegó el paciente</button>`;
      if (a.status === 'llego') return `<button class="btn primary" data-act="appt-status" data-id="${a.id}" data-s="atendido">Marcar atendido</button>`;
      return '';
    });
  }

  function newApptSheet(pre = {}) {
    UI.form = { patientId: pre.patientId || '', nuevoNombre: '', nuevoCob: 'Particular', servicio: pre.servicio || 'consulta', prof: pre.prof || '', date: pre.date || tk(), start: pre.start != null ? +pre.start : null, slotProf: pre.prof || null };
    openSheet('Nuevo turno', () => {
      const f = UI.form;
      const sv = servicio(f.servicio);
      const slots = findSlots({ servicio: f.servicio, prof: f.prof || null, day: f.date, limit: 40 });
      if (f.start != null && !slots.some(o => o.start === f.start && (!f.slotProf || o.prof === f.slotProf))) { /* el horario precargado puede no servir para esta prestación */ }
      return `<div class="field"><label for="f-pat">Paciente</label><select id="f-pat" data-f="patientId"><option value="">— Elegí un paciente —</option><option value="__new" ${f.patientId === '__new' ? 'selected' : ''}>+ Paciente nuevo</option>${S.patients.map(p => `<option value="${p.id}" ${f.patientId === p.id ? 'selected' : ''}>${esc(p.nombre)} · ${esc(p.cob)}</option>`).join('')}</select></div>
        ${f.patientId === '__new' ? `<div class="two"><div class="field"><label>Nombre y apellido</label><input data-f="nuevoNombre" value="${esc(f.nuevoNombre)}" placeholder="Ej.: Ana López"></div><div class="field"><label>Cobertura</label><select data-f="nuevoCob">${Object.keys(D.coberturas).map(k => `<option ${f.nuevoCob === k ? 'selected' : ''}>${k}</option>`).join('')}</select></div></div>` : ''}
        <div class="two"><div class="field"><label>Prestación</label><select data-f="servicio">${D.servicios.map(s => `<option value="${s.id}" ${f.servicio === s.id ? 'selected' : ''}>${s.nombre}</option>`).join('')}</select></div>
        <div class="field"><label>Profesional</label><select data-f="prof"><option value="">Cualquiera</option>${D.profs.filter(p => sv.profs.includes(p.id)).map(p => `<option value="${p.id}" ${f.prof === p.id ? 'selected' : ''}>${p.corto}</option>`).join('')}</select></div></div>
        <div class="field"><label>Día</label><input type="date" data-f="date" value="${f.date}" min="${tk()}"></div>
        <label class="small" style="font-weight:700;color:var(--ink2);display:block;margin-bottom:6px">Horario libre (${sv.dur} min)</label>
        ${slots.length ? `<div class="slotgrid">${slots.map(o => `<button type="button" class="${f.start === o.start && f.slotProf === o.prof ? 'on' : ''}" data-act="pick-slot" data-t="${o.start}" data-p="${o.prof}" title="${prof(o.prof).corto}">${hhmm(o.start)}${!f.prof ? `<div class="tiny" style="font-weight:600;opacity:.75">${prof(o.prof).ini}</div>` : ''}</button>`).join('')}</div>` : '<div class="empty" style="padding:14px">No hay horarios libres ese día. Probá otro día o profesional.</div>'}
        ${(() => { const p = f.patientId && f.patientId !== '__new' ? patient(f.patientId) : null; const cob = p ? p.cob : f.nuevoCob; return `<div class="note" style="margin-top:14px"><b>Qué va a tener que traer (${esc(cob)}):</b> ${esc(A.traerPara(cob, f.servicio).join(' · '))}</div>`; })()}`;
    }, () => `<button class="btn ghost" data-act="sheet-close">Cancelar</button><button class="btn primary" data-act="save-appt">Guardar turno</button>`);
  }

  function patientSheet(id) {
    UI.dict = null; UI.summary = null;
    openSheet('Paciente', () => {
      const p = patient(id); const nx = upcoming(p.id);
      const tooth = n => `<div class="tooth ${p.odonto.mark.includes(n) ? 'mark' : p.odonto.done.includes(n) ? 'done' : ''}">${n}</div>`;
      const up = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28], lo = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
      return `<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px"><div class="avatar gray" style="width:48px;height:48px;font-size:15px">${initials(p.nombre)}</div><div><div style="font:800 19px var(--display)">${esc(p.nombre)}</div><div class="small muted">${esc(cobLabel(p))}${p.afiliado ? ' · ' + esc(p.afiliado) : ''}</div></div></div>
        ${p.alergias ? `<div class="note warn" style="margin-bottom:10px">${ic('alert', 'sm')} <b>Alergia:</b> ${esc(p.alergias)}</div>` : ''}
        <dl class="kv"><dt>Teléfono</dt><dd>${esc(p.tel)}</dd>${p.nac ? `<dt>Nacimiento</dt><dd>${p.nac.split('-').reverse().join('/')}</dd>` : ''}<dt>Próximo turno</dt><dd>${nx[0] ? `${dayRel(nx[0].date)} ${hhmm(nx[0].start)} · ${esc(servicio(nx[0].servicio).nombre)}` : '—'}</dd></dl>
        <div class="section-t">Antes del turno</div>
        ${UI.summary ? `<div class="evol" style="background:var(--teal-ll)"><div class="e-head"><span>Resumen del agente de historia clínica</span><span>borrador</span></div>${UI.summary}</div>` : `<button class="btn soft block" data-act="summary" data-id="${p.id}">${ic('sparkle', 'sm')}Resumir paciente con IA</button>`}
        <div class="section-t">Odontograma (FDI)</div>
        <div class="odonto">${up.slice(0, 8).map(tooth).join('')}</div><div class="odonto">${up.slice(8).map(tooth).join('')}</div>
        <div class="odonto" style="margin-top:8px">${lo.slice(0, 8).map(tooth).join('')}</div><div class="odonto">${lo.slice(8).map(tooth).join('')}</div>
        <p class="tiny muted"><span style="color:var(--red)">■</span> pendiente · <span style="color:var(--blue)">■</span> realizado</p>
        <div class="section-t">Evoluciones</div>
        ${UI.dict ? dictHTML() : `<button class="btn ghost block" data-act="dict-start" data-id="${p.id}" style="margin-bottom:10px">${ic('mic', 'sm')}Dictar una evolución</button>`}
        ${p.evols.length ? p.evols.slice().reverse().map(e => `<div class="evol"><div class="e-head"><span>${dm(e.fecha)} · ${esc(prof(e.prof).corto)}</span><span>${e.firmado ? '✓ Firmada' : 'Borrador'}</span></div><dl>${e.motivo ? `<dt>Motivo</dt><dd>${esc(e.motivo)}</dd>` : ''}${e.hallazgos ? `<dt>Hallazgos</dt><dd>${esc(e.hallazgos)}</dd>` : ''}${e.procedimiento ? `<dt>Se hizo</dt><dd>${esc(e.procedimiento)}</dd>` : ''}${e.indicaciones ? `<dt>Indicaciones</dt><dd>${esc(e.indicaciones)}</dd>` : ''}${e.proximo ? `<dt>Próximo</dt><dd>${esc(e.proximo)}</dd>` : ''}</dl></div>`).join('') : '<div class="empty small">Sin evoluciones cargadas.</div>'}
        <p class="tiny muted">La historia clínica es del paciente y la custodia la clínica (Ley 26.529). Toda evolución la firma el profesional; el agente solo ordena el borrador.</p>`;
    }, () => `<button class="btn primary" data-act="new-appt" data-pid="${id}">${ic('plus', 'sm')}Nuevo turno</button>`);
  }
  const DICT_EX = 'Paciente refiere sensibilidad al frío en pieza 16 desde hace dos semanas. Se observa caries oclusal en 16. Se realiza restauración con resina bajo anestesia local. Se indica evitar comidas muy frías por 48 horas y cepillado suave. Control en 6 meses.';
  function dictHTML() {
    const d = UI.dict;
    if (!d.result) return `<div class="evol"><div class="field" style="margin:0"><label>Lo que dictó el profesional (texto de ejemplo)</label><textarea id="dict-text">${esc(d.text)}</textarea></div><div style="display:flex;gap:8px;margin-top:10px"><button class="btn ghost sm" data-act="dict-cancel">Cancelar</button><button class="btn primary sm" data-act="dict-run">${ic('sparkle', 'sm')}Ordenar con IA</button></div></div>`;
    const r = d.result;
    return `<div class="evol" style="border-color:#bfe0da;background:var(--teal-ll)"><div class="e-head"><span>Borrador ordenado por el agente</span><span>sin firmar</span></div><dl>${['motivo', 'hallazgos', 'procedimiento', 'indicaciones', 'proximo'].filter(k => r[k]).map(k => `<dt>${({ motivo: 'Motivo', hallazgos: 'Hallazgos', procedimiento: 'Se hizo', indicaciones: 'Indicaciones', proximo: 'Próximo' })[k]}</dt><dd>${esc(r[k])}</dd>`).join('')}</dl>${r.pieza ? `<div class="small" style="margin-top:6px">Pieza detectada: <b>${r.pieza}</b> (se marca en el odontograma al firmar)</div>` : ''}<div class="note warn" style="margin-top:10px">No queda en la historia hasta que lo firme el profesional.</div><div style="display:flex;gap:8px;margin-top:10px"><button class="btn ghost sm" data-act="dict-cancel">Descartar</button><button class="btn primary sm" data-act="dict-sign">${ic('check', 'sm')}Firmar y guardar</button></div></div>`;
  }
  function structure(text) {
    const r = { motivo: [], hallazgos: [], procedimiento: [], indicaciones: [], proximo: [] };
    text.split(/(?<=\.)\s+/).map(s => s.trim()).filter(Boolean).forEach(s => {
      const n = A.norm(s);
      if (/control|proxim|volver|turno en|en \d+ (dias|semanas|meses)/.test(n) && !/se realiza/.test(n)) r.proximo.push(s);
      else if (/indic|recomend|cepill|ibuprofeno|amoxi|enjuague|evitar/.test(n)) r.indicaciones.push(s);
      else if (/se realiza|se realizo|restaur|tartrect|extrac|anestesia|obturac|conductometr/.test(n)) r.procedimiento.push(s);
      else if (/refiere|consulta por|motivo|dolor|molestia|sensibilidad/.test(n) && !r.motivo.length) r.motivo.push(s);
      else r.hallazgos.push(s);
    });
    const m = text.match(/pieza (\d{2})/i);
    const out = {}; Object.keys(r).forEach(k => { if (r[k].length) out[k] = r[k].join(' '); });
    if (m) out.pieza = +m[1];
    return out;
  }

  /* ---------- Agentes que corren desde el panel ---------- */
  async function runReminders() {
    const day = nextWorkingDay();
    const list = S.appts.filter(a => a.date === day && ['por_confirmar', 'confirmado'].includes(a.status));
    if (!list.length) { toast({ title: 'No hay turnos para recordar', text: dayLong(day) }); return; }
    list.forEach(a => {
      const p = patient(a.patientId), c = convFor(p.tel, p.id, p.nombre);
      addMsg(c, { from: 'agent', agent: 'recordatorios', text: `Hola ${first(p.nombre)}, te recuerdo tu turno de ${servicio(a.servicio).nombre.toLowerCase()} el ${dayLong(a.date)} a las ${hhmm(a.start)} con ${prof(a.prof).corto}.\nTraé: ${(a.traer || ['DNI']).join(', ')}.\n${a.status === 'por_confirmar' ? '¿Confirmás? Respondé SÍ, o escribime si necesitás cambiarlo.' : '¡Te esperamos!'}` });
    });
    S.flags.reminders = day;
    log('recordatorios', `Envió ${list.length} recordatorios para el ${dayLong(day)} con la lista de qué traer`, 'ok');
    save(); refresh();
    toast({ title: `Recordatorios enviados (${list.length})`, text: 'Esperando respuestas de los pacientes…' });
    const pend = list.filter(a => a.status === 'por_confirmar');
    const answers = ['Sí, confirmo', 'Confirmo 👍', 'No voy a poder, ¿lo podemos pasar a otro día?'];
    let i = 0;
    for (const a of pend.slice(0, 3)) {
      await sleep(1300);
      const p = patient(a.patientId), c = convByTel(p.tel);
      await incoming(c, answers[i++], { instant: true });
    }
    const conf = pend.slice(0, 2).length;
    if (pend.length) toast({ title: `${Math.min(conf, pend.length)} confirmaron${pend.length > 2 ? ', 1 pidió cambiar' : ''}`, text: 'Clara ya actualizó la agenda y le ofreció otros horarios a quien pidió cambiar.', action: 'Ver WhatsApp', fn: () => go('whatsapp') });
  }
  async function runPrecheck() {
    UI.checking = true; S.prestaciones.forEach(x => { x.checked = false; }); refresh();
    for (const x of S.prestaciones.filter(x => !x.excluded)) { await sleep(180); x.checked = true; refresh(); }
    UI.checking = false;
    const pres = S.prestaciones.filter(x => !x.excluded), bad = pres.filter(x => issuesOf(x).length);
    log('facturacion', `Revisó ${pres.length} prestaciones antes de presentar: ${pres.length - bad.length} listas y ${bad.length} con faltantes (${money(bad.reduce((s, x) => s + x.monto, 0))} que habrían vuelto como débito)`, bad.length ? 'warn' : 'ok');
    save(); refresh();
  }
  function fix(id, code, done) {
    const x = S.prestaciones.find(y => y.id === id), p = patient(x.patientId);
    if (code === 'frecuencia') { x.excluded = true; log('facturacion', `Sacó del lote la limpieza de ${p.nombre}: se cobra como particular`, 'info'); toast({ title: 'Pasada a particular', text: 'Ya no se presenta a la obra social.' }); }
    else if (['firma', 'orden', 'bono'].includes(code) && !done) {
      const what = { firma: 'tu firma en la planilla', orden: 'la orden de consulta', bono: 'el bono asistencial (lo podés sacar en la app Mi IAPOS)' }[code];
      const c = convFor(p.tel, p.id, p.nombre);
      addMsg(c, { from: 'agent', agent: 'facturacion', text: `Hola ${first(p.nombre)}, te escribimos de ${D.clinic.nombre}. Para presentar a ${x.cob} tu ${servicio(x.servicio).nombre.toLowerCase()} del ${dm(x.fecha)} nos falta ${what}. ¿Podés acercarlo o mandarnos una foto por acá? ¡Gracias!` });
      x[code] = 'pedido';
      log('facturacion', `Le pidió a ${p.nombre} por WhatsApp ${what.split(' (')[0]} que faltaba`, 'info');
      toast({ title: 'Mensaje enviado al paciente', text: `${p.nombre} · WhatsApp`, action: 'Ver chat', fn: () => { UI.inboxConv = c.id; go('whatsapp'); } });
    } else if (code === 'autorizacion' && !done) { x.autorizacion = 'pedido'; log('facturacion', `Preparó el pedido de autorización a ${x.cob} para ${p.nombre}`, 'info'); toast({ title: 'Pedido de autorización armado', text: 'Queda pendiente de respuesta (demo).' }); }
    else { x[code] = code === 'pieza' ? '45' : true; toast({ title: 'Listo', text: 'Faltante resuelto.' }); }
    save(); refresh();
  }
  async function runDebitos() {
    S.debitos.forEach(d => { d.classified = false; }); refresh();
    for (const d of S.debitos) { await sleep(260); d.classified = true; refresh(); }
    const rec = S.debitos.filter(d => DEB[d.cat].rec);
    log('facturacion', `Ordenó ${S.debitos.length} débitos de ${S.debitosMes}: ${rec.length} se pueden reclamar (${money(rec.reduce((s, d) => s + d.monto, 0))}) y preparó los borradores`, 'ok');
    save(); refresh();
  }
  function claimSheet(id) {
    const d = S.debitos.find(x => x.id === id), p = patient(d.patientId), sv = servicio(d.servicio), cat = DEB[d.cat];
    const text = `Señores ${d.cob}:\n\nSolicito la revisión del débito aplicado en la liquidación de ${S.debitosMes} a la prestación "${sv.nombre}" (código ${sv.cod}) del afiliado ${p.nombre} (${p.afiliado || 's/n'}).\n\nMotivo informado: ${d.raw}.\n\nAdjunto ${cat.doc}, con lo que la prestación cumple la norma vigente. Solicito la refacturación de ${money(d.monto)}.\n\nSaludos cordiales,\nDra. Lucía Méndez · ${D.clinic.nombre}`;
    openSheet('Borrador del reclamo', () => `<div class="note" style="margin-bottom:12px">El agente arma el borrador. Una persona lo revisa, adjunta el documento y lo presenta por el canal del círculo o de la obra social.</div><div class="field"><label>Texto</label><textarea style="height:300px">${esc(text)}</textarea></div><div class="small muted">Adjuntar: ${esc(cat.doc)}</div>`,
      () => `<button class="btn ghost" data-act="sheet-close">Cerrar</button><button class="btn primary" data-act="claim-ok" data-id="${d.id}">${ic('check', 'sm')}Aprobar reclamo</button>`);
  }

  /* ---------- Toasts ---------- */
  function toast(t) {
    const el = document.createElement('div'); el.className = 'toast';
    el.innerHTML = `<div class="t-ico" style="${t.warn ? 'background:#f5a52433;color:#ffc565' : ''}">${ic(t.warn ? 'alert' : 'check', 'sm')}</div><div class="t-txt"><b>${esc(t.title)}</b>${t.text ? esc(t.text) : ''}</div>${t.action ? `<button>${esc(t.action)}</button>` : ''}`;
    if (t.action) el.querySelector('button').onclick = () => { el.remove(); t.fn(); };
    $('#toasts').appendChild(el);
    setTimeout(() => el.remove(), t.action ? 7000 : 3500);
  }
  function flushToasts() { const q = UI.pendingToasts.splice(0); q.forEach(toast); }

  /* ---------- Eventos ---------- */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]'); if (!el) return;
    const d = el.dataset, act = d.act;
    switch (act) {
      case 'go': go(d.page); break;
      case 'more':
        openSheet('Más', () => `<div class="list card">${['obras', 'agentes', 'finanzas', 'config'].map(p => `<button class="row tap" data-act="go" data-page="${p}">${ic(PAGES[p][1])}<div class="grow"><div class="title">${PAGES[p][0]}</div></div>${ic('chevR', 'sm')}</button>`).join('')}</div><button class="btn block" style="margin-top:12px;background:#25d366;color:#063d1d" data-act="phone-open">${ic('phone')}Probar WhatsApp como paciente</button>`);
        break;
      case 'phone-open': closeSheet(); openPhone(d.say); break;
      case 'phone-close': closePhone(); break;
      case 'phone-reset': {
        const c = convByTel(persona().tel);
        if (c) { c.msgs = []; c.ctx = {}; c.mode = 'agent'; c.needsHuman = false; if (!persona().patientId) { c.patientId = null; c.nombre = null; } save(); refresh(); }
        break;
      }
      case 'say': sendFromPhone(d.text); break;
      case 'sheet-close': closeSheet(); break;
      case 'appt': apptSheet(d.id); break;
      case 'patient': closePhoneIfMobile(); patientSheet(d.id); break;
      case 'new-appt': newApptSheet({ date: d.k, start: d.t, prof: d.p, patientId: d.pid }); if (d.t != null) { UI.form.start = +d.t; UI.form.slotProf = d.p; UI.form.prof = d.p || ''; paintSheetForce(); } break;
      case 'pick-slot': UI.form.start = +d.t; UI.form.slotProf = d.p; paintSheetForce(); break;
      case 'save-appt': saveAppt(); break;
      case 'appt-status': {
        const a = appt(d.id), prev = a.status; updateAppt(d.id, { status: d.s });
        const p = patient(a.patientId);
        if (prev === 'pendiente' && d.s === 'confirmado') { const c = convByTel(p.tel); if (c) addMsg(c, { from: 'staff', text: `¡Listo ${first(p.nombre)}! Tu turno del ${dayLong(a.date)} a las ${hhmm(a.start)} quedó confirmado. Te esperamos.` }); log('persona', `Recepción aprobó el turno de ${p.nombre} y Clara le avisó por WhatsApp`, 'ok'); }
        if (d.s === 'cancelado') log('persona', `Recepción canceló el turno de ${p.nombre} del ${dayRel(a.date)} ${hhmm(a.start)}`, 'info');
        save(); refresh(); toast({ title: STATUS[d.s][1], text: `${p.nombre} · ${hhmm(a.start)}` });
        if (d.s === 'cancelado') closeSheet();
        break;
      }
      case 'traer': { const a = appt(d.id), i = +d.i; a.traerOk = a.traerOk.includes(i) ? a.traerOk.filter(x => x !== i) : a.traerOk.concat(i); save(); paintSheetForce(); break; }
      case 'remind-one': { const a = appt(d.id), p = patient(a.patientId), c = convFor(p.tel, p.id, p.nombre); addMsg(c, { from: 'agent', agent: 'recordatorios', text: `Hola ${first(p.nombre)}, te recuerdo tu turno del ${dayLong(a.date)} a las ${hhmm(a.start)} con ${prof(a.prof).corto}. Traé: ${(a.traer || ['DNI']).join(', ')}. ¿Confirmás?` }); log('recordatorios', `Le recordó el turno a ${p.nombre}`, 'info'); save(); refresh(); toast({ title: 'Recordatorio enviado', text: p.nombre }); break; }
      case 'agenda-day': UI.agendaDay = d.k; render(); break;
      case 'agenda-shift': UI.agendaDay = key(addDays(UI.agendaDay || tk(), +d.n)); render(); break;
      case 'agenda-prof': UI.agendaProf = d.p; render(); break;
      case 'agenda-view': UI.agendaView = d.v; render(); break;
      case 'open-conv': closePhoneIfMobile(); closeSheet(); UI.inboxConv = d.id; { const c = S.convs.find(x => x.id === d.id); if (c) c.unread = 0; } if (UI.page !== 'whatsapp') go('whatsapp'); else render(); break;
      case 'close-conv': UI.inboxConv = null; render(); break;
      case 'take-over': { const c = S.convs.find(x => x.id === d.id); c.mode = 'human'; addMsg(c, { from: 'sys', text: 'Lucía (recepción) tomó la conversación. Clara deja de responder.' }); log('persona', `Recepción tomó la conversación con ${convName(c)}`, 'info'); save(); render(); setTimeout(() => { const i = $('#staffinput'); if (i) i.focus(); }, 50); renderPhone(); break; }
      case 'give-back': { const c = S.convs.find(x => x.id === d.id); c.mode = 'agent'; c.needsHuman = false; c.ctx = {}; addMsg(c, { from: 'sys', text: 'La conversación volvió a Clara.' }); save(); refresh(); break; }
      case 'resolve': { const c = S.convs.find(x => x.id === d.id); c.needsHuman = false; c.unread = 0; save(); refresh(); toast({ title: 'Marcado como resuelto', text: convName(c) }); break; }
      case 'run-reminders': runReminders(); break;
      case 'run-precheck': runPrecheck(); break;
      case 'fix': fix(d.id, d.code, d.done === '1'); break;
      case 'build-batch': log('facturacion', 'Armó el lote para presentar (archivo en el formato del círculo, simulado)', 'ok'); save(); refresh(); toast({ title: 'Lote armado', text: 'En el producto real se descarga en el formato que pide cada obra social o círculo.' }); break;
      case 'run-debitos': runDebitos(); break;
      case 'os-tab': UI.osTab = d.t; render(); break;
      case 'claim': claimSheet(d.id); break;
      case 'claim-ok': { const x = S.debitos.find(y => y.id === d.id); x.estado = 'enviado'; log('persona', `Recepción aprobó el reclamo del débito de ${patient(x.patientId).nombre}`, 'ok'); save(); closeSheet(); refresh(); toast({ title: 'Reclamo aprobado', text: 'Listo para presentar.' }); break; }
      case 'charge': { const x = S.debitos.find(y => y.id === d.id); if (x.estado !== 'cobrar') { x.estado = 'cobrar'; const p = patient(x.patientId); const c = convFor(p.tel, p.id, p.nombre); addMsg(c, { from: 'agent', agent: 'facturacion', text: `Hola ${first(p.nombre)}, ${x.cob} no reconoció tu ${servicio(x.servicio).nombre.toLowerCase()} (${DEB[x.cat].label.toLowerCase()}). Te queda un saldo de ${money(x.monto)}. Si querés lo vemos en tu próxima visita o te pasamos un link de pago.` }); log('facturacion', `Le avisó a ${p.nombre} el saldo por un débito no recuperable`, 'info'); save(); refresh(); } break; }
      case 'toggle-agent': S.cfg.agents[d.id] = !S.cfg.agents[d.id]; save(); render(); break;
      case 'toggle-auto': S.cfg.autoConfirm = !S.cfg.autoConfirm; save(); render(); break;
      case 'reset-demo': if (confirmReset()) { try { localStorage.removeItem(LS); } catch (e) { } S = seed(); save(); UI.inboxConv = null; closePhone(); go('hoy'); toast({ title: 'Demo reiniciada', text: 'Todo volvió al estado inicial.' }); } break;
      case 'summary': { const p = patient(d.id); UI.summary = summaryHTML(p); log('historia', `Resumió a ${p.nombre} antes del turno`, 'info'); save(); paintSheetForce(); break; }
      case 'dict-start': UI.dict = { pid: d.id, text: DICT_EX, result: null }; paintSheetForce(); break;
      case 'dict-cancel': UI.dict = null; paintSheetForce(); break;
      case 'dict-run': { const t = ($('#dict-text') || {}).value || UI.dict.text; UI.dict.text = t; UI.dict.result = structure(t); log('historia', 'Ordenó una evolución dictada (borrador sin firmar)', 'info'); paintSheetForce(); break; }
      case 'dict-sign': { const p = patient(UI.dict.pid), r = UI.dict.result; p.evols.push({ id: uid(), fecha: tk(), prof: 'mendez', firmado: true, motivo: r.motivo, hallazgos: r.hallazgos, procedimiento: r.procedimiento, indicaciones: r.indicaciones, proximo: r.proximo }); if (r.pieza) { p.odonto.mark = p.odonto.mark.filter(n => n !== r.pieza); if (!p.odonto.done.includes(r.pieza)) p.odonto.done.push(r.pieza); } UI.dict = null; log('persona', `La Dra. Méndez firmó una evolución de ${p.nombre}`, 'ok'); save(); paintSheetForce(); toast({ title: 'Evolución firmada', text: p.nombre }); break; }
    }
  });
  function confirmReset() { return true; }
  function closePhoneIfMobile() { if (!matchMedia('(min-width: 900px)').matches) closePhone(); }
  function paintSheetForce() { if (UI.sheet) { UI.sheet.force = true; paintSheet(); } }

  document.addEventListener('change', e => {
    const f = e.target.dataset && e.target.dataset.f;
    if (f && UI.form) {
      UI.form[f] = e.target.value;
      if (f === 'servicio') { const sv = servicio(UI.form.servicio); if (UI.form.prof && !sv.profs.includes(UI.form.prof)) UI.form.prof = ''; UI.form.start = null; }
      if (f === 'prof' || f === 'date') UI.form.start = null;
      paintSheetForce();
    }
    if (e.target.id === 'ph-persona') { S.persona = e.target.value; save(); renderPhone(); }
  });
  document.addEventListener('input', e => {
    if (e.target.id === 'psearch') { const q = A.norm(e.target.value); document.querySelectorAll('#plist [data-name]').forEach(r => { r.style.display = A.norm(r.dataset.name).includes(q) ? '' : 'none'; }); }
    if (e.target.dataset && e.target.dataset.f === 'nuevoNombre' && UI.form) UI.form.nuevoNombre = e.target.value;
  });
  document.addEventListener('submit', e => {
    if (e.target.id === 'ph-form') { e.preventDefault(); const i = $('#ph-input'); const t = i.value; i.value = ''; sendFromPhone(t); }
    if (e.target.id === 'staffform') {
      e.preventDefault(); const i = $('#staffinput'); const t = i.value.trim(); if (!t) return;
      const c = S.convs.find(x => x.id === e.target.dataset.id); addMsg(c, { from: 'staff', text: t }); c.unread = 0; i.value = ''; save();
      const m = $('#conv-msgs'); if (m) { m.innerHTML = msgsHTML(c, 'clinic'); m.scrollTop = m.scrollHeight; }
      renderPhone(); renderNav();
    }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (UI.sheet) closeSheet(); else closePhone(); } });

  function saveAppt() {
    const f = UI.form;
    if (!f.patientId) return toast({ title: 'Falta elegir el paciente', warn: true });
    if (f.patientId === '__new' && f.nuevoNombre.trim().split(/\s+/).length < 2) return toast({ title: 'Escribí nombre y apellido', warn: true });
    if (f.start == null || !f.slotProf) return toast({ title: 'Elegí un horario', warn: true });
    let p = f.patientId === '__new' ? upsertPatient({ nombre: f.nuevoNombre.trim(), tel: '+54 9 341 555-0' + Math.floor(100 + Math.random() * 900), cob: f.nuevoCob, afiliado: '', alergias: '' }) : patient(f.patientId);
    if (f.patientId === '__new') p.nuevo = false;
    const sv = servicio(f.servicio);
    const a = createAppt({ patientId: p.id, prof: f.slotProf, servicio: sv.id, date: f.date, start: f.start, dur: sv.dur, status: 'por_confirmar', source: 'recepcion', traer: A.traerPara(p.cob, sv.id) });
    log('persona', `Recepción agendó a ${p.nombre}: ${sv.nombre} el ${dayRel(a.date)} ${hhmm(a.start)}`, 'info');
    closeSheet(); UI.highlight = a.id; UI.agendaDay = a.date; save();
    if (UI.page !== 'agenda') go('agenda'); else render();
    toast({ title: 'Turno guardado', text: `${p.nombre} · ${dayRel(a.date)} ${hhmm(a.start)}. Clara le va a mandar el recordatorio.` });
  }
  function summaryHTML(p) {
    const last = p.evols[p.evols.length - 1];
    const nx = upcoming(p.id)[0];
    const items = [];
    if (p.alergias) items.push(`⚠️ <b>Alergia a ${esc(p.alergias.toLowerCase())}</b>.`);
    if (nx) items.push(`Viene ${dayRel(nx.date).toLowerCase()} a las ${hhmm(nx.start)} para <b>${esc(servicio(nx.servicio).nombre.toLowerCase())}</b>${nx.traerOk.length < (nx.traer || []).length ? `; tiene que traer: ${esc((nx.traer || []).filter((_, i) => !nx.traerOk.includes(i)).join(', '))}` : ''}.`);
    if (last) items.push(`Última visita (${dm(last.fecha)}): ${esc(last.procedimiento || last.motivo || '')} Quedó pendiente: ${esc(last.proximo || '—')}`);
    if (p.odonto.mark.length) items.push(`Piezas pendientes en el odontograma: ${p.odonto.mark.join(', ')}.`);
    const c = D.coberturas[p.cob]; if (c && c.nombre !== 'Particular') items.push(`${esc(c.nombre)}: ${esc(c.general)}`);
    if (!items.length) items.push('Paciente sin antecedentes cargados.');
    return `<ul style="margin:0;padding-left:18px;line-height:1.6">${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
  }

  /* ---------- Inicio ---------- */
  S = load(); save();
  hydrate();
  const startPage = (location.hash || '#hoy').slice(1);
  UI.page = PAGES[startPage] ? startPage : 'hoy';
  history.replaceState(null, '', '#' + UI.page);
  render();
  matchMedia('(min-width: 900px)').addEventListener('change', () => render());
  setInterval(() => { if (UI.page === 'hoy' || UI.page === 'agenda') { const ae = document.activeElement; if (!(ae && /INPUT|TEXTAREA|SELECT/.test(ae.tagName))) { const y = window.scrollY; render(); window.scrollTo(0, y); } } }, 60000);
  window.Clara = { state: () => S, ui: UI, incoming, findSlots, reset: () => { localStorage.removeItem(LS); location.reload(); } };
})();
