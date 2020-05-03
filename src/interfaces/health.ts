import { HealthStatus } from "../config";

export default interface IHealth {
    status: HealthStatus;
    health: [number, number];
    hit: (value: number) => HealthStatus
    heal: (value: number) => HealthStatus
}