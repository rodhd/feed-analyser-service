import { Controller, Get, Param } from '@nestjs/common';
import { AnalyserService } from './analyser.service';

@Controller('analyser')
export class AnalyserController {
    constructor(private readonly analyserService: AnalyserService) {}
    @Get(':taskId')
    find(@Param('taskId') taskId: string) {
        return this.analyserService.findAll(taskId);
    }
}
