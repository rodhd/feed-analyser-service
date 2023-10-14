import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { SAXStream } from 'sax';
import { UpdateTaskDto } from 'src/tasks/dto/update-task.dto';
import { TaskStatus } from 'src/tasks/models/task.model';
import { TasksService } from 'src/tasks/tasks.service';

@Injectable()
export class AnalyserService {
    constructor(
        private taskService: TasksService,
        private readonly httpService: HttpService
    ) {}

    async analyse(id: string) {
        const task = await this.taskService.findOne(id);
        console.log(task)
        this.taskService.update(task.id, new UpdateTaskDto(TaskStatus.InProgress, null));

        const parser = new SAXStream(true);

        const data = [];
        let tempJob = {};

        parser.on("error", (e) => {
            console.error("error!", e)
            // clear the error
            parser._parser.error = null
            parser._parser.resume()
        });

        parser.on("opentag", (node) => {
            if (node.name === task.elementDescriptor) {
                tempJob = {};
            }
        });

        parser.on("text", (text) => {
            if(!!parser._parser.tag?.name) {
                tempJob[parser._parser.tag.name] += text;
            }
            
        });

        parser.on("closetag", (tagName) => {
            if(tagName === task.elementDescriptor) {
                data.push(tempJob);
                tempJob = {}
            }
        });

        parser.on("end", () => {
            console.log('Analysis finished');
            console.log(`Task ID: ${task.id} |  URL: ${task.feedUrl}`);
            console.log(`${data.length} jobs in the feed`);
            console.log(data.splice(0,5));
        });

        try {
            const response = await this.httpService.axiosRef.get(task.feedUrl, { responseType: "stream" });
            response.data.pipe(parser)

            this.taskService.update(task.id, new UpdateTaskDto(TaskStatus.Completed, data.length));
        } catch (error) {
            console.log(`Error fetching XML from remote server: ${error.message}`);
            this.taskService.update(task.id, new UpdateTaskDto(TaskStatus.Failed, null));
        }
    }
    
}
