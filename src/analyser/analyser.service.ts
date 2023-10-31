import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as sax from 'sax';
import { XMLParser } from 'fast-xml-parser';
import { UpdateTaskDto } from 'src/tasks/dto/update-task.dto';
import { TaskStatus } from 'src/tasks/models/task.model';
import { TasksService } from 'src/tasks/tasks.service';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './models/post.model';

@Injectable()
export class AnalyserService {
    constructor(
        private taskService: TasksService,
        private readonly httpService: HttpService
    ) { }

    async analyse(id: string) {
        const task = await this.taskService.findOne(id);
        console.log(task)
        this.taskService.update(task.id, new UpdateTaskDto(TaskStatus.InProgress, null));

        const parser = sax.createStream(true);

        const data = [];
        let tempJob = {};
        const log = [];

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
            if (!!parser._parser.tag?.name) {
                tempJob[parser._parser.tag.name] += text;
            }
        });

        parser.on("pipe", (pipe) => {
            if (!!parser._parser.tag?.name) {
                tempJob[parser._parser.tag.name] += pipe;
            }
        });

        parser.on("cdata", (data) => {
            if (!!parser._parser.tag?.name) {
                tempJob[parser._parser.tag.name] += data;
            }
        });

        parser.on("data", (data) => {
            console.log(data)
            if (!!parser._parser.tag?.name) {
                tempJob[parser._parser.tag.name] += data;
            }
        });

        parser.on("closetag", (tagName) => {
            if (tagName === task.elementDescriptor) {
                data.push(tempJob);
                tempJob = {}
            }
        });

        parser.on("end", () => {
            console.log('Analysis finished');
            console.log(`Task ID: ${task.id} |  URL: ${task.feedUrl}`);
            console.log(`${data.length} jobs in the feed`);
            console.log(data.splice(0, 5));
            console.log(log.splice(0, 100))
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

    async analyseV2(id: string) {
        const task = await this.taskService.findOne(id);
        console.log(task)
        this.taskService.update(task.id, new UpdateTaskDto(TaskStatus.InProgress, null));

        try {
            const response = await this.httpService.axiosRef.get(task.feedUrl);
            const parser = new XMLParser();

            let parsedData = parser.parse(response.data);
            const posts =  parsedData[task.listingDescriptor][task.elementDescriptor]
            this.taskService.update(task.id, new UpdateTaskDto(TaskStatus.Completed, posts.length));
            if(task.fields.length > 0) {
                await this.writePosts(task.id, task.fields, posts)
            }
        } catch (error) {
            console.log(`Error fetching XML from remote server: ${error.message}`);
            this.taskService.update(task.id, new UpdateTaskDto(TaskStatus.Failed, null));
        }
        
    }

    async writePosts(taskId: string, fields: string[], data: object[]) {
        data.forEach((element) => {
            const post = new Post();
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
