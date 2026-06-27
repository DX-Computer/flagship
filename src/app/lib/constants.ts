export const LOCALES: string[] = ["en", "es", "fr", "pt", "ar", "he"];

export const INFURA_GATEWAY: string = "https://thedial.infura-ipfs.io";
export const INFURA_GATEWAY_INTERNAL: string =
  "https://digitalax.xyz/api/infura/";

export const BOARD_BG: string = "#011d42";
export const METAL_GOLD: string = "#c2a155";
export const METAL_SILVER: string = "#dfd1be";
export const METAL_STEEL: string = "#c4c9d1";

export enum Idiomas {
  Ingles = "en",
  Español = "es",
  Árabe = "ar",
  Hebreo = "he",
  Portugués = "pt",
  Ucraniano = "ук",
  Farsi = "د",
  Japonés = "あ",
  Yiddish = "yi",
  Francés = "fr",
  Turco = "ç",
  Húngaro = "ű",
  Yolŋu = "ŋ",
  Gaelic = "gd",
}

export const idiomaAImagen: { [key in Idiomas]: string } = {
  ["en"]: "QmZ1h4g4sypkZXDPsSQxg8YoqN3mnYUtFVfxeWVRcC7Xmb",
  ["es"]: "QmY43U5RovVkoGrkLiFyA2VPMnGxf5e3NgYZ95u9aNJdem",
  ["ar"]: "Qmb2rQi84hLXtiY673VaBHMTB32Lo1Xe1ah4Q7mG2fKf4J",
  ["he"]: "Qmdyd6iUPYNruEi5BJaYnoJ8H4FDwqxJF4EAzLvYZfxgXE",
  ["pt"]: "QmQce4gWKLj9xWySjxUVsHKorX5rDL45JiaU4y1TBqjLVa",
  ["ук"]: "QmW1QzS8AfYEaV4Kc6YtwXSUXRUatP6VozLy1HB61DTy27",
  ["د"]: "QmTchZ7B2vrTnkKKBpqoYcmLQ8H9wxiNet7DWtmQeVzMdM",
  ["あ"]: "QmYz9Van9EVEZSLcnbMXS9bG5FzuL3jvEe5Hy5fcs361RK",
  ["yi"]: "QmVjE8UDvswAGXRCVFdqzwAHAMTjS1UjotfojFMqxWaVdg",
  ["fr"]: "QmNZgw6NCiV4wU9h1R5DkaZGWwHXVKthRP45xtQYy4wtp5",
  ["ç"]: "QmNUBhcEpjjyHnsoR4ViowP3oNvh4trZ5H6snFD7Hm1hdy",
  ["ű"]: "QmSJJkCDMN3bTdD3T6j1B2hfCzhnycpbitYAfMsSKNUohd",
  ["ŋ"]: "Qmf11oxoyAe5vUbZAwHSTCCfRSWTMYijruBeABLrW4rhp7",
  ["gd"]: "QmUzrNvabPJXnZZXsaHDKNoSNTzbQiUjGaRA4dU2aFBJmk",
};

export const indiceAIdioma: { [key in number]: string } = {
  [0]: "en",
  [1]: "es",
  [2]: "ar",
  [3]: "he",
  [4]: "pt",
  [5]: "ук",
  [6]: "د",
  [7]: "あ",
  [8]: "yi",
  [9]: "fr",
  [10]: "ç",
  [11]: "ű",
  [12]: "ŋ",
  [13]: "gd",
};

export const idiomaAIndice: { [key in Idiomas]: number } = {
  ["en"]: 0,
  ["es"]: 1,
  ["ar"]: 2,
  ["he"]: 3,
  ["pt"]: 4,
  ["ук"]: 5,
  ["د"]: 6,
  ["あ"]: 7,
  ["yi"]: 8,
  ["fr"]: 9,
  ["ç"]: 10,
  ["ű"]: 11,
  ["ŋ"]: 12,
  ["gd"]: 13,
};

export const indiceASimbolo: { [key in number]: string } = {
  [0]: "en",
  [1]: "es",
  [2]: "ع",
  [3]: "א",
  [4]: "br",
  [5]: "ук",
  [6]: "د",
  [7]: "あ",
  [8]: "yi",
  [9]: "fr",
  [10]: "ç",
  [11]: "ű",
  [12]: "ŋ",
  [13]: "gd",
};
