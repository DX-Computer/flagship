export const LOCALES: string[] = ["en", "es"];

export const KINORA_QUEST_DATA: `0x${string}` =
  "0xB638b8e910f5852d9B2b69D250883EB3E8575092";
export const INFURA_GATEWAY: string = "https://thedial.infura-ipfs.io";
export const DIGITALAX_ADDRESS: string =
  "e0deaff9be0da5309d2b19bcb0c133397b2bb20be563ab038e265b0800ddcf57";
export const IPFS_REGEX: RegExp = /\b(Qm[1-9A-Za-z]{44}|ba[A-Za-z2-7]{57})\b/;
export const INFURA_GATEWAY_INTERNAL: string =
  "https://digitalax.xyz/api/infura/";

export const CHROMADIN: `0x${string}` =
  "0x16a362A10C1f6Bc0565C8fFAd298f1c2761630C5";

export const THEME_COLORS = [
  "cream",
  "dark",
  "blue",
  "green",
  "purple",
  "heart",
  "plum",
  "lime",
  "sea",
  "hot",
];
export const HEART_COLORS = [
  "#131313",
  "#FAF4E8",
  "#FAF4E8",
  "#131313",
  "#4b0082",
  "#2f25a7",
  "#3cfdf6",
  "#090d12",
  "#c3e0c3",
  "#ce02cb",
];


export enum Idiomas {
  Ingles = "en",
  Español = "es",
  Árabe = "ع",
  Hebreo = "א",
  Portugués = "br",
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
  ["ع"]: "Qmb2rQi84hLXtiY673VaBHMTB32Lo1Xe1ah4Q7mG2fKf4J",
  ["א"]: "Qmdyd6iUPYNruEi5BJaYnoJ8H4FDwqxJF4EAzLvYZfxgXE",
  ["br"]: "QmQce4gWKLj9xWySjxUVsHKorX5rDL45JiaU4y1TBqjLVa",
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

export const idiomaAIndice: { [key in Idiomas]: number } = {
  ["en"]: 0,
  ["es"]: 1,
  ["ع"]: 2,
  ["א"]: 3,
  ["br"]: 4,
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
