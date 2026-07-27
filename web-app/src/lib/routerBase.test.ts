import { describe, it, expect } from 'vitest';
import { routerBasename } from './routerBase';

describe('routerBasename', () => {
  it('strips trailing slash from Vite base path', () => {
    expect(routerBasename('/Terminal_Games/')).toBe('/Terminal_Games');
  });

  it('keeps root as /', () => {
    expect(routerBasename('/')).toBe('/');
  });

  it('leaves basename without trailing slash unchanged', () => {
    expect(routerBasename('/Terminal_Games')).toBe('/Terminal_Games');
  });
});
