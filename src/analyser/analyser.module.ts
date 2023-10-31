import { Module } from '@nestjs/common';
import { TasksModule } from 'src/tasks/tasks.module';
import { AnalyserService } from './analyser.service';
import { TaskCreatedListener } from './listeners/task-created.listener';
import { HttpModule } from '@nestjs/axios';
import { Post } from './models/post.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from 'src/tasks/models/task.model';

@Module({
    imports: [SequelizeModule.forFeature([Post, Task]), TasksModule, HttpModule],
    providers: [AnalyserService, TaskCreatedListener]
})
export class AnalyserModule {}
