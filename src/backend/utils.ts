import * as fs from 'fs';
const gm = require('gm').subClass({ imageMagick: '7+' });

/**
 * 裁剪图片
 * @param srcImg    待裁剪的图片路径
 * @param destImg   裁剪后的图片路径
 * @param width     宽度
 * @param height    高度
 * @param x         x坐标
 * @param y         y坐标
 */
export async function cropImg(srcImg: string, destImg: string, width: number, height: number, x: number, y: number):Promise<void> {
  return new Promise((resolve, reject) => {
    gm(srcImg).crop(width, height, x, y).write(destImg, function (err: any) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  })
}

/**
 * 缩放图片
 * @param srcImg    待缩放的图片路径
 * @param size      缩放后的图片大小(长宽均为size)
 */
export async function resizeCurrentImg(srcImg: string, size: number): Promise<void> {
  return new Promise((resolve, reject) => {
    gm(srcImg).resize(size, size).quality(100).write(srcImg, function (err: any) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  })
}
