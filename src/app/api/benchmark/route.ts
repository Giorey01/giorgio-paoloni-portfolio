import { NextResponse } from 'next/server';
import { getFoldersInFolder, getFirstImageFromFolder, getImagesFromFolder } from '@/utils/awsS3UtilityFunctions';

export const dynamic = 'force-dynamic';

export async function GET() {
  const start1 = performance.now();
  try {
    await getFoldersInFolder('Portfolio/');
  } catch (e) {
      // ignore
  }
  const end1 = performance.now();

  const start2 = performance.now();
  try {
    await getFoldersInFolder('Portfolio/');
  } catch (e) {
      // ignore
  }
  const end2 = performance.now();

  const start3 = performance.now();
  try {
    await getFirstImageFromFolder('Portfolio/Paesaggi/');
  } catch(e) {}
  const end3 = performance.now();

  const start4 = performance.now();
  try {
    await getFirstImageFromFolder('Portfolio/Paesaggi/');
  } catch(e) {}
  const end4 = performance.now();

  return NextResponse.json({
    getFoldersInFolder: {
      call1: end1 - start1,
      call2: end2 - start2,
    },
    getFirstImageFromFolder: {
      call1: end3 - start3,
      call2: end4 - start4,
    }
  });
}
