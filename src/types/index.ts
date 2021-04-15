export class BaseDTO {
  [key: string]: any;
  type: string;
  timesToRepeat?: number;
  id: string;
  value: any;

  constructor ({ type, timesToRepeat, id, value }: { type?: string; timesToRepeat?: number; id?: string; value?: any } = {}) {
    this.type = type ?? '';
    this.id = id ?? '';
    this.value = value ?? {};
    if (timesToRepeat) {
      this.timesToRepeat = timesToRepeat;
    }
  }
}

export interface BaseResponseDTO {
  endpoints: BaseDTO;
}
