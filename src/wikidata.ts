export const WD_EXPLICIT_EPISODE = "Q109501804";
export const WD_PODCAST = "Q24634210";
export const WD_PODCAST_EPISODE = "Q61855877";
export const WD_PODCAST_IMAGE_URL = "P10286";
export const WD_FEED_URL = "P1019";
export const WD_INSTANCE_OF = "P31";
export const WD_TITLE = "P1476";
export const WD_SERIES = "P179";
export const WD_LANGUAGE = "P407";
export const WD_PUBLICATION_DATE = "P577";
export const WD_GUEST = "P5030";
export const WD_DISTRUBUTION_FORMAT = "P437";
export const WD_PRODUCTION_CODE = "P2364";
export const WD_DURATION = "P2047";
export const WD_SECOND = "Q11574";
export const WD_FULL_WORK_URL = "P953";
export const WD_CONTENT_DELIVERER = "P3274";
export const WD_FILE_FORMAT = "P2701";
export const WD_RECORDING_DATE = "P10135";
export const WD_RECORDED_AT = "P483";
export const WD_BASED_ON_HEURISTIC = "P887";
export const WD_PRESENTER = "P371";
export const WD_INFERRED_FROM_YOUTUBE_DESCRIPTION = "Q110039923";
export const WD_INFERRED_FROM_PODCAST_DESCRIPTION = "Q110068003";
export const WD_INFERRED_FROM_TITLE = "Q69652283";
export const WD_STATED_IN_REFERENCE = "P5997";
export const WD_HAS_QUALITY = "P1552";
export const WD_SPOTIFY_EPISODE_ID = "P9882";
export const WD_ITUNES_EPISODE_ID = "P10304";
export const WD_SEASON = "P4908";
export const WD_NUMBER = "P1545";
export const WD_EPISODE_TYPE_MATCH = {
  full: WD_PODCAST_EPISODE,
  trailer: "Q106677532",
  bonus: "Q110730867",
};
export const ST_FROM_TITLE = {
  [WD_BASED_ON_HEURISTIC]: WD_INFERRED_FROM_TITLE,
};
