import { getYoutubePlaylistVideoIds } from "@entitree/wikidata-helper";
import { downloadVideos } from "./downloadMp3";

export async function runChannelByPlaylist(playlist: string) {
  const videos = await getYoutubePlaylistVideoIds(playlist, "key???"); // { ids: ["vRKULRro548"] };
  downloadVideos(videos.ids);
  return videos.ids;
}
