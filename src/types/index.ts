export class BaseDTO {
  [key: string]: any;
  type: string;
  timesToRepeat?: number;
  id: string;
  value: unknown;

  constructor ({ type, timesToRepeat, id, value }: { type?: string; timesToRepeat?: number; id?: string; value?: any } = {}) {
    this.type = type ?? '';
    this.timesToRepeat = timesToRepeat ?? undefined;
    this.id = id ?? '';
    this.value = value ?? '';
  }
}

export interface BaseResponseDTO {
  endpoints: BaseDTO;
}
