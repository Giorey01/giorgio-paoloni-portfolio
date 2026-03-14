import fs from 'fs/promises';
import path from 'path';
import { PaperTexture } from "@/components/ScrapbookDecorations";
import ScrapbookCard from '@/components/ScrapbookCard';

interface ImageDetail {
  url: string;
  blurDataURL: string;
}

interface ImageUrlsData {
  [folderKey: string]: ImageDetail[];
}

export default async function Home() {
  let imageData: ImageUrlsData = {};
  const jsonFilePath = path.join(process.cwd(), 'src', 'data', 'image_urls.json');

  try {
    const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
    imageData = JSON.parse(fileContent) as ImageUrlsData;
  } catch (error) {
    console.error("Failed to read or parse image_urls.json:", error);
  }

  const portfolioFolders = Object.entries(imageData).reduce((acc: { folderKey: string; coverImageUrl: string; blurDataURL: string }[], [folderKey, imageObjects]) => {
    if (folderKey.startsWith("Portfolio/") && imageObjects && imageObjects.length > 0 && imageObjects[0] && imageObjects[0].url) {
      acc.push({
        folderKey,
        coverImageUrl: imageObjects[0].url,
        blurDataURL: imageObjects[0].blurDataURL || "",
      });
    }
    return acc;
  }, []);

  // Per creare un effetto "caotico" ma controllato, definiamo un array di stili preimpostati (rotazioni, margini, z-index).
  // Li applicheremo in ciclo (modulo) agli elementi per non avere un collage completamente randomico e ingestibile.
  const collageStyles = [
    { rotation: "rotate-[-3deg]", zIndex: 10, tapePosition: "top" as const, stampType: "none" as const, marginTop: "mt-0" },
    { rotation: "rotate-[4deg]", zIndex: 20, tapePosition: "corners" as const, stampType: "none" as const, marginTop: "md:mt-24 mt-12" },
    { rotation: "rotate-[-1deg]", zIndex: 5, tapePosition: "bottom" as const, stampType: "scribble" as const, marginTop: "md:mt-8 mt-4" },
    { rotation: "rotate-[2deg]", zIndex: 30, tapePosition: "top" as const, stampType: "none" as const, marginTop: "md:-mt-16 -mt-8" },
    { rotation: "rotate-[-5deg]", zIndex: 15, tapePosition: "corners" as const, stampType: "none" as const, marginTop: "md:mt-32 mt-16" },
    { rotation: "rotate-[1deg]", zIndex: 25, tapePosition: "bottom" as const, stampType: "none" as const, marginTop: "md:-mt-4 mt-0" },
  ];

  return (
    // Sfondo principale con texture carta e colore caldo che abbiamo aggiunto in globals.css
    <div className="min-h-screen relative overflow-hidden bg-[#fcfbf8]">
      {/* Texture della carta in overlay, mixata con il colore di fondo */}
      <PaperTexture className="fixed inset-0 pointer-events-none z-0" />

      {/* Hero Section: Tipografia Gigante ed Editoriale */}
      <section className="relative z-10 pt-24 md:pt-40 px-6 max-w-[1800px] mx-auto overflow-hidden">
        {/* Cerchio scarabocchiato enorme per riempire lo spazio bianco */}
        <div className="absolute top-10 md:top-20 -left-20 w-[600px] h-[600px] opacity-10 pointer-events-none rounded-full border-[3px] border-dashed border-gray-600 rotate-12" />

        <div className="relative z-20 flex flex-col justify-center items-start md:items-center text-left md:text-center w-full">
          {/* Titolo Principale in stile magazine/giornale */}
          <h1 className="font-serif italic text-6xl md:text-[120px] lg:text-[160px] xl:text-[200px] leading-[0.8] tracking-tighter text-[#1a1a1a] uppercase select-none">
            Selected
            <br />
            <span className="font-sans font-bold tracking-widest text-4xl md:text-[60px] lg:text-[90px] xl:text-[120px] not-italic ml-4 md:ml-20">Works</span>
          </h1>

          <div className="mt-8 md:mt-12 md:max-w-3xl md:mx-auto md:text-center flex flex-col items-start md:items-center">
            <p className="font-serif italic text-2xl md:text-4xl text-gray-600 mb-6 border-b border-gray-300 pb-4 inline-block">
              Archive & Journal
            </p>
            <p className="font-sans text-xs md:text-sm uppercase tracking-[0.3em] font-semibold text-[#1a1a1a] max-w-lg leading-relaxed mix-blend-multiply">
              A curated selection of moments frozen in time, where the raw power of nature meets the delicate silence of the wilderness. From deep mossy forests to sun-drenched canyon rivers.
            </p>
          </div>
        </div>
      </section>

      {/* Sezione Portfolio: Layout Collage/Scrapbook Libero */}
      {/* Rimuoviamo il MasonryWrapper e usiamo un sistema di flex wrap o grid irregolare */}
      <section className="relative z-20 pb-32 pt-20 px-6 md:px-16 max-w-[1600px] mx-auto" id="portfolio">
        {portfolioFolders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-x-16 lg:gap-x-24 place-items-center">
            {portfolioFolders.map(({ folderKey, coverImageUrl, blurDataURL }, index) => {
              if (!coverImageUrl) return null;

              // Applica ciclicamente gli stili di rotazione e margine per l'effetto scrapbook
              const styleProps = collageStyles[index % collageStyles.length];

              return (
                <div key={folderKey || index} className="w-full max-w-[500px] relative">
                  <ScrapbookCard
                    folderKey={folderKey}
                    coverImageUrl={coverImageUrl}
                    blurDataURL={blurDataURL || ""}
                    rotation={styleProps.rotation}
                    zIndex={styleProps.zIndex}
                    tapePosition={styleProps.tapePosition}
                    stampType={styleProps.stampType}
                    marginTop={styleProps.marginTop}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-red-500 font-mono text-sm uppercase">Archive empty. Connection lost.</p>
        )}
      </section>

      {/* Footer Editoriale della Homepage (opzionale, per chiudere la pagina) */}
      <footer className="relative z-10 border-t-2 border-dashed border-gray-300 mx-6 md:mx-16 mt-16 py-8 flex justify-between items-center text-[#1a1a1a]">
        <span className="font-serif italic text-xl">End of Selection</span>
        <span className="font-sans uppercase text-[10px] tracking-[0.3em] font-bold">Vol. 01 / Current Year</span>
      </footer>
    </div>
  );
}
