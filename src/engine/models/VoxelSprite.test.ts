import { vec3 } from "gl-matrix";
import { VoxelModel } from "./VoxelModel";
import { VoxelSprite } from "./VoxelSprite";
import { AxisAlignedBox } from "./AxisAlignedBox";

describe('VoxelSprite.getBoundingBox', () => {
  it('returns correct bounding box for single frame sprite at origin', () => {
    const frame = new VoxelModel(0, 2, 2, 2, []); // Size 2x2x2
    const sprite = new VoxelSprite([frame], vec3.fromValues(0, 0, 0));
    const expectedBox = new AxisAlignedBox(vec3.fromValues(-1, -1, -1), vec3.fromValues(1, 1, 1));
    expect(sprite.getBoundingBox()).toEqual(expectedBox);
  });

  it('returns correct bounding box for single frame sprite at non-origin position', () => {
    const frame = new VoxelModel(0, 2, 2, 2, []); // Size 2x2x2
    const sprite = new VoxelSprite([frame], vec3.fromValues(3, 3, 3));
    const expectedBox = new AxisAlignedBox(vec3.fromValues(2, 2, 2), vec3.fromValues(4, 4, 4));
    expect(sprite.getBoundingBox()).toEqual(expectedBox);
  });

  it('returns correct bounding box for single frame sprite at "odd" non-origin position and "odd" size', () => {
    const frame = new VoxelModel(0, 3, 3, 3, []); // Size 2x2x2
    const sprite = new VoxelSprite([frame], vec3.fromValues(3, 3, 3));
    const expectedBox = new AxisAlignedBox(vec3.fromValues(2, 2, 2), vec3.fromValues(4, 4, 4));
    expect(sprite.getBoundingBox()).toEqual(expectedBox);
  });

  it('returns correct bounding box for single frame sprite at "even" non-origin position and "odd" size', () => {
    const frame = new VoxelModel(0, 3, 3, 3, []); // Size 2x2x2
    const sprite = new VoxelSprite([frame], vec3.fromValues(3, 3, 3));
    const expectedBox = new AxisAlignedBox(vec3.fromValues(2, 2, 2), vec3.fromValues(4, 4, 4));
    expect(sprite.getBoundingBox()).toEqual(expectedBox);
  });

  it('returns correct bounding box for multi-frame sprite, testing non-initial frame', () => {
    const frame1 = new VoxelModel(0, 2, 2, 2, []); // Size 2x2x2
    const frame2 = new VoxelModel(0, 4, 4, 4, []); // Size 4x4x4
    const sprite = new VoxelSprite([frame1, frame2], vec3.fromValues(0, 0, 0), { animationFrameDuration: 1 });
    sprite.update(1); // Advance to the next frame
    const expectedBox = new AxisAlignedBox(vec3.fromValues(-2, -2, -2), vec3.fromValues(2, 2, 2));
    expect(sprite.getBoundingBox()).toEqual(expectedBox);
  });
});