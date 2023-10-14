import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './tasks/models/task.model';
import { TasksModule } from './tasks/tasks.module';
import { AnalyserService } from './analyser/analyser.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AnalyserModule } from './analyser/analyser.module';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'feed_analyser_service',
      models: [Task],
      /*
      autoLoadModels: true,
      synchronize: true,
      */
    }),
    EventEmitterModule.forRoot(),
    HttpModule,
    TasksModule,
    AnalyserModule
  ],
  controllers: [AppController],
  providers: [AppService, AnalyserService],
})
export class AppModule {}
