import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './models/task.model';
import { InjectModel } from '@nestjs/sequelize';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TaskCreatedEvent } from './events/task-created.event';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task)
    private taskRepository: typeof Task,
    private eventEmitter: EventEmitter2
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = new Task();
    task.feedUrl = createTaskDto.feedUrl;
    task.listingDescriptor = createTaskDto.listingDescriptor;
    task.elementDescriptor = createTaskDto.elementDescriptor;
    task.fields = createTaskDto.fields;
    task.save();

    console.log(`Task was created ${task.id}`)
    this.eventEmitter.emit(
      'task.created',
      new TaskCreatedEvent(task.id)
    );
    return task;
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.findAll();
  }

  async findOne(id: string) : Promise<Task> {
    return this.taskRepository.findOne({
      where: {
        id,
      }
    })
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) : Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: {
        id,
      }
    });
    if(updateTaskDto.status === TaskStatus.InProgress) {
      task.status = TaskStatus.InProgress;
      task.updatedAt = new Date();
    }
    if(updateTaskDto.status === TaskStatus.Failed) {
      task.status = TaskStatus.Failed;
      task.completedAt = new Date();
      task.updatedAt = new Date();
    }
    if(updateTaskDto.status === TaskStatus.Completed) {
      task.status = TaskStatus.Completed;
      task.completedAt = new Date();
      task.numberOfPosts = updateTaskDto.numberOfResults;
      task.updatedAt = new Date();
    }
    await task.save()
    return task;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
