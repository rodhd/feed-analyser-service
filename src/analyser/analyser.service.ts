import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser';
import { UpdateTaskDto } from 'src/tasks/dto/update-task.dto';
import { TaskStatus } from 'src/tasks/models/task.model';
import { TasksService } from 'src/tasks/tasks.service';
import { InjectModel } from '@nestjs/sequelize';
import { FeedPost } from './models/post.model';

@Injectable()
export class AnalyserService {
    constructor(
        private taskService: TasksService,
        private readonly httpService: HttpService,
        @InjectModel(FeedPost)
        private postRepository: typeof FeedPost
    ) { }

    async analyseV2(id: string) {
        const task = await this.taskService.findOne(id);
        console.log(task)
        this.taskService.update(task.id, new UpdateTaskDto(TaskStatus.InProgress, null));

        try {
            const response = await this.httpService.axiosRef.get(task.feedUrl);
            const parser = new XMLParser();

            let parsedData = parser.parse(response.data);
            const posts = parsedData[task.listingDescriptor][task.elementDescriptor]
            this.taskService.update(task.id, new UpdateTaskDto(TaskStatus.Completed, posts.length));
            if (task.fields.length > 0) {
                await this.writePosts(task.id, task.fields, posts)
            }
        } catch (error) {
            console.log(`Error fetching XML from remote server: ${error.message}`);
            this.taskService.update(task.id, new UpdateTaskDto(TaskStatus.Failed, null));
        }

    }

    async findAll(taskId: string): Promise<FeedPost[]> {
        return this.postRepository.findAll({
            where: {
                taskId,
            },
            limit: 1000
        });
    }

    async writePosts(taskId: string, fields: string[], data: object[]) {
        data.forEach((element) => {
            const post = new FeedPost();
            post.taskId = taskId;
            const extractedData = {};
            for (const f of fields) {
                if (Object.keys(element).includes(f)) {
                    extractedData[f] = element[f];
                }
            }
            post.data = extractedData;
            post.save();
        });
    }

}
