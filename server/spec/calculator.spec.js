'use strict';
const calculator = require('../calculator');
const calc = calculator.calc;

describe('Функция calc()', () => {
  it('должна возвращать 175 при аргументах 35, 5, "*"', () => {
    expect(calc(35, 5, '*')).toBe(175);
  });
  it('должна возвращать 7 при аргументах 35, 5, "/"', () => {
    expect(calc(35, 5, '/')).toBe(7);
  });
  it('должна возвращать 40 при аргументах 35, 5, "+"', () => {
    expect(calc(35, 5, '+')).toBe(40);
  });
  it('должна возвращать 30 при аргументах 35, 5, "-"', () => {
    expect(calc(35, 5, '-')).toBe(30);
  });
  it('должна возвращать null при аргументах 35, 0, "/"', () => {
    expect(calc(35, 0, '/')).toBeNull();
  });
  it('должна возвращать null при аргументах null, 0, "-"', () => {
    expect(calc(null, 0, '-')).toBeNull();
  });
  it('должна возвращать null при аргументах 35, null, "*"', () => {
    expect(calc(35, null, '*')).toBeNull();
  });
  it('должна возвращать null при аргументах 35, 0, null', () => {
    expect(calc(35, 0, null)).toBeNull();
  });
  it('должна возвращать null при аргументах "35", 0, "+"', () => {
    expect(calc('35', 0, '+')).toBeNull();
  });
  it('должна возвращать null при аргументах 35, "0", "*"', () => {
    expect(calc(35, '0', '/')).toBeNull();
  });
  it('должна возвращать null при аргументах 35, 0', () => {
    expect(calc(35, 0)).toBeNull();
  });
  it('должна возвращать null с аргументом 35', () => {
    expect(calc(35)).toBeNull();
  });
  it('должна возвращать null без аргументов', () => {
    expect(calc()).toBeNull();
  });
});
