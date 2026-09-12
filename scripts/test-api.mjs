import mcp from '../api/mcp.js';

const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

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
    && Array.isArray(info?.courses)
    && info.courses.length === 6
    && !JSON.stringify(info).match(/prelaunch|not yet verified|pending/i),
  'MCP club info must describe an open club with six courses and no prelaunch language.'
);

if (failures.length) {
  console.error(`API smoke tests failed (${failures.length}):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('API smoke tests passed: MCP read-only methods.');
