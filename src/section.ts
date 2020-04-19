import Placeholder from "./placeholder";
import { Guid } from "guid-typescript";

export default class Section extends Placeholder {
    private _guid: Guid;
    private _radius: number;

    constructor(x: number, y: number, radius: number) {
        super(x, y);
        this._guid = Guid.create();
        this._radius = radius;
    }

    public serialize(): any {
        return {
            ...(super.serialize()),
            guid: this._guid.toString(),
            radius: this._radius
        }
    }
}