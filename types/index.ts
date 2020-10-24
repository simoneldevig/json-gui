export class BaseDTO {
  type: string;
  timesToRepeat?: number;
  id: string;
  value: any;

  constructor({ type, timesToRepeat, id, value }: { type?: string; timesToRepeat?: number; id?: string; value?: any; } = {}) {
    this.type = type ?? '';
    this.timesToRepeat = timesToRepeat ?? undefined;
    this.id = id ?? '';
    this.value = value ?? '';
  }
}
