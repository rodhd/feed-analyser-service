import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './models/task.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task)
    private taskRepository: typeof Task
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const task = new Task();
    task.feedUrl = createTaskDto.feedUrl;
    return task.save();
  }

  findAll() {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
