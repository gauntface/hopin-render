import { generateSubTemplate } from '../../build/factory/generateSubTemplate';

const { test } = require('ava');
const { genetateSubTemplate } = require('../../build/factory/generateSubTemplate');

test('genetateSubTemplate example', (t) => {
  generateSubTemplate();
  t.pass();
});
