export default function BoardCard({ title, description, color }) {
  return (
    <div
      className="border w-60 h-50 border-black p-2"
      style={{ backgroundColor: color.startsWith("#") ? color : `#${color}` }}
    >
      <div className="flex flex-col ">
        <h2 className="text-lg text-black text-center">{title}</h2>
        <p className="text-md text-black text-center">{description}</p>
      </div>
    </div>
  );
}
