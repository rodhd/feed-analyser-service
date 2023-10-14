import { Module } from '@nestjs/common';
import { TasksModule } from 'src/tasks/tasks.module';
import { AnalyserService } from './analyser.service';
import { TaskCreatedListener } from './listeners/task-created.listener';
import { HttpModule } from '@nestjs/axios';
import { timeout } from 'rxjs';

@Module({
    imports: [TasksModule, HttpModule],
    providers: [AnalyserService, TaskCreatedListener]
})
export class AnalyserModule {}
