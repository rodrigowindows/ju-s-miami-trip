export interface MegaMenuCategory {
  label: string;
  filterCategory: string;
  subcategories: string[];
}

export const MEGA_MENU_CATEGORIES: MegaMenuCategory[] = [
  {
    label: "Maquiagem",
    filterCategory: "Beauty",
    subcategories: [
      "Fenty Beauty", "Charlotte Tilbury", "MAC Cosmetics", "NARS", "Urban Decay",
      "Too Faced", "Benefit Cosmetics", "Tarte", "Morphe", "ColourPop",
      "NYX Professional", "Maybelline", "L'Oréal Paris", "Revlon", "CoverGirl",
      "Milani", "e.l.f. Cosmetics", "Physicians Formula", "Wet n Wild", "ILIA Beauty",
      "Rare Beauty", "Glossier", "Hourglass", "Pat McGrath Labs", "Bobbi Brown",
      "Laura Mercier", "Dior Beauty", "Estée Lauder", "Lancôme", "Clinique",
      "YSL Beauty", "Chanel Beauty",
    ],
  },
  {
    label: "Skincare",
    filterCategory: "Beauty",
    subcategories: [
      "CeraVe", "La Roche-Posay", "The Ordinary", "Neutrogena", "Cetaphil",
      "Drunk Elephant", "Tatcha", "Sunday Riley", "Glow Recipe", "Paula's Choice",
      "SK-II", "Clinique", "Olay", "Kiehl's", "Murad", "First Aid Beauty", "Laneige",
    ],
  },
  {
    label: "Victoria's Secret",
    filterCategory: "Beauty",
    subcategories: [
      "Body Mists", "Body Lotions", "Perfumes (EDP)", "Kits & Presentes", "Calcinhas & Lingerie",
    ],
  },
  {
    label: "Bath & Body Works",
    filterCategory: "Beauty",
    subcategories: [
      "Fine Fragrance Mists", "Body Lotions", "Velas 3 Pavios", "Wallflowers & Aromatizadores", "Hand Creams & Sabonetes",
    ],
  },
  {
    label: "Perfumes",
    filterCategory: "Beauty",
    subcategories: [
      "Victoria's Secret", "Chanel", "Dior", "Tom Ford", "YSL", "Lancôme",
      "Jo Malone", "Dolce & Gabbana", "Gucci", "Versace", "Prada", "Burberry",
      "Hermès", "Calvin Klein", "Marc Jacobs", "Carolina Herrera", "Viktor & Rolf",
    ],
  },
  {
    label: "Eletrônicos",
    filterCategory: "Tech",
    subcategories: [
      "Apple", "Samsung", "Sony", "Bose", "JBL", "Beats by Dre",
      "Nintendo", "GoPro", "DJI", "Garmin", "Kindle", "Anker",
    ],
  },
  {
    label: "Apple Acessórios",
    filterCategory: "Tech",
    subcategories: [
      "AirPods", "AirTag", "Apple Pencil", "Carregadores MagSafe",
      "Apple Watch", "Magic Keyboard", "Cases & Capas",
    ],
  },
  {
    label: "Áudio & Som",
    filterCategory: "Tech",
    subcategories: [
      "JBL", "Bose", "Beats by Dre", "Sony", "AirPods", "Echo & Alexa", "GoPro",
    ],
  },
  {
    label: "Roupas",
    filterCategory: "Fashion",
    subcategories: [
      "Nike", "Adidas", "Ralph Lauren", "Tommy Hilfiger", "Calvin Klein",
      "Levi's", "The North Face", "Patagonia", "Under Armour", "Victoria's Secret", "H&M", "Zara",
    ],
  },
  {
    label: "Roupas de Marca",
    filterCategory: "Fashion",
    subcategories: [
      "Ralph Lauren", "Tommy Hilfiger", "Calvin Klein", "Under Armour",
      "Gap", "Champion", "Lacoste", "The North Face",
    ],
  },
  {
    label: "Tênis & Sneakers",
    filterCategory: "Fashion",
    subcategories: [
      "Nike", "Adidas", "New Balance", "Puma", "Converse", "Vans", "Asics",
    ],
  },
  {
    label: "Bolsas",
    filterCategory: "Lifestyle",
    subcategories: [
      "Coach", "Michael Kors", "Kate Spade", "Tory Burch", "Marc Jacobs",
      "Longchamp", "Fossil", "Guess", "Steve Madden", "Kipling", "Samsonite", "Herschel",
    ],
  },
  {
    label: "Kids & Brinquedos",
    filterCategory: "Kids",
    subcategories: [
      "LEGO", "Barbie", "Hot Wheels", "Squishmallows", "Nerf", "Play-Doh", "Baby Alive",
    ],
  },
  {
    label: "Baby & Bebê",
    filterCategory: "Kids",
    subcategories: [
      "Graco", "Dr. Brown's", "Carter's", "Munchkin", "Chicco", "Fisher-Price",
    ],
  },
  {
    label: "Suplementos",
    filterCategory: "Health",
    subcategories: [
      "Vitaminas", "Colágeno", "Whey Protein", "Creatina", "Melatonina", "Omega-3", "Multivitamínicos",
    ],
  },
];
