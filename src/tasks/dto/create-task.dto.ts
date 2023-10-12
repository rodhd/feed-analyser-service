export class CreateTaskDto {
    feedUrl: string

    constructor(feedUrl: string) {
        this.feedUrl = feedUrl;
    }
}
