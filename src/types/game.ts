export type ScreenId = 0 | 1 | 2 | 3 | 4 | 5;
export type StageNumber = 1 | 2 | 3 | 4;
export type ConceptType = 'utama' | 'penjelas';

export interface StageMeta {
  id: StageNumber;
  icon: string;
  title: string;
  desc: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: ConceptType;
  why: string;
}

export interface SortItem {
  id: string;
  text: string;
}

export interface ModalPayload {
  icon: string;
  title: string;
  message: string;
}

export interface PersistedProgress {
  xp: number;
  stars: number;
  hearts: number;
  muted: boolean;
  done: StageNumber[];
}

export const STORAGE_KEY = 'susun_gagasanku_v2';

export const STAGES: StageMeta[] = [
  { id: 1, icon: '💡', title: 'Kenali Gagasan', desc: 'Pelajari inti dan informasi pendukung' },
  { id: 2, icon: '🔍', title: 'Berburu Gagasan', desc: 'Tentukan gagasan dari paragraf acak' },
  { id: 3, icon: '🧩', title: 'Susun Gagasan', desc: 'Atur kartu menjadi urutan runtut' },
  { id: 4, icon: '🎤', title: 'Ceritakan Kembali', desc: 'Sampaikan isi teks dengan suaramu' },
];

export const READING_PARAGRAPHS: string[] = [
  'Kebiasaan membawa botol minum sendiri ke sekolah merupakan tindakan sederhana yang memberikan banyak manfaat. Kebiasaan ini perlu diterapkan oleh setiap peserta didik.',
  'Pertama, membawa botol minum sendiri dapat mengurangi penggunaan plastik sekali pakai. Dengan demikian, jumlah sampah plastik di lingkungan sekolah dapat berkurang. Kedua, peserta didik dapat memenuhi kebutuhan air minum dengan lebih mudah karena botol minum selalu tersedia.',
  'Selain itu, membawa botol minum sendiri juga dapat membantu menghemat uang. Peserta didik tidak perlu terlalu sering membeli minuman kemasan. Botol minum yang digunakan berulang kali juga dapat menjadi kebiasaan baik dalam menjaga lingkungan.',
  'Oleh karena itu, membawa botol minum sendiri ke sekolah merupakan kebiasaan baik yang sebaiknya dilakukan setiap hari. Kebiasaan sederhana ini bermanfaat bagi kesehatan, penghematan, dan kebersihan lingkungan.',
];

export const QUIZ_BANK: QuizQuestion[] = [
  {
    id: 'q1',
    text: 'Kebiasaan membawa botol minum sendiri ke sekolah merupakan tindakan sederhana yang memberikan banyak manfaat. Kebiasaan ini perlu diterapkan oleh setiap peserta didik.',
    type: 'utama',
    why: 'Paragraf ini menyampaikan inti pembahasan, yaitu kebiasaan membawa botol minum sendiri dan manfaatnya.',
  },
  {
    id: 'q2',
    text: 'Membawa botol minum sendiri dapat mengurangi penggunaan plastik sekali pakai. Jumlah sampah plastik di lingkungan sekolah pun dapat berkurang.',
    type: 'penjelas',
    why: 'Paragraf ini memberikan alasan dan akibat yang mendukung inti pembahasan, yaitu mengurangi sampah plastik.',
  },
  {
    id: 'q3',
    text: 'Peserta didik dapat memenuhi kebutuhan air minum dengan lebih mudah karena botol minum selalu tersedia. Membawa botol sendiri juga dapat membantu menghemat uang.',
    type: 'penjelas',
    why: 'Paragraf ini berisi rincian manfaat sebagai pendukung gagasan utama.',
  },
];

export const CORRECT_ORDER: SortItem[] = [
  {
    id: 'a',
    text: 'Kebiasaan membawa botol minum sendiri ke sekolah memberikan banyak manfaat.',
  },
  {
    id: 'b',
    text: 'Membawa botol minum dapat mengurangi sampah plastik dan memudahkan peserta didik memenuhi kebutuhan air.',
  },
  {
    id: 'c',
    text: 'Membawa botol minum sendiri juga dapat membantu menghemat uang dan menjaga lingkungan.',
  },
  {
    id: 'd',
    text: 'Oleh karena itu, membawa botol minum sendiri sebaiknya dilakukan setiap hari.',
  },
];
