import { downloadVideos } from "./downloadMp3";
import { getPlaylistVideos } from "./getVideosByPlaylist";

export async function runChannelByPlaylist(playlist: string) {
  const videos = { ids: ["vRKULRro548"] }; //await getPlaylistVideos(playlist);
  downloadVideos([videos.ids[0]]);
  return videos.ids;
}
