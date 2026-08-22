import { csvBoolean, parseCsv } from '../csv';

describe('manual prospect CSV parsing', () => {
  it('preserves commas and escaped quotes inside quoted observations', () => {
    expect(parseCsv('Name,Observation\nAcme,"Slow, confusing ""request quote"" form"')).toEqual([
      ['Name', 'Observation'], ['Acme', 'Slow, confusing "request quote" form'],
    ]);
  });

  it('accepts explicit affirmative evidence values only', () => {
    expect(csvBoolean('YES')).toBe(true);
    expect(csvBoolean('false')).toBe(false);
    expect(csvBoolean(undefined)).toBe(false);
  });
});
