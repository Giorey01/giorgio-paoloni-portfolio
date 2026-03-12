const iterations = 10000;
const arraySize = 10000;

function generateData(size) {
  const data = [];
  for (let i = 0; i < size; i++) {
    if (i % 4 === 0) data.push({});
    else if (i % 4 === 1) data.push({ Key: `Portfolio/folder${i}` });
    else if (i % 4 === 2) data.push({ Key: null });
    else data.push({ Key: `Portfolio/` }); // empty slug
  }
  return data;
}

const folders = generateData(arraySize);

function original(folders) {
  const validFolders = folders.filter(
    (folder) =>
      folder.Key !== undefined && folder.Key !== null
  );

  const slugs = validFolders
    .map((folder) => {
      const parts = folder.Key.split("/");
      return parts[1] || null;
    })
    .filter((slug) => slug !== null);

  return slugs.map((slug) => ({
    slug,
  }));
}

function optimizedReduce(folders) {
  return folders.reduce((acc, folder) => {
    if (folder.Key != null) {
      const parts = folder.Key.split("/");
      if (parts[1]) acc.push({ slug: parts[1] });
    }
    return acc;
  }, []);
}

function optimizedFlatMap(folders) {
  return folders.flatMap(folder => {
    if (folder.Key != null) {
      const parts = folder.Key.split("/");
      if (parts[1]) return [{ slug: parts[1] }];
    }
    return [];
  });
}

// Warmup
for (let i = 0; i < 100; i++) {
  original(folders);
  optimizedReduce(folders);
  optimizedFlatMap(folders);
}

console.log("Starting benchmarks...");

console.time('original');
for (let i = 0; i < iterations; i++) {
  original(folders);
}
console.timeEnd('original');

console.time('optimizedReduce');
for (let i = 0; i < iterations; i++) {
  optimizedReduce(folders);
}
console.timeEnd('optimizedReduce');

console.time('optimizedFlatMap');
for (let i = 0; i < iterations; i++) {
  optimizedFlatMap(folders);
}
console.timeEnd('optimizedFlatMap');

// Verify correctness
const r1 = original(folders);
const r2 = optimizedReduce(folders);
const r3 = optimizedFlatMap(folders);

console.log("Results matching (original === reduce):", JSON.stringify(r1) === JSON.stringify(r2));
console.log("Results matching (original === flatMap):", JSON.stringify(r1) === JSON.stringify(r3));
