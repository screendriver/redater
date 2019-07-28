import test from 'tape';
import { Ora } from 'ora';
import sinon from 'sinon';
import { readExifDate, NoExifDate, ExifDate } from '../src/image';

test('returns "not ok" when image has no exif data', async t => {
  t.plan(1);
  const images = ['./test/assets/test-image.jpg'];
  const stopAndPersist = sinon.fake();
  const spinner: Partial<Ora> = { stopAndPersist };
  const actual = await Promise.all(readExifDate(spinner as Ora)(images));
  const expected: [NoExifDate] = [{ ok: false }];
  t.deepEqual(actual, expected);
});

test('stops spinner and sets a text on it when image has no exif data', async t => {
  t.plan(2);
  const images = ['./test/assets/test-image.jpg'];
  const stopAndPersist = sinon.fake();
  const spinner: Partial<Ora> = { stopAndPersist };
  await Promise.all(readExifDate(spinner as Ora)(images));
  t.equal(spinner.text, 'No EXIF data found in ./test/assets/test-image.jpg');
  t.equal(stopAndPersist.callCount, 1);
});

test('returns "ok" when image has exif data', async t => {
  t.plan(1);
  const images = ['./test/assets/test-image-exif.jpg'];
  const stopAndPersist = sinon.fake();
  const spinner: Partial<Ora> = { stopAndPersist };
  const actual = await Promise.all(readExifDate(spinner as Ora)(images));
  const expected: ExifDate[] = [
    {
      ok: true,
      createDate: '2006:08:19 17:39:00',
      filePath: './test/assets/test-image-exif.jpg',
    },
  ];
  t.deepEqual(actual, expected);
});

test('rejecets when image could not be found', async t => {
  t.plan(1);
  const images = ['./non-existing-image.jpg'];
  const stopAndPersist = sinon.fake();
  const spinner: Partial<Ora> = { stopAndPersist };
  try {
    await Promise.all(readExifDate(spinner as Ora)(images));
  } catch (e) {
    const expected = e.message.includes(
      "ENOENT: no such file or directory, open './non-existing-image.jpg",
    );
    t.true(expected);
  }
});
