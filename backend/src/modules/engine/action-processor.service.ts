import { Injectable } from "@nestjs/common";

@Injectable()
export class ActionProcessorService {
  parse(action: string) {
    return {
      type: 'generic',
      input: action,
    };
  }
}