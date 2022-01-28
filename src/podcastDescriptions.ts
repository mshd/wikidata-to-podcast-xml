type DESCRIPTION_TYPE = {
  id: string;
  img?: string;
  title?: string;
  description?: string;
  prefix?: string;
  remove?: string[];
  guestMatch?: string;
};

export const DESCRIPTIONS: DESCRIPTION_TYPE[] = [
  {
    id: "Q66141312",
    prefix: "The Ben Shapiro Show - ",
    img: "https://podcast.nothispute.com/images/ben_shapiro3000.jpg",
    title: "The Ben Shapiro Show",
    description: `Daily political podcast and live radio show produced by The Daily Wire and hosted by Ben Shapiro
    
    Full descr:
    Tired of the lies? Tired of the spin? Are you ready to hear the hard-hitting truth in comprehensive, conservative, principled fashion? The Ben Shapiro Show brings you all the news you need to know in the most fast moving daily program in America. Ben brutally breaks down the culture and never gives an inch! Monday thru Friday.`,
  },
  {
    id: "Q30323986",
    guestMatch: "- (.*)",
    remove: ["The Joe Rogan Experience ", "JRE "],
    prefix: "JRE ",
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
    img: "https://podcast.nothispute.com/images/jordan_peterson.jpg",
    title: "The Jordan B. Peterson Podcast",
    guestMatch: `\|(.[^\|]*)`,
    description: `Join intellectual phenomenon Dr. Jordan Peterson and his daughter Mikhaila for enlightening discourse that will change the way you think. This podcast breaks down the dichotomy of life through interviews and lectures that explain how individuals and culture are shaped by values, music, religion, and beyond. It will give you a new perspective and a modern understanding of your creativity, competence, and personality.`,
  },
  {
    id: "Q109650493",
    prefix: "The Michael Shermer Show - ",
    guestMatch: "d{2,4}. (([A-Z][p{L}.]{1,20} ){1,4})",
  },
  {
    id: "Q56542667",
    prefix: "Stay Tuned with Preet - ",
  },
];
