import { Module } from '@nestjs/common';
import { ActionParserService } from './action-parser.service';

@Module({
  providers: [ActionParserService],
  exports: [ActionParserService]
})
export class ActionParserModule {}