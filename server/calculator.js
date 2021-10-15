/*
 * Простая фунция-калькулятор, которая принимает на три аргумента:
 * arg1 - число
 * arg2 - число
 * operator - строка вида '+', '-', '/' или '*'
 * при несоответствии аргументов типу или значению (operator), а также
 * при делении на ноль фунция должна возвращать null.
 * Во всех остальных случаях - результат математической операции operator
 * на аргуметнами arg1 и arg2.
 */
function calc(arg1, arg2, operation) {
  const calculate = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '/': (a, b) => (b != 0) ? a / b : null,
    '*': (a, b) => a * b
  }
  return (typeof(arg1) != 'number' || typeof(arg2) != 'number' ||
    typeof(calculate[operation]) === 'undefined') ?
    null : calculate[operation](arg1, arg2);
}

module.exports = {
  calc: calc
};
