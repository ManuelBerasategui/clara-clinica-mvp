const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const repo = path.join(__dirname, '..');
const fakeDocument = {
  addEventListener() {},
  querySelector() { return null; },
  querySelectorAll() { return []; },
  body: { classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } } },
  activeElement: null,
  title: ''
};
const fakeWindow = { addEventListener() {}, scrollTo() {}, location: { hash: '' } };
const fakeMedia = { matches: true, addEventListener() {} };
const context = vm.createContext({
  window: fakeWindow,
  document: fakeDocument,
  matchMedia: () => fakeMedia,
  localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  history: { replaceState() {}, pushState() {} },
  location: { hash: '' },
  setTimeout,
  clearTimeout,
  console,
  Date,
  Math,
  JSON
});

for (const file of ['data.js', 'agent.js']) {
  vm.runInContext(fs.readFileSync(path.join(repo, file), 'utf8'), context, { filename: file });
}

const app = fs.readFileSync(path.join(repo, 'app.js'), 'utf8');
const bootMarker = '  /* ---------- Inicio ---------- */';
const bootAt = app.indexOf(bootMarker);
assert.notEqual(bootAt, -1, 'app boot marker exists');
const harness = `
  S = seed();
  const testState = { toasts: [], saves: 0, logs: [], closes: 0 };
  save = () => { testState.saves++; };
  log = (...args) => { testState.logs.push(args); };
  closeSheet = () => { testState.closes++; UI.sheet = null; };
  render = () => {};
  go = page => { UI.page = page; };
  toast = value => { testState.toasts.push(value); };
  paintSheetForce = () => {};
  window.__appointmentTest = {
    D,
    state: () => S,
    ui: UI,
    seed: () => { S = seed(); S.appts = []; UI.form = null; UI.sheet = { dirty: true }; testState.toasts.length = 0; testState.saves = 0; testState.logs.length = 0; testState.closes = 0; },
    findSlots,
    load,
    saveAppt,
    counters: testState
  };
})();`;
vm.runInContext(app.slice(0, bootAt) + harness, context, { filename: 'app.js (boot omitted)' });

const T = context.window.__appointmentTest;
const dateKey = date => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
const nextMonday = () => {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  const days = ((1 - d.getDay() + 7) % 7) || 7;
  d.setDate(d.getDate() + days);
  return dateKey(d);
};
const monday = nextMonday();
const freeMondaySlot = () => T.findSlots({ servicio: 'consulta', prof: 'mendez', day: monday, limit: 100 })[0];
const form = values => {
  T.ui.form = { patientId: 'p1', nuevoNombre: '', nuevoCob: 'Particular', servicio: 'consulta', prof: 'mendez', date: monday, start: null, slotProf: null, ...values };
  T.ui.sheet = { dirty: true };
};
const expectSaveRejected = (message) => {
  assert.equal(T.state().appts.length, 0, `${message}: no appointment created`);
  assert.ok(T.counters.toasts.length, `${message}: user receives validation feedback`);
};

// A valid real free slot creates one appointment and keeps the standard source/status.
T.seed();
{
  const slot = freeMondaySlot(); assert.ok(slot, 'fixture has a free Monday slot');
  form({ start: slot.start, slotProf: slot.prof });
  T.saveAppt();
  const created = T.state().appts;
  assert.equal(created.length, 1);
  assert.equal(created[0].patientId, 'p1');
  assert.equal(created[0].date, monday);
  assert.equal(created[0].status, 'por_confirmar');
  assert.equal(created[0].source, 'recepcion');
  assert.equal(T.counters.saves, 2, 'creation and completion both persist through save()');
}

// A slot taken after the user selected it is rejected at commit time.
T.seed();
{
  const slot = freeMondaySlot(); assert.ok(slot);
  T.state().appts.push({ id: 'race', patientId: 'p2', prof: slot.prof, servicio: 'consulta', date: monday, start: slot.start, dur: 30, status: 'confirmado', source: 'recepcion' });
  form({ start: slot.start, slotProf: slot.prof });
  T.saveAppt();
  assert.equal(T.state().appts.length, 1, 'stale selection does not create an appointment');
  assert.match(T.counters.toasts.at(-1).title, /horario ya no está disponible|superpone/i);
}

// Past day, a professional who cannot provide the service, and an out-of-hours time are rejected.
T.seed();
{
  const past = new Date(); past.setDate(past.getDate() - 1);
  form({ date: dateKey(past), start: 600, slotProf: 'mendez' });
  T.saveAppt(); expectSaveRejected('past date');
}
T.seed();
{
  form({ servicio: 'endodoncia', prof: 'mendez', start: 600, slotProf: 'mendez' });
  T.saveAppt(); expectSaveRejected('ineligible professional');
}
T.seed();
{
  form({ start: 420, slotProf: 'mendez' });
  T.saveAppt(); expectSaveRejected('outside clinic hours');
}

// Editing must update exactly the existing record, preserving identity/status/source.
T.seed();
{
  const original = { id: 'edit-me', patientId: 'p2', prof: 'mendez', servicio: 'consulta', date: monday, start: 540, dur: 30, status: 'confirmado', source: 'whatsapp', traer: ['DNI'], traerOk: [] };
  T.state().appts.push(original);
  const slot = T.findSlots({ servicio: 'consulta', prof: 'mendez', day: monday, limit: 100, ignoreApptId: original.id }).find(x => x.start !== original.start);
  assert.ok(slot, 'fixture has a second slot for reprogramming');
  form({ editId: original.id, patientId: original.patientId, servicio: original.servicio, prof: original.prof, date: slot.date, start: slot.start, slotProf: slot.prof });
  T.saveAppt();
  assert.equal(T.state().appts.length, 1, 'reprogramming never duplicates the record');
  const updated = T.state().appts[0];
  assert.equal(updated.id, original.id);
  assert.equal(updated.status, 'confirmado');
  assert.equal(updated.source, 'whatsapp');
  assert.equal(updated.patientId, 'p2');
  assert.equal(updated.start, slot.start);
  assert.equal(updated.date, slot.date);
}

// A canceled appointment cannot be edited back into the active agenda.
T.seed();
{
  const canceled = { id: 'canceled', patientId: 'p1', prof: 'mendez', servicio: 'consulta', date: monday, start: 540, dur: 30, status: 'cancelado', source: 'recepcion', traer: [], traerOk: [] };
  T.state().appts.push(canceled);
  form({ editId: canceled.id, start: 600, slotProf: 'mendez' });
  T.saveAppt();
  assert.equal(T.state().appts.length, 1);
  assert.equal(T.state().appts[0].status, 'cancelado');
  assert.match(T.counters.toasts.at(-1).title, /ya no se puede reprogramar/i);
}

// A patient cannot be booked with two different professionals at the same time.
T.seed();
{
  const slot = freeMondaySlot();
  T.state().appts.push({ id: 'patient-busy', patientId: 'p1', prof: 'salas', servicio: 'consulta', date: monday, start: slot.start, dur: 30, status: 'confirmado', source: 'recepcion' });
  form({ start: slot.start, slotProf: slot.prof });
  T.saveAppt();
  assert.equal(T.state().appts.length, 1);
  assert.match(T.counters.toasts.at(-1).title, /paciente ya tiene un turno/i);
}

// A valid saved demo survives a new day instead of silently reseeding user changes.
T.seed();
{
  const persisted = JSON.parse(JSON.stringify(T.state()));
  persisted.seededFor = '2000-01-01';
  persisted.patients[0].nombre = 'Paciente ficticio conservado';
  context.localStorage.getItem = () => JSON.stringify(persisted);
  assert.equal(T.load().patients[0].nombre, 'Paciente ficticio conservado');
  assert.equal(T.load().seededFor, '2000-01-01');
}

console.log('Appointment and persistence regression tests passed: 9 scenarios.');
