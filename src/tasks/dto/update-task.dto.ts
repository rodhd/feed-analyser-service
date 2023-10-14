import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { TaskStatus } from '../models/task.model';

export class UpdateTaskDto {
    status: TaskStatus;
    numberOfResults?: number;

    constructor(status: TaskStatus, numberOfResults?: number) {
        this.status = status;
        this.numberOfResults = numberOfResults;
    }
}
