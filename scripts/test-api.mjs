import contact from '../api/contact.js';
import mcp from '../api/mcp.js';

const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

const contactGet = await contact.fetch(new Request('https://example.test/api/contact'));
expect(contactGet.status === 405, `contact GET expected 405, received ${contactGet.status}`);

const contactInvalid = await contact.fetch(new Request('https://example.test/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: '{'
}));
expect(contactInvalid.status === 400, `invalid JSON expected 400, received ${contactInvalid.status}`);

const contactTrap = await contact.fetch(new Request('https://example.test/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ company: 'bot' })
}));
expect(contactTrap.status === 200, `honeypot expected quiet 200, received ${contactTrap.status}`);

const contactUnconfigured = await contact.fetch(new Request('https://example.test/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test local',
    email: 'test@example.test',
    subject: 'Information',
    message: 'Ceci est un test local sans envoi externe.',
    company: '',
    startedAt: Date.now() - 5000,
    consent: 'yes'
  })
}));
expect(contactUnconfigured.status === 503, `unconfigured contact expected 503, received ${contactUnconfigured.status}`);

const mcpGet = await mcp.fetch(new Request('https://example.test/api/mcp'));
const mcpCard = await mcpGet.json();
expect(mcpGet.status === 200, `MCP GET expected 200, received ${mcpGet.status}`);
expect(mcpCard.attribution?.technicalLead === 'Eddy Etame Etame', 'MCP technical lead attribution mismatch.');

const mcpList = await mcp.fetch(new Request('https://example.test/api/mcp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' })
}));
const mcpListBody = await mcpList.json();
expect(mcpList.status === 200, `MCP tools/list expected 200, received ${mcpList.status}`);
expect(mcpListBody.result?.tools?.length === 4, 'MCP tools/list expected exactly four read-only tools.');

const mcpCall = await mcp.fetch(new Request('https://example.test/api/mcp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'get_club_info', arguments: {} } })
}));
const mcpCallBody = await mcpCall.json();
const info = mcpCallBody.result?.structuredContent;
expect(
  info?.name === 'Club de Boxe Blagnac'
    && info?.founded === 2011
    && Array.isArray(info?.courses)
    && info.courses.length === 6
    && !JSON.stringify(info).match(/prelaunch|not yet verified|pending/i),
  'MCP club info must describe an open club with six courses and no prelaunch language.'
);

if (failures.length) {
  console.error(`API smoke tests failed (${failures.length}):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('API smoke tests passed: contact validation and MCP read-only methods.');
