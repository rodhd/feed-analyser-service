import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { TaskCreatedEvent } from "src/tasks/events/task-created.event";
import { AnalyserService } from "../analyser.service";

@Injectable()
export class TaskCreatedListener {
    constructor(
        private analyserService: AnalyserService
    ) {}

    @OnEvent('task.created')
    async handleTaskCreatedEvent(event: TaskCreatedEvent) {
        console.log(`Handling task created event with ID ${event.id}`);
        await new Promise(r => setTimeout(r, 2000));
        this.analyserService.analyse(event.id);
    }
}