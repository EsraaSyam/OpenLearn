import { SectionResponse } from "./section.response";

export class FindSectionResponse {
    sections: SectionResponse[];
    total: number;
    page: number;
    limit: number;
    numberOfPages: number;
    isLast: boolean;

    constructor(sections: any, total: number, page: number, limit: number) {
        this.sections = sections.map((section) => new SectionResponse(section));
        this.total = total;
        this.page = page;
        this.limit = limit;
        this.numberOfPages = Math.ceil(total / limit);
        this.isLast = page === this.numberOfPages;
    }

}