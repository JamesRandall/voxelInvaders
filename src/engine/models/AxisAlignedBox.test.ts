import { vec3 } from "gl-matrix";
import { AxisAlignedBox } from "./AxisAlignedBox";

describe('AxisAlignedBox.intersection', () => {
  it('returns null when boxes do not intersect', () => {
    const boxA = new AxisAlignedBox(vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1));
    const boxB = new AxisAlignedBox(vec3.fromValues(2, 2, 2), vec3.fromValues(3, 3, 3));
    expect(AxisAlignedBox.intersection(boxA, boxB)).toBeNull();
  });

  it('returns correct box when one is fully within another', () => {
    const boxA = new AxisAlignedBox(vec3.fromValues(0, 0, 0), vec3.fromValues(3, 3, 3));
    const boxB = new AxisAlignedBox(vec3.fromValues(1, 1, 1), vec3.fromValues(2, 2, 2));
    const expectedIntersection = new AxisAlignedBox(vec3.fromValues(1, 1, 1), vec3.fromValues(2, 2, 2));
    expect(AxisAlignedBox.intersection(boxA, boxB)).toEqual(expectedIntersection);
  });

  it('returns correct box for partial intersection', () => {
    const boxA = new AxisAlignedBox(vec3.fromValues(0, 0, 0), vec3.fromValues(2, 2, 2));
    const boxB = new AxisAlignedBox(vec3.fromValues(1, 1, 1), vec3.fromValues(3, 3, 3));
    const expectedIntersection = new AxisAlignedBox(vec3.fromValues(1, 1, 1), vec3.fromValues(2, 2, 2));
    expect(AxisAlignedBox.intersection(boxA, boxB)).toEqual(expectedIntersection);
  });

  it('considers touching edges as intersection', () => {
    const boxA = new AxisAlignedBox(vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1));
    const boxB = new AxisAlignedBox(vec3.fromValues(1, 1, 1), vec3.fromValues(2, 2, 2));
    const expectedIntersection = new AxisAlignedBox(vec3.fromValues(1, 1, 1), vec3.fromValues(1, 1, 1));
    expect(AxisAlignedBox.intersection(boxA, boxB)).toEqual(expectedIntersection);
  });
});