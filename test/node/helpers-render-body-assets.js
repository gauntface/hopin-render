const fs = require('fs-extra');
const path = require('path');
const test = require('ava');

const { renderBodyAssets } = require('../../build/helpers/render-body-assets');

test('should generate empty body assets when nothing is passed in', async (t) => {
  const result = renderBodyAssets({
    scripts: {
      inline: {
        values: () => {
          return [];
        }
      },
      sync: {
        values: () => {
          return [];
        }
      },
      async: {
        values: () => {
          return [];
        }
      },
    },
    styles: {
      inline: {
        values: () => {
          return [];
        }
      },
      sync: {
        values: () => {
          return [];
        }
      },
      async: {
        values: () => {
          return [];
        }
      },
    },
  });
  t.deepEqual(result.string, '');
});