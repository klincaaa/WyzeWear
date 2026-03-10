export type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
  hoverImage: string;
  category: string;
};

export const products: Product[] = [
  {
    id: "hoodie-1",
    name: "Stonewashed Studio Hoodie",
    price: "€140",
    category: "Hoodies",
    image:
      "https://images.pexels.com/photos/7671166/pexels-photo-7671166.jpeg?auto=compress&cs=tinysrgb&w=1200",
    hoverImage:
      "https://images.pexels.com/photos/7671165/pexels-photo-7671165.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "tracksuit-1",
    name: "Technical Track Set",
    price: "€220",
    category: "Tracksuits",
    image:
      "https://images.pexels.com/photos/6311686/pexels-photo-6311686.jpeg?auto=compress&cs=tinysrgb&w=1200",
    hoverImage:
      "https://images.pexels.com/photos/6311722/pexels-photo-6311722.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "tee-1",
    name: "Everyday Logo Tee",
    price: "€75",
    category: "T-Shirts",
    image:
      "https://images.pexels.com/photos/7671157/pexels-photo-7671157.jpeg?auto=compress&cs=tinysrgb&w=1200",
    hoverImage:
      "https://images.pexels.com/photos/7671158/pexels-photo-7671158.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "cargo-1",
    name: "Double Knee Cargo Pant",
    price: "€160",
    category: "Bottoms",
    image:
      "https://images.pexels.com/photos/6311626/pexels-photo-6311626.jpeg?auto=compress&cs=tinysrgb&w=1200",
    hoverImage:
      "https://images.pexels.com/photos/6311660/pexels-photo-6311660.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "cap-1",
    name: "Tonal Six-Panel Cap",
    price: "€60",
    category: "Accessories",
    image:
      "https://images.pexels.com/photos/7671156/pexels-photo-7671156.jpeg?auto=compress&cs=tinysrgb&w=1200",
    hoverImage:
      "https://images.pexels.com/photos/7671154/pexels-photo-7671154.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

