export default interface ISpatial {
    speed: number;
    velocity: [number, number];

    getSpeed: () => number;
    setSpeed: (speed: number) => void;
    getVelocity: () => [number, number];
    getVelocityX: () => number;
    getVelocityY: () => number;
    setVelocityX: (velocity: number) => void;
    setVelocityY: (velocity: number) => void;
    setVelocity: (velocity: [number, number]) => void;
}
