import { Model } from './model'

export interface EndpointReponseDTO {
  endpoint: Endpoint;
}

export interface Endpoint extends Model {
  timesToRepeat: string;
}
