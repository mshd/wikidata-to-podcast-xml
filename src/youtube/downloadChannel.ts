import { downloadVideos } from "./downloadMp3";
import { getPlaylistVideos } from "./getVideosByPlaylist";

export async function runChannelByPlaylist(playlist: string) {
  const videos = await getPlaylistVideos(playlist); // { ids: ["vRKULRro548"] };
  downloadVideos(videos.ids);
  return videos.ids;
}
