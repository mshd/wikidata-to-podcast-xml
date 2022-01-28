import { WD_RECORDED_AT } from "./wikidata";

type DESCRIPTION_TYPE = {
  id: string;
  img?: string;
  title?: string;
  description?: string;
  prefix?: string;
  remove?: string[];
  guestMatch?: string;
  presenter?: boolean;
  presenterId?: string;
  addClaims?: any;
};

export const DESCRIPTIONS: DESCRIPTION_TYPE[] = [
  {
    id: "Q66141312",
    prefix: "The Ben Shapiro Show - ",
    img: "https://podcast.nothispute.com/images/ben_shapiro3000.jpg",
    title: "The Ben Shapiro Show",
    presenter: true,
    description: `Daily political podcast and live radio show produced by The Daily Wire and hosted by Ben Shapiro
    
    Full descr:
    Tired of the lies? Tired of the spin? Are you ready to hear the hard-hitting truth in comprehensive, conservative, principled fashion? The Ben Shapiro Show brings you all the news you need to know in the most fast moving daily program in America. Ben brutally breaks down the culture and never gives an inch! Monday thru Friday.`,
  },
  {
    id: "Q30323986",
    guestMatch: "- (.*)",
    remove: ["The Joe Rogan Experience ", "JRE "],
    prefix: "JRE ",
    presenter: true,
    addClaims: {
      [WD_RECORDED_AT]: "Q109352672",
    },
    img: "https://podcast.nothispute.com/images/jre1500.jpg",
    title: "The Joe Rogan Experience",
    description: `*Please be patient, episodes might take up to a minute to load* <br /><br />The Joe Rogan Experience is a podcast about the life of comedian Joe Rogan and the people he interviews, this feed contains old episodes from 2009 until 2019. `,
  },
  {
    id: "Q109238858",
    prefix: "The Jordan B. Peterson Podcast - ",
    remove: [
      "| The Jordan B. Peterson Podcast",
      "| The Jordan Peterson Podcast",
    ],
    presenter: true,
    img: "https://podcast.nothispute.com/images/jordan_peterson.jpg",
    title: "The Jordan B. Peterson Podcast",
    guestMatch: `\\|(.[^\\|]*)`,
    description: `Join intellectual phenomenon Dr. Jordan Peterson and his daughter Mikhaila for enlightening discourse that will change the way you think. This podcast breaks down the dichotomy of life through interviews and lectures that explain how individuals and culture are shaped by values, music, religion, and beyond. It will give you a new perspective and a modern understanding of your creativity, competence, and personality.`,
  },
  {
    id: "Q109650493",
    prefix: "The Michael Shermer Show - ",
    presenter: true,
    // guestMatch: `\\d{2,4}. (([A-Z][\\p{L}.]{1,20} ){1,4})`,
    guestMatch: `\\d{2,4}\\. (.*?) (about|on|-|—)`,
  },
  {
    id: "Q56542667",
    prefix: "Stay Tuned with Preet - ",
    presenter: true,
    guestMatch: `\(with (.*)\)`,
  },
  {
    id: "Q109248984",
    title: "Lex Fridman Podcast",
    prefix: "Lex Fridman Podcast ",
    guestMatch: `\\d (–|\\-) (.*):`,
  },
];
