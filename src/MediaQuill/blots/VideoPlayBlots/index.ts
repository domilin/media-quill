import Quill from "quill";
import "./index.scss";
import { videoPlayerCreate } from "./videoPlayer";

const BlockEmbed = Quill.import("blots/block/embed");

class VideoPlayer extends BlockEmbed {
  static create(obj: { src: string | boolean; id: string | undefined }): void {
    const { src, id } = obj;
    const nodeWrapper = super.create(src);
    if (src === true) return nodeWrapper;

    videoPlayerCreate({
      videoWrapper: nodeWrapper,
      src: src as string,
      id: id as string,
      blot: true
    });

    return nodeWrapper;
  }

  static value(domNode: HTMLElement): DOMStringMap {
    const id = domNode.getAttribute("id") as string;
    const src = domNode.querySelector("video")?.getAttribute("src") as string;
    return { id, src };
  }

  deleteAt(index: number, length: number): void {
    super.deleteAt(index, length);
    this.cache = {};
  }
}

VideoPlayer.blotName = "videoPlayerBlot";
VideoPlayer.className = "quill-video-player";
VideoPlayer.tagName = "div";
Quill.register({ "formats/videoPlayerBlot": VideoPlayer });

export default VideoPlayer;
