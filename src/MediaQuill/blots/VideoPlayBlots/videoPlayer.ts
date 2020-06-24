import { anyType } from "../../types";
import { mouseOffset, elementOffset } from "../../utils";

export const videoPlayer = (id: string): void => {
  const wrapper = document.getElementById(id) as HTMLDivElement;
  const content = wrapper.firstChild as HTMLDivElement;
  const video = wrapper?.querySelector("video") as HTMLVideoElement;
  const playBtn = wrapper?.querySelector(".quill-video-player-icon-play") as HTMLDivElement;
  const pauseBtn = wrapper?.querySelector(".quill-video-player-icon-pause") as HTMLDivElement;
  const progress = wrapper?.querySelector(".quill-video-player-progress") as HTMLDivElement;
  const crrProgress = wrapper?.querySelector(".quill-video-player-progress-bar") as HTMLDivElement;
  const crrTime = wrapper?.querySelector(".quill-video-player-cur-time") as HTMLDivElement;
  const totalTime = wrapper?.querySelector(".quill-video-player-total-time") as HTMLDivElement;
  const fullscreen = wrapper?.querySelector(".quill-video-player-fullscreen") as HTMLDivElement;
  const loading = wrapper?.querySelector(".quill-media-loading-content") as HTMLDivElement;
  let videoCanPlay = false;

  // dom渲染完成后，20ms之后加事件，将不起作用，故在此首先重新load一遍video资源
  video.load();
  // 视频加载错误，每隔4s重新加载
  video.onerror = function() {
    setTimeout(function() {
      video.load();
    }, 4000);
  };

  // 点击播放视频
  const videoPlay = (): void => {
    video.play();

    playBtn.style.display = "none";
    pauseBtn.style.display = "flex";
    content.classList.add("active");
  };
  playBtn.onclick = function(): void {
    if (!videoCanPlay) return;

    videoPlay();
  };
  const videoPause = (): void => {
    playBtn.style.display = "flex";
    pauseBtn.style.display = "none";
    content.classList.remove("active");
  };
  pauseBtn.onclick = function(): void {
    if (!videoCanPlay) return;

    video.pause();
    videoPause();
  };
  video.onended = function(): void {
    videoPause();
  };

  // 算出视频的时间显示出来,视频能播放的时候
  // oncanplay : 当时加载完成后的时间,
  let totalH = "0";
  let tTime: number;
  let cTime: number;
  video.oncanplay = function(): void {
    videoCanPlay = true;
    loading.setAttribute("style", "display:none");

    // 显示总时长
    tTime = video.duration;
    // 将总秒数,转换为 时分秒格式 00:00:00
    let h: string | number = Math.floor(tTime / 3600);
    let m: string | number = Math.floor((tTime % 3600) / 60);
    let s: string | number = Math.floor(tTime % 60);
    h = h > 0 ? (h >= 10 ? `${h}:` : `${"0" + h}:`) : "";
    m = m >= 10 ? `${m}:` : `${"0" + m}:`;
    s = s >= 10 ? s : "0" + s;
    totalTime.innerHTML = h + m + s;

    // 设置默认起始时间为00:00
    totalH = h; // 用于当前时间是否显示小时
    crrTime.innerHTML = (parseInt(h) > 0 ? "00:" : "") + "00:00";
  };

  // 当视频播放的时候,进度条同步,当前时间同步,
  // ontimeupdate : 当时间当前时间更新的时候触发
  const curTimeStr = (time: number): string => {
    let h: string | number = Math.floor(cTime / 3600);
    let m: string | number = Math.floor((cTime % 3600) / 60);
    let s: string | number = Math.floor(cTime % 60);
    h = parseInt(totalH) > 0 ? (h >= 10 ? `${h}:` : `${"0" + h}:`) : "";
    m = m >= 10 ? `${m}:` : `${"0" + m}:`;
    s = s >= 10 ? s : "0" + s;
    return h + m + s;
  };
  video.ontimeupdate = function(): void {
    cTime = video.currentTime;
    crrTime.innerHTML = curTimeStr(cTime);

    // 改变精度条的宽度  :当前时间/总时间
    const value = cTime / tTime;
    crrProgress.style.width = value * 100 + "%";
  };

  // 点击进度条播放
  progress.onclick = function(event: MouseEvent): void {
    if (!videoCanPlay) return;

    const This = this as HTMLDivElement;
    const curProgressTime = mouseOffset(event).x - elementOffset(This).left;

    const curProgressPercent = curProgressTime / elementOffset(progress).width;
    crrProgress.style.width = curProgressPercent * 100 + "%";

    cTime = curProgressPercent * tTime;
    crrTime.innerHTML = curTimeStr(cTime);

    video.currentTime = cTime | 0;
    videoPlay();
  };

  // 实现全屏的效果
  document.addEventListener("fullscreenchange", function(e) {
    if (document.fullscreenElement) {
      content.setAttribute(
        "style",
        "position:fixed; top:0; left:0; height:100%; width: 100%; max-width: inherit; z-index:9999;"
      );
      video.setAttribute("style", "height:100%");
    } else {
      content.setAttribute("style", "");
      video.setAttribute("style", "height:auto");
    }
  });
  fullscreen.onclick = function(): void {
    if (!videoCanPlay) return;

    const ele = document.documentElement;
    if (document.fullscreenElement === null) {
      if (ele.requestFullscreen) {
        ele.requestFullscreen();
      } else if ((ele as anyType).mozRequestFullScreen) {
        (ele as anyType).mozRequestFullScreen();
      } else if ((ele as anyType).webkitRequestFullScreen) {
        (ele as anyType).webkitRequestFullScreen();
      }
    } else {
      const de = document;
      if (de.exitFullscreen) {
        de.exitFullscreen();
      } else if ((ele as anyType).mozCancelFullScreen) {
        (ele as anyType).mozCancelFullScreen();
      } else if ((ele as anyType).webkitCancelFullScreen) {
        (ele as anyType).webkitCancelFullScreen();
      }
    }
  };
};

// 默认视频播放: 重新编辑文章, 前端页面显示文章内容时引用
export const videoInit = () => {
  const videoComps = document.getElementsByClassName("quill-video-player");
  const videoCompsArr = Array.prototype.slice.call(videoComps);
  if (videoComps.length === 0) return;
  for (const item of videoCompsArr) {
    const id = item.getAttribute("id") as string;
    videoPlayer(id);
  }
};

export default {
  videoInit,
  videoPlayer
}