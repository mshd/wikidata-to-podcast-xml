export const generalConfig = {
  // A Wikibase instance is required
  instance: "https://www.wikidata.org",

  // The instance script path, used to find the API endpoint
  // Default: /w
  wgScriptPath: "/w",

  // One authorization mean is required (unless in anonymous mode, see below)
  credentials: {
    // either a username and password
    // username: "Germartin1",
    // // Optional: generate a dedicated password with tailored rights on /wiki/Special:BotPasswords
    // // See the 'Credentials' paragraph below
    // password: "my-wikidata-password",

    // OR OAuth tokens
    oauth: {
      // Obtained at registration
      // https://www.mediawiki.org/wiki/OAuth/For_Developers#Registration
      consumer_key: "08b3c680e03484bd521b28ed6266c621",
      consumer_secret: "6f0870171bf1ad2b938a60ad824ccf7781968b5d",
      // Obtained when the user authorized your service
      // see https://www.mediawiki.org/wiki/OAuth/For_Developers#Authorization
      token: "cbc3cd1bbdf6157a8007204e7c0af0c7",
      token_secret: "c8e97ae2502df4411400de2c4f761c78729acbc1",
    },
  },

  // Flag to activate the 'anonymous' mode,
  // which actually isn't anonymous as it signs with your IP
  // Default: false
  // anonymous: true,

  // Optional
  // See https://meta.wikimedia.org/wiki/Help:Edit_summary
  // Default: empty
  summary: "PodcastBot",

  // See https://www.mediawiki.org/wiki/Manual:Tags
  // Default: on Wikidata [ 'WikibaseJS-edit' ], empty for other Wikibase instances
  // tags: ["WikidataJS-edit"],

  // Default: `wikidata-edit/${pkg.version} (https://github.com/maxlath/wikidata-edit)`
  userAgent: "wikidata-edit/v0.0.1 (https://project.website)",

  // See https://www.mediawiki.org/wiki/Manual:Bots
  // Default: false
  // bot: true,

  // See https://www.mediawiki.org/wiki/Manual:Maxlag_parameter
  // Default: 5
  // maxlag: 2,
};
