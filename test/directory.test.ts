import test from 'ava';
import path from 'path';
import {
  getAllFiles,
  filterImages,
  resolveImagesFullPath,
} from '../src/directory';

test('getAllFiles() returns all files from given directory path', async t => {
  const actual = await getAllFiles('./test/assets');
  const expected = ['test-image-exif.jpg', 'test-image.jpg', 'text-only.txt'];
  t.deepEqual(actual, expected);
});

test('filterImages() filters all images from given files', t => {
  const files = ['./test/assets/test-image.jpg', './test/assets/text-only.txt'];
  const actual = filterImages(files);
  const expected = ['./test/assets/test-image.jpg'];
  t.deepEqual(actual, expected);
});

test('resolveImagesFullPath() returns the absolute path of the given image', t => {
  const actual = resolveImagesFullPath('./test/assets')([
    'test-image.jpg',
    'next-image.jpg',
  ]);
  const expected = [
    path.resolve('./test/assets', 'test-image.jpg'),
    path.resolve('./test/assets', 'next-image.jpg'),
  ];
  t.deepEqual(actual, expected);
});
