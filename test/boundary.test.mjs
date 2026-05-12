import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';

const sourceFiles = (directoryUrl) =>
  readdirSync(directoryUrl, { withFileTypes: true }).flatMap((entry) => {
    const entryUrl = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directoryUrl);
    return entry.isDirectory() ? sourceFiles(entryUrl) : [entryUrl];
  });

test('package declares Ant Design boundary', () => {
  const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(packageJson.peerDependencies.antd, '>=5');
  assert.equal(packageJson.peerDependencies.react, '>=18');
  assert.equal(packageJson.peerDependencies['@ant-design/icons'], '>=5');
  assert.equal(packageJson.exports['./action'].types, './src/action/index.d.ts');
});

test('package source does not read app-local modules', () => {
  const forbiddenPatterns = [
    /\bfrom ['"]@\//,
    /\bfrom ['"]@core\//,
    /\bfrom ['"]\.\.\/\.\.\/TrueAdmin\//,
  ];
  for (const fileUrl of sourceFiles(new URL('../src/', import.meta.url))) {
    const source = readFileSync(fileUrl, 'utf8');
    for (const pattern of forbiddenPatterns) {
      assert.doesNotMatch(source, pattern, fileUrl.pathname);
    }
  }
});
