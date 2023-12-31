import { Module } from '@nestjs/common';
import { TasksModule } from 'src/tasks/tasks.module';
import { AnalyserService } from './analyser.service';
import { TaskCreatedListener } from './listeners/task-created.listener';
import { HttpModule } from '@nestjs/axios';
import { FeedPost } from './models/post.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from 'src/tasks/models/task.model';
import { AnalyserController } from './analyser.controller';

@Module({
    imports: [SequelizeModule.forFeature([FeedPost, Task]), TasksModule, HttpModule],
    providers: [AnalyserService, TaskCreatedListener],
    controllers: [AnalyserController],
    exports: [SequelizeModule]
})
export class AnalyserModule {}
