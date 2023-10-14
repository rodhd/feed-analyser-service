export class CreateTaskDto {
    feedUrl: string;
    listingDescriptor: string;
    elementDescriptor: string;


    constructor(feedUrl: string, listingDescriptor: string, elementDescriptor: string) {
        this.feedUrl = feedUrl;
        this.listingDescriptor = listingDescriptor;
        this.elementDescriptor = elementDescriptor;
    }
}
