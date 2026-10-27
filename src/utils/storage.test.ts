import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_SURPRISE_DATA } from './defaults.ts';
import { exportConfiguration, importConfiguration } from './storage.ts';

test('DEFAULT_SURPRISE_DATA contains all 5 required photo spaces and birthday date is 2026-10-28', () => {
  assert.equal(DEFAULT_SURPRISE_DATA.birthdayDate, '2026-10-28');
  assert.equal(DEFAULT_SURPRISE_DATA.photos.length, 5);
  assert.equal(DEFAULT_SURPRISE_DATA.photos[0].title, 'The Girl Who Stole My Heart ❤️');
  assert.equal(DEFAULT_SURPRISE_DATA.photos[1].title, 'Your Beautiful Smile 🌸');
  assert.equal(DEFAULT_SURPRISE_DATA.photos[2].title, 'My Favourite Memory 📸');
  assert.equal(DEFAULT_SURPRISE_DATA.photos[3].title, 'My Happiness, My Peace 🫶');
  assert.equal(DEFAULT_SURPRISE_DATA.photos[4].title, 'My Forever Favourite Person 💖');
});

test('DEFAULT_SURPRISE_DATA contains at least 10 love reasons', () => {
  assert.ok(DEFAULT_SURPRISE_DATA.reasons.length >= 10);
});

test('DEFAULT_SURPRISE_DATA timeline covers the requested milestones', () => {
  assert.equal(DEFAULT_SURPRISE_DATA.timeline.length, 5);
  const titles = DEFAULT_SURPRISE_DATA.timeline.map((t) => t.title);
  assert.ok(titles.includes('The Day We Met'));
  assert.ok(titles.includes('The Moment You Became Special'));
  assert.ok(titles.includes('My Favourite Memory With You'));
  assert.ok(titles.includes('Why You Mean So Much to Me'));
  assert.ok(titles.includes('My Wish For Our Future'));
});

test('exportConfiguration and importConfiguration round-trip successfully', () => {
  const json = exportConfiguration(DEFAULT_SURPRISE_DATA);
  assert.ok(typeof json === 'string');
  const imported = importConfiguration(json);
  assert.ok(imported !== null);
  assert.equal(imported?.girlfriendName, DEFAULT_SURPRISE_DATA.girlfriendName);
  assert.equal(imported?.photos.length, 5);
});

test('importConfiguration handles invalid json gracefully', () => {
  const result = importConfiguration('{ bad json');
  assert.equal(result, null);
});

test('ROMANTIC_SONG_PRESETS has fluent compositions', async () => {
  const { ROMANTIC_SONG_PRESETS } = await import('./audioSynth.ts');
  assert.ok(ROMANTIC_SONG_PRESETS.length >= 3);
  assert.equal(ROMANTIC_SONG_PRESETS[0].id, 'golden-hour');
  assert.ok(ROMANTIC_SONG_PRESETS[0].progression.length >= 4);
});
