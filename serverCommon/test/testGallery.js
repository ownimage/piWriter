const  Gallery  = require('../ServerGallery');

const gallery = new Gallery();

const track1 =  { path: 'A', flipX: false, flipY: false};
const track1dup =  { path: 'A', flipX: false, flipY: false};
const track2 =  { path: 'A', flipX: false, flipY: true};
const track3 =  { path: 'A', flipX: true, flipY: false};
const track4 =  { path: 'A', flipX: true, flipY: true};

const valueA = 'A';
const valueB = 'B';
const valueC = 'C';
const valueD = 'D';

//test 1
const t1 = gallery.get(track1);
if (t1 != undefined) console.log('test 1 failure');

//test 2
if (gallery.keysEqual(track1, track2)) console.log('test 2 failure');

//test 3
if (!gallery.keysEqual(track1, track1dup)) console.log('test 3 failure');

//test 4
const test4_key = gallery.trackToKeyMapper(track2);
if (!gallery.keysEqual(track2, test4_key)) console.log('test 4 failure');

//test 5
const test5_gallery = new Gallery();
test5_gallery.put(track1, valueA);
test5_gallery.put(track2, valueB);
test5_gallery.put(track3, valueC);
if (test5_gallery.get(track1) !== valueA) console.log('test 5 failure 1');
if (test5_gallery.get(track2) !== valueB) console.log('test 5 failure 2');
if (test5_gallery.get(track3) !== valueC) console.log('test 5 failure 3');

//test 6
const test6_gallery = new Gallery();
test6_gallery.put(track1, valueA);
test6_gallery.put(track2, valueB);
test6_gallery.put(track3, valueC);
test6_gallery.put(track2, valueD);
if (test6_gallery.get(track1) !== valueA) console.log('test 6 failure 1');
if (test6_gallery.get(track2) !== valueD) console.log('test 6 failure 2');
if (test6_gallery.get(track3) !== valueC) console.log('test 6 failure 3');
