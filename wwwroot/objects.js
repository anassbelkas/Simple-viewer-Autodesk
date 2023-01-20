var objects = [
  {
    dbId: 1476,
    category: "toit",
    description: "toit a droite",
  },
  {
    dbId: 1474,
    category: "toit",
    description: "toit a gauche",
  },
  {
    dbId: 1487,
    category: "toit",
    description: "toit au centre",
  },
  {
    dbId: 541,
    category: "porte",
    description: "la porte principale en orange",
  },
];
export const getById = (id) => {
  return objects.find((o) => o.dbId === id);
};
