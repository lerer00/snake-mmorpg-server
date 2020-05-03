import { Guid } from "guid-typescript";
import { Circle } from "./utilities/shapes";

export default class Section extends Circle {
    public guid: string;
    public isHead: boolean;

    constructor(x: number, y: number, radius: number) {
        super(x, y, radius);
        this.guid = Guid.create().toString();
        this.isHead = false;
    }

    public serialize(): any {
        return {
            ...(super.serialize()),
            guid: this.guid,
            isHead: this.isHead
        }
    }
}