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
      if (parts[1]) acc.push(parts[1]);
    }
    return acc;
  }, []);
}

console.log("Starting benchmarks...");

// warmup
for (let i = 0; i < 1000; i++) {
  original(folders);
  optimizedReduce(folders);
}

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
