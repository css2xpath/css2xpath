'use strict';

var css2xpath = require('./index.js'),
    ANSI_RED    = '\x1B[31m',
    ANSI_GREEN  = '\x1B[32m',
    ANSI_RESET  = '\x1B[0m',
    CROSS_MARK  = '\u2718',
    CHECK_MARK  = '\u2714',
    PAD_LEFT    = '  ',
    PAD_RIGHT   = '  ',
    ASSERT_OK   = PAD_LEFT + ANSI_GREEN + CHECK_MARK + ANSI_RESET + PAD_RIGHT,
    ASSERT_FAIL = PAD_LEFT + ANSI_RED + CROSS_MARK + ANSI_RESET + PAD_RIGHT,
    success     = 0,
    total       = 0,
    status      = function () {
      return success + ' / ' + total + ' tests passing\n';
    };

console.log();

[
  [['a'], './/a'],
  [['a ', 'a  ', 'a *'], './/a//*'],
  [['a >', 'a > ', 'a > *'], './/a/*'],
  [['a +', 'a + ', 'a + *'], './/a/following-sibling::*[1]/self::*'],
  [['a ~', 'a ~ ', 'a ~ *'], './/a/following-sibling::*'],
  [['a:nth(x)', 'a:nth(0)', 'a:eq(x)', 'a:eq(0)'], '(.//a)[1]']
].forEach(function (test) {
  var expected = test[1];

  test[0].forEach(function (input) {
    var result = css2xpath(input);

    if (result === expected) {
      console.log(ASSERT_OK + JSON.stringify(input));
      success++;
    } else {
      console.error(
        ASSERT_FAIL + JSON.stringify(input) +
        PAD_LEFT + PAD_LEFT +
        JSON.stringify(result) + ' != ' +
        JSON.stringify(expected));
    }

    total++;
  });
});

console.log('\n');

if (success !== total) {
  console.log(ASSERT_FAIL + status());
  process.exit(1);
}

console.log(ASSERT_OK + status());
