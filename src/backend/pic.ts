import Jimp from "jimp";

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
  const img = await Jimp.read(srcImg);
  img.crop(x, y, width, height);
  await img.writeAsync(destImg);
}

/**
 * 缩放图片
 * @param srcImg    待缩放的图片路径
 * @param destImg   缩放后的图片路径
 * @param width     目标宽度
 * @param height    目标高度
 */
export async function resizeImg(srcImg: string, destImg: string, width: number, height: number): Promise<void> {
  const img = await Jimp.read(srcImg);
  img.resize(width, height);
  await img.writeAsync(destImg);
}

export type cropOptType = {
  width: number;
  height: number;
  x: number;
  y: number;
}

export type outputOptType = {
  width: number;
  height: number;
}

export async function cropPicture(src: string, dst: string, crop: cropOptType, out: outputOptType) {
  const img = await Jimp.read(src);
  img.crop(crop.x, crop.y, crop.width, crop.height);
  img.resize(out.width, out.height);
  await img.quality(100).writeAsync(dst);
}
