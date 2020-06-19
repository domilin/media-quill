import Quill from "quill";
import "./index.scss";

const BlockEmbed = Quill.import("blots/block/embed");

const palyIcon = `<svg viewBox="0 0 1024 1024"><path d="M246.4 912.64c-17.92 0-32-14.08-32-32V231.68c0-37.12 19.2-71.04 51.84-89.6 32.64-18.56 71.04-18.56 103.68 0L870.4 430.72c32.64 18.56 51.84 51.84 51.84 89.6 0 37.12-19.2 71.04-51.84 89.6l-469.76 271.36c-15.36 8.96-34.56 3.84-43.52-11.52-8.96-15.36-3.84-34.56 11.52-43.52L838.4 554.88c17.92-10.24 19.84-27.52 19.84-33.92 0-7.04-1.92-23.68-19.84-33.92L337.28 197.76c-17.92-10.24-33.28-3.2-39.68 0-5.76 3.2-19.84 13.44-19.84 33.92v648.96c0.64 17.92-14.08 32-31.36 32z"></path></svg>`;
const pauseIcon = `<svg viewBox="0 0 1024 1024"><path d="M325.5 192.5c-19.9 0-36 16.1-36 36v567c0 19.9 16.1 36 36 36s36-16.1 35-36v-567c1-19.9-15.1-36-35-36z m373 0c-19.9 0-36 16.1-36 36v567c0 19.9 16.1 36 36 36s36-16.1 36-36v-567c0-19.9-16.1-36-36-36z" p-id="7763"></path></svg>`;
const fullscreenIcon = `<svg viewBox="0 0 1024 1024"><path d="M160 96h192q14.016 0.992 23.008 10.016t8.992 22.496-8.992 22.496T352 160H160v192q0 14.016-8.992 23.008T128 384t-23.008-8.992T96 352V96h64z m0 832H96v-256q0-14.016 8.992-23.008T128 640t23.008 8.992T160 672v192h192q14.016 0 23.008 8.992t8.992 22.496-8.992 22.496T352 928H160zM864 96h64v256q0 14.016-8.992 23.008T896 384t-23.008-8.992T864 352V160h-192q-14.016 0-23.008-8.992T640 128.512t8.992-22.496T672 96h192z m0 832h-192q-14.016-0.992-23.008-10.016T640 895.488t8.992-22.496T672 864h192v-192q0-14.016 8.992-23.008T896 640t23.008 8.992T928 672v256h-64z" p-id="8486"></path></svg>`;

class VideoPlayer extends BlockEmbed {
  static create(obj: { src: string | boolean; id: string | undefined }): void {
    const { src, id } = obj;
    const nodeWrapper = super.create(src);
    if (src === true) return nodeWrapper;

    const node = document.createElement("div");
    node.className = "quill-video-player-content";

    const video = document.createElement("video");
    video.setAttribute("src", src as string);
    node.appendChild(video);

    const controls = document.createElement("div");
    controls.className = "quill-video-player-controls";

    // 播放暂停按钮
    const playPause = document.createElement("div");
    playPause.className = "quill-video-player-switch";
    const play = document.createElement("div");
    play.className = "quill-video-player-icon-play";
    play.innerHTML = palyIcon;
    playPause.appendChild(play);
    const pause = document.createElement("div");
    pause.className = "quill-video-player-icon-pause";
    pause.innerHTML = pauseIcon;
    playPause.appendChild(pause);
    controls.appendChild(playPause);

    // 当前播放进度条
    const progress = document.createElement("div");
    progress.className = "quill-video-player-progress";
    const progressBar = document.createElement("div");
    progressBar.className = "quill-video-player-progress-bar";
    progress.appendChild(progressBar);
    controls.appendChild(progress);

    // 总共时间，当前播放时间
    const time = document.createElement("div");
    time.className = "quill-video-player-time";
    const curTime = document.createElement("div");
    curTime.className = "quill-video-player-cur-time";
    curTime.innerText = "--:--";
    time.appendChild(curTime);
    const splitLine = document.createElement("span");
    splitLine.innerText = "/";
    time.appendChild(splitLine);
    const totalTime = document.createElement("div");
    totalTime.className = "quill-video-player-total-time";
    totalTime.innerText = "--:--";
    time.appendChild(totalTime);
    controls.appendChild(time);
    time.setAttribute("contenteditable", "false");

    // 播放暂停按钮
    const fullscreen = document.createElement("div");
    fullscreen.className = "quill-video-player-fullscreen";
    fullscreen.innerHTML = fullscreenIcon;
    controls.appendChild(fullscreen);

    node.appendChild(controls);

    // 设置id，用于播放js执行，MediaUploader
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

VideoPlayer.blotName = "videoPlayerBlot";
VideoPlayer.className = "quill-video-player";
VideoPlayer.tagName = "div";
Quill.register({ "formats/videoPlayerBlot": VideoPlayer });

export default VideoPlayer;
