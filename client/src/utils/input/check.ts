import { StructureModule } from '@/interfaces/common/structure.dto';

export function commonVerifyInputs(module: StructureModule): {
  status: boolean;
  input?: Record<string, any>;
  message?: boolean;
} {
  for (const key in module.data) {
    const input = module.inputs.find((i) => i.id === key);
    if (!input) continue;
    const drop_or_selector = input.type.includes('drop') || input.type.includes('selector');
    if (drop_or_selector && !module.data[key] && input.required) {
      input.error = true;
      return { status: false, input, message: true };
    }
    let value = module.data[key];
    if (input.type === 'number') value = Number(value);
    if (!value && value !== 0 && input.required) {
      input.error = true;
      return { status: false, input };
    } else {
      input.error = false;
    }
  }
  return { status: true };
}
