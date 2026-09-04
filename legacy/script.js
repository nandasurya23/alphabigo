/**
 * ALPHA × BIGO HOST INCOME CALCULATOR - MASTER ENGINE BRIDGE
 * Re-exports modular architecture for Node.js test runners and backward compatibility
 */

const policies = require('./js/policy-constants');
const formatters = require('./js/formatters');
const calc = require('./js/calculation-engine');
const advisor = require('./js/advisor-engine');

module.exports = {
  ...policies,
  ...formatters,
  ...calc,
  ...advisor
};
