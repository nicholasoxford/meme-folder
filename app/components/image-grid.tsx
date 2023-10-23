/**
 * v0 by Vercel.
 * @see https://v0.dev/t/qRWgemPAZyQ
 */
export default function ImageGrid({
  assets,
}: {
  assets:
    | {
        created_at: string;
        id: number;
        PUBLIC_URL: string | null;
        R2_KEY: string | null;
        userId: string | null;
      }[]
    | null;
}) {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
      {assets &&
        !!assets.length &&
        assets.map(
          (asset, index) =>
            asset.PUBLIC_URL && (
              <div
                className="p-2 border-2 border-dashed border-black rounded-lg"
                key={index}
              >
                <img
                  alt={asset.R2_KEY ?? "uploaded meme"}
                  className="object-cover w-full h-full rounded-lg"
                  height="200"
                  src={asset.PUBLIC_URL}
                  style={{
                    aspectRatio: "200/200",
                    objectFit: "cover",
                  }}
                  width="200"
                />
              </div>
            )
        )}
    </section>
  );
}
