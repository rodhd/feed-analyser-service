export class CreateTaskDto {
    feedUrl: string;
    listingDescriptor: string;
    elementDescriptor: string;
    fields: string[]


    constructor(feedUrl: string, listingDescriptor: string, elementDescriptor: string, fields: string[]) {
        this.feedUrl = feedUrl;
        this.listingDescriptor = listingDescriptor;
        this.elementDescriptor = elementDescriptor;
        this.fields = fields;
    }
}
