import Quill from "quill";
import "./index.scss";

const videoIconStr = `<svg viewBox="0 0 1024 1024"><path d="M725.333333 448 725.333333 298.666667C725.333333 275.2 706.133333 256 682.666667 256L170.666667 256C147.2 256 128 275.2 128 298.666667L128 725.333333C128 748.8 147.2 768 170.666667 768L682.666667 768C706.133333 768 725.333333 748.8 725.333333 725.333333L725.333333 576 896 746.666667 896 277.333333 725.333333 448Z"></path></svg>`;

const BlockEmbed = Quill.import("blots/block/embed");

class MediaLoading extends BlockEmbed {
  static create(obj: { src: string | boolean; id: string | undefined; type: "image" | "video" }): void {
    const { src, id, type } = obj;
    const nodeWrapper = super.create(src);
    if (src === true) return nodeWrapper;

    const node = document.createElement("div");
    node.className = "quill-media-loading-content";

    if (type === "video") {
      // 视频上传中
      const videoIcon = document.createElement("div");
      videoIcon.className = "quill-video-uploading-icon";
      videoIcon.innerHTML = videoIconStr;
      node.appendChild(videoIcon);
    } else {
      const image = document.createElement("img");
      image.setAttribute("src", src as string);
      node.appendChild(image);
    }

    // 图片遮罩，上传时不能放大缩小
    const mask = document.createElement("span");
    mask.className = "quill-media-loading-mask";
    node.appendChild(mask);

    // 设置id，用于复制html，中img上传，pasteSmart
    if (id) nodeWrapper.setAttribute("id", id);
    nodeWrapper.appendChild(node);

    return nodeWrapper;
  }

  static value(domNode: HTMLElement): DOMStringMap {
    const { src, custom } = domNode.dataset;
    return { src, custom };
  }

  deleteAt(index: number, length: number): void {
    super.deleteAt(index, length);
    this.cache = {};
  }
}

MediaLoading.blotName = "mediaUploadingBlot";
MediaLoading.className = "quill-media-uploading";
MediaLoading.tagName = "div";
Quill.register({ "formats/mediaUploadingBlot": MediaLoading });

export default MediaLoading;
