import Quill, { RangeStatic } from "quill";
import MediaLoading from "../blots/MediaUplodBlots";
import videoBlots from "../blots/VideoPlayBlots";
import { anyType } from "../types";
import { videoPlayer } from "../blots/VideoPlayBlots/videoPlayer";

import "./index.scss";
import { uuid } from "../utils";

/** @desc toolbar音频上传按钮样式---暂未实现功能。toolbarOptions={["link", "image", "video", "audio"]}
 * const audioIcon = `<svg viewBox="0 0 1024 1024"><path d=
"M512 640c107.314286 0 194.285714-85.942857 194.285714-192V192c0-106.057143-86.971429-192-194.285714-192s-194.285714 85.942857-194.285714 192v256c0 106.057143 86.971429 192 194.285714 192z m377.142857-194.285714c0-5.028571-4.114286-9.142857-9.142857-9.142857h-68.571429c-5.028571 0-9.142857 4.114286-9.142857 9.142857 0 160.342857-129.942857 290.285714-290.285714 290.285714S221.714286 606.057143 221.714286 445.714286c0-5.028571-4.114286-9.142857-9.142857-9.142857h-68.571429c-5.028571 0-9.142857 4.114286-9.142857 9.142857 0 192.8 144.685714 351.885714 331.428571 374.4V937.142857H300.228571c-15.657143 0-28.228571 16.342857-28.228571 36.571429v41.142857c0 5.028571 3.2 9.142857 7.085714 9.142857h465.828572c3.885714 0 7.085714-4.114286 7.085714-9.142857v-41.142857c0-20.228571-12.571429-36.571429-28.228571-36.571429H553.142857V820.685714c188.914286-20.571429 336-180.571429 336-374.971428z"></path></svg>`;
document.getElementsByClassName("ql-audio")[0].innerHTML = audioIcon; 
*/

interface ClipboardData extends Clipboard {
  items?: anyType;
  files?: anyType;
}
declare global {
  interface Window {
    MediaUploader: MediaUploader;
    clipboardData: ClipboardData;
  }
}

interface Options {
  imageUpload: (file: File) => Promise<string>;
  videoUpload: (file: File) => Promise<string>;
}

class MediaUploader {
  private quill: Quill;
  private options: Options;
  private range: null | RangeStatic;
  public fileHolder!: HTMLInputElement;

  constructor(quill: Quill, options: Options) {
    this.quill = quill;
    this.options = options;
    this.range = null;

    if (typeof this.options.imageUpload !== "function")
      console.error("[Missing config] imageUpload function that returns a promise is required");
    if (typeof this.options.videoUpload !== "function")
      console.error("[Missing config] videoUpload function that returns a promise is required");

    const toolbar = this.quill.getModule("toolbar");
    toolbar.addHandler("image", this.selectLocalFile.bind(this, "image"));
    toolbar.addHandler("video", this.selectLocalFile.bind(this, "video"));

    this.handleDrop = this.handleDrop.bind(this);
    this.handlePaste = this.handlePaste.bind(this);

    this.quill.root.addEventListener("drop", this.handleDrop, false);
    this.quill.root.addEventListener("paste", this.handlePaste, false);
  }

  private selectLocalFile(type: "image" | "video"): void {
    this.range = this.quill.getSelection();
    this.fileHolder = document.createElement("input");
    this.fileHolder.setAttribute("type", "file");
    this.fileHolder.setAttribute("style", "visibility:hidden");
    let mimeType = "*";
    if (type === "image") mimeType = "image/*";
    if (type === "video") mimeType = "video/*";
    this.fileHolder.setAttribute("accept", mimeType);

    this.fileHolder.onchange = this.fileChanged.bind(this, type);
    document.body.appendChild(this.fileHolder);
    this.fileHolder.click();
    window.requestAnimationFrame(() => {
      document.body.removeChild(this.fileHolder);
    });
  }

  private handleDrop(event: DragEvent): void {
    event.stopPropagation();
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length) {
      if (document.caretRangeFromPoint) {
        const selection = document.getSelection();
        const range = document.caretRangeFromPoint(event.clientX, event.clientY);
        if (selection && range) {
          selection.setBaseAndExtent(range.startContainer, range.startOffset, range.startContainer, range.startOffset);
        }
      } else {
        const selection = document.getSelection();
        const range = document.caretPositionFromPoint(event.clientX, event.clientY);
        if (selection && range) {
          selection.setBaseAndExtent(range.offsetNode, range.offset, range.offsetNode, range.offset);
        }
      }

      this.range = this.quill.getSelection();
      const file = event.dataTransfer.files[0];

      setTimeout(() => {
        this.range = this.quill.getSelection();
        this.readAndUploadImageFile(file);
      }, 0);
    }
  }

  private handlePaste(event: ClipboardEvent): void {
    const clipboard = event.clipboardData || window.clipboardData;

    // IE 11 is .files other browsers are .items
    if (clipboard && (clipboard.items || clipboard.files)) {
      const items = clipboard.items || clipboard.files;
      const IMAGE_MIME_REGEX = /^image\/(jpe?g|gif|png|svg|webp)$/i;

      for (let i = 0; i < items.length; i++) {
        if (IMAGE_MIME_REGEX.test(items[i].type)) {
          const file = items[i].getAsFile ? items[i].getAsFile() : items[i];

          if (file) {
            this.range = this.quill.getSelection();
            event.preventDefault();
            setTimeout(() => {
              this.range = this.quill.getSelection();
              this.readAndUploadImageFile(file);
            }, 0);
          }
        }
      }
    }
  }

  private fileChanged(type: "image" | "video"): void {
    const file = (this as anyType).fileHolder.files[0];
    if (type === "image") this.readAndUploadImageFile(file);
    if (type === "video") this.readAndUploadVideoFile(file);
  }

  /** @desc -------------图片上传-------------  */
  private readAndUploadImageFile(file: File): void {
    let isUploadReject = false;
    const fileReader = new FileReader();
    fileReader.addEventListener(
      "load",
      () => {
        if (!isUploadReject) {
          // 插入加载中样式
          const base64ImageSrc = fileReader.result;
          const range = this.range as RangeStatic;
          this.quill.insertEmbed(range.index, MediaLoading.blotName, { src: `${base64ImageSrc}`, id }, "user");

          this.selectNextBlot();
        }
      },
      false
    );

    const id = `quillImageUploading-${uuid()}`;
    if (file) fileReader.readAsDataURL(file);
    this.options.imageUpload(file).then(
      imageUrl => {
        const index = this.removeMediaUploading(id);
        this.insertImageToEditor(imageUrl, index);
      },
      error => {
        isUploadReject = true;
        this.removeMediaUploading(id);
        console.warn(error);
      }
    );
  }

  private insertImageToEditor(url: string, index: number): void {
    // Insert the server saved image
    this.quill.insertEmbed(index, "image", `${url}`, "user");

    this.selectNextBlot();
  }

  /** @desc -------------视频上传-------------  */
  private readAndUploadVideoFile(file: File): void {
    const fileReader = new FileReader();
    const id = `quillVideoUploading-${uuid()}`;

    // 插入加载中样式
    const range = this.range as RangeStatic;
    this.quill.insertEmbed(range.index, MediaLoading.blotName, { type: "video", id }, "user");
    this.selectNextBlot();

    if (file) fileReader.readAsDataURL(file);
    this.options.videoUpload(file).then(
      videoUrl => {
        const index = this.removeMediaUploading(id);
        this.insertVideoToEditor(videoUrl, index);
      },
      error => {
        // 移除视频上传中blots
        this.removeMediaUploading(id);
        console.warn(error);
      }
    );
  }

  private insertVideoToEditor(url: string, index: number): void {
    // Insert the server saved video
    const id = `quillVideoPlayer${uuid()}`;
    this.quill.insertEmbed(index, videoBlots.blotName, { src: url, id }, "user");
    videoPlayer(id);

    this.selectNextBlot();
  }

  /** @desc -------------移除加载中样式-------------  */
  private removeMediaUploading = (id: string): number => {
    const ele = document.getElementById(id);
    const index = this.quill.getIndex(Quill.find(ele as Node));

    ele?.remove();
    return index;
  };

  /** @desc -------------插入加载样式，图片，视频后选择其下一个编辑点blot------------  */
  private selectNextBlot(): void {
    const range = this.range as RangeStatic;
    range.index++;
    this.quill.setSelection(range, "user");
  }
}

export default MediaUploader;
