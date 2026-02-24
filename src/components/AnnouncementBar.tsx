const MESSAGE =
  "Compras dos EUA direto para você  |  Entrega em até 15 dias úteis  |  Produtos originais e lacrados  |  Parcelamos em até 3x sem juros";

const AnnouncementBar = () => {
  return (
    <div className="announcement-bar bg-[#eeeeee] overflow-hidden whitespace-nowrap h-[35px] flex items-center">
      <div className="announcement-track">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="inline-block px-12 text-black font-body text-[11px] md:text-[13px] font-medium"
          >
            {MESSAGE}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
