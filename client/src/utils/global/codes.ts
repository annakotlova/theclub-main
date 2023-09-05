type Config = {
  length?: number;
  count?: number;
  prefix?: string;
  type?: 'charset' | 'numberset';
};

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomElement = (array: string) => array[randomInt(0, array.length - 1)];

const placeholder = '#';
const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numberset = '0123456789';

const createConfig = (config: Config) => ({
  pattern: placeholder.repeat(config.length ?? 8),
  prefix: config.prefix ?? '',
  count: config.count || 1,
  type: config.type || 'charset',
});

function generateCode(prefix: Config['prefix'], pattern: string, type: Config['type']) {
  let code = '';
  for (const p of pattern)
    if (p === placeholder) code += randomElement(type === 'charset' ? charset : numberset);
  return `${prefix}${code}`;
}

export function generateCodes(config: Config): string | string[] {
  const { pattern, prefix, count, type } = createConfig(config);
  let codes = [] as string[];
  for (let i = 0; i < count; i++) codes = [...codes, generateCode(prefix, pattern, type)];
  
  if (count === 1) return codes[0] as string;
  return codes;
}
