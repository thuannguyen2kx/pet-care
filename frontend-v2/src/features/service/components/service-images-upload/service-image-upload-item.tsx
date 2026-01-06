type Props = {
  src: string;
  onRemove: () => void;
};
export function ServiceImageUploadItem({ src, onRemove }: Props) {
  return (
    <div className="relative">
      <img src={src} className="rounded-lg object-cover" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 rounded-full bg-black/60 px-2 text-white"
      >
        ✕
      </button>
    </div>
  );
}
