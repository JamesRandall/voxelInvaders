import { vec3 } from "gl-matrix";
import { WorldObject } from "./WorldObject";

describe('WorldObject', () => {
  it('should correctly initialize with default values', () => {
    const position = vec3.fromValues(1, 2, 3);
    const worldObject = new WorldObject(position);
    expect(worldObject.position).toEqual(position);
    expect(worldObject.velocity).toEqual(vec3.fromValues(0, 0, 0));
  });

  it('position getter returns the current position', () => {
    const position = vec3.fromValues(7, 8, 9);
    const worldObject = new WorldObject(position);
    expect(worldObject.position).toEqual(position);
  });

  it('moveBy updates the position correctly', () => {
    const position = vec3.fromValues(0, 0, 0);
    const delta = vec3.fromValues(1, 1, 1);
    const worldObject = new WorldObject(position);
    worldObject.moveBy(delta);
    expect(worldObject.position).toEqual(vec3.fromValues(1, 1, 1));
  });

  it('updatePosition updates position based on velocity and frameLength with unit based movement when unit reached', () => {
    const position = vec3.fromValues(0, 0, 0);
    const velocity = vec3.fromValues(1, 1, 1);
    const worldObject = new WorldObject(position);
    worldObject.velocity = velocity;
    worldObject.updatePosition(2);
    expect(worldObject.position).toEqual(vec3.fromValues(2, 2, 2));
  });

  it('updatePosition does not update position based on velocity and frameLength with unit based movement when unit not reached', () => {
    const position = vec3.fromValues(0, 0, 0);
    const velocity = vec3.fromValues(1, 1, 1);
    const worldObject = new WorldObject(position);
    worldObject.velocity = velocity;
    worldObject.updatePosition(0.5);
    expect(worldObject.position).toEqual(vec3.fromValues(0, 0, 0));
  });

  it('updatePosition updates position based on velocity and frameLength with unit based movement when unit reached with two updates', () => {
    const position = vec3.fromValues(0, 0, 0);
    const velocity = vec3.fromValues(1, 1, 1);
    const worldObject = new WorldObject(position);
    worldObject.velocity = velocity;
    worldObject.updatePosition(0.5);
    worldObject.updatePosition(0.5);
    expect(worldObject.position).toEqual(vec3.fromValues(1, 1, 1));
  });

  it('updatePosition partially updates position based on velocity and frameLength with unit based movement when unit not reached', () => {
    const position = vec3.fromValues(0, 0, 0);
    const velocity = vec3.fromValues(1, 1, 1);
    const worldObject = new WorldObject(position);
    worldObject.velocity = velocity;
    worldObject.updatePosition(0.5);
    worldObject.updatePosition(0.5);
    worldObject.updatePosition(0.5);

    expect(worldObject.position).toEqual(vec3.fromValues(1, 1, 1));
  });

  it('updatePosition partially updates position based on velocity and frameLength with unit based movement when unit reached on two steps', () => {
    const position = vec3.fromValues(0, 0, 0);
    const velocity = vec3.fromValues(1, 1, 1);
    const worldObject = new WorldObject(position);
    worldObject.velocity = velocity;
    worldObject.updatePosition(0.5);
    worldObject.updatePosition(0.5);
    worldObject.updatePosition(0.5);
    worldObject.updatePosition(0.5);

    expect(worldObject.position).toEqual(vec3.fromValues(2, 2, 2));
  });

  it('constrains position within the given positionConstraint', () => {
    const position = vec3.fromValues(5, 5, 5);
    const worldObject = new WorldObject(position);
    worldObject.positionConstraint = { min: vec3.fromValues(0, 0, 0), max: vec3.fromValues(10, 10, 10) };
    worldObject.moveBy(vec3.fromValues(10, 10, 10)); // Attempt to move outside constraints
    // Check if position is constrained correctly
  });
});