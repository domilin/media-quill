import { anyType } from "../../types";
import { mouseOffset, elementOffset, isPc } from "../../utils";

// 拖动播放
// 加载进度条

// 默认视频播放: 重新编辑文章, 前端页面显示文章内容时引用
interface InitParams {
  height?: string;
  width?: string;
}
export const videoInit = (args?: InitParams): void => {
  const videoComps = document.getElementsByClassName("quill-video-player");
  const videoCompsArr = Array.prototype.slice.call(videoComps);
  if (videoComps.length === 0) return;
  for (const item of videoCompsArr) {
    const id = item.getAttribute("id") as string;
    videoPlayer({ height: args?.height, width: args?.width, id });
  }
};

interface PlayerParams extends InitParams {
  id: string;
}
export const videoPlayer = ({ height, width, id }: PlayerParams): void => {
  const wrapper = document.getElementById(id as string) as HTMLDivElement;
  const content = wrapper.firstChild as HTMLDivElement;
  const video = wrapper?.querySelector("video") as HTMLVideoElement;
  const playBtn = wrapper?.querySelector(".quill-video-player-icon-play") as HTMLDivElement;
  const bigPlayBtn = wrapper?.querySelector(".quill-video-player-big-play-btn-mask") as HTMLDivElement;
  const pauseBtn = wrapper?.querySelector(".quill-video-player-icon-pause") as HTMLDivElement;
  const progressBox = wrapper?.querySelector(".quill-video-player-progress-wrapper") as HTMLDivElement;
  const progress = wrapper?.querySelector(".quill-video-player-progress") as HTMLDivElement;
  const barProgress = wrapper?.querySelector(".quill-video-player-progress-bar") as HTMLDivElement;
  const curProgress = wrapper?.querySelector(".quill-video-player-progress-current") as HTMLDivElement;
  const bufferProgress = wrapper?.querySelector(".quill-video-player-progress-buffer") as HTMLDivElement;
  const crrTime = wrapper?.querySelector(".quill-video-player-cur-time") as HTMLDivElement;
  const totalTime = wrapper?.querySelector(".quill-video-player-total-time") as HTMLDivElement;
  const fullscreen = wrapper?.querySelector(".quill-video-player-fullscreen") as HTMLDivElement;
  const loading = wrapper?.querySelector(".quill-media-loading-content") as HTMLDivElement;
  let videoCanPlay = false;

  let contentStyle = ''
  if (width && !height) contentStyle = `width: ${parseFloat(width)}px`;
  if (!width && height) contentStyle = `height: ${parseFloat(height)}px`;
  if (width && height) contentStyle = `width: ${parseFloat(width)}px; height: ${parseFloat(height)}px`;
  content.setAttribute("style", contentStyle);

  // dom渲染完成后，20ms之后加事件，将不起作用，故在此首先重新load一遍video资源
  video.load();
  // 视频加载错误，每隔4s重新加载
  video.onerror = function(): void {
    setTimeout(function() {
      video.load();
    }, 4000);
  };

  
  let bigPlayBtnShowTimer:NodeJS.Timeout;
  const bigPlayBtnShow = () => {
    clearTimeout(bigPlayBtnHideTimer)
    bigPlayBtn.setAttribute("style", 'transform: scale(0); opacity: 0;');
    bigPlayBtnShowTimer = setTimeout(function(){
      bigPlayBtn.setAttribute("style", "transform: scale(1); opacity: 1;");
    }, 10)
  }

  let bigPlayBtnHideTimer:NodeJS.Timeout;
  const bigPlayBtnHide = () => {
    clearTimeout(bigPlayBtnShowTimer)
    bigPlayBtn.setAttribute("style", "transform: scale(0); opacity: 0;");
    bigPlayBtnHideTimer = setTimeout(function(){
      bigPlayBtn.setAttribute("style", "display:none;");
    }, 300)
  }

  const loadingShow = () => {
    loading.setAttribute("style", "display:block");
  };

  const loadingHide = () => {
    loading.setAttribute("style", "display:none");
  };

  // 在一个待执行的操作（如回放）因等待另一个操作（如跳跃或下载）被延迟时触发
  video.onwaiting = function(): void {
    loadingShow();
  };
  // 在跳跃操作开始时触发。
  video.onseeking = function(): void {
    loadingShow();
  };
  // 在跳跃操作完成时触发。
  video.onseeked = function(): void {
    loadingHide();
  };
  // 在媒体开始加载时触发
  video.onloadstart = function(): void {
    loadingShow();
  };

  /** @desc ------------------- 点击播放视频 ------------------- */
  const videoPlay = (): void => {
    video.play();

    playBtn.style.display = "none";
    pauseBtn.style.display = "flex";
    content.classList.add("active");
    bigPlayBtnHide()
  };
  playBtn.onclick = function(): void {
    if (!videoCanPlay) return;

    videoPlay();
  };
  bigPlayBtn.onclick = function(): void {
    if (!videoCanPlay) return;

    videoPlay();
  };
  const videoPause = (): void => {
    playBtn.style.display = "flex";
    pauseBtn.style.display = "none";
    content.classList.remove("active");
    bigPlayBtnShow()
  };
  pauseBtn.onclick = function(): void {
    if (!videoCanPlay) return;

    video.pause();
    videoPause();
  };

  // 播放完成后样式为播放样式
  video.onended = function(): void {
    videoPause();
  };

  // 点击视频时播放与暂停
  video.onclick = function(): void {
    if (!videoCanPlay) return;

    if (video.paused) {
      videoPlay();
    } else {
      video.pause();
      videoPause();
    }
  };

  /** @desc ------------------- 播放进度 ------------------- */
  // 算出视频的时间显示出来,视频能播放的时候
  // oncanplay : 当时加载完成后的时间,
  let totalH = "0";
  let tTime: number;
  let cTime: number;
  video.onloadedmetadata = function(): void {
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
  video.oncanplaythrough = function():void {
    videoCanPlay = true;
    loadingHide();
  }
  video.onprogress = function():void {
    const buffer = video.buffered
    if (!buffer || buffer.length === 0) return

    const bufferTime = buffer.end(buffer.length - 1)
    const bufferWidth = bufferTime / tTime * 100 
    bufferProgress.setAttribute('style', `width: ${bufferWidth}%`)
  }

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
  // 当前播放: 小圆点位置，进度条长度，当前时间显示
  video.ontimeupdate = function(): void {
    cTime = video.currentTime;
    // 当前时间显示
    crrTime.innerHTML = curTimeStr(cTime);
    // 改变进度条的宽度 :当前时间/总时间
    const value = cTime / tTime;
    barProgress.style.width = value * 100 + "%";
    // 小圆点位置
    const curPos = value * elementOffset(progress).width;
    curProgress.style.left = `${curPos - 4}px`;
  };

  /** @desc ------------------- 点击进度条播放 ------------------- */
  // 当前播放: 小圆点位置，进度条长度，视频播放位置，当前时间显示
  progress.onclick = function(event: MouseEvent): void {
    if (!videoCanPlay) return;

    const This = this as HTMLDivElement;
    const curProgressTime = mouseOffset(event).x - elementOffset(This).left;

    // bar长度
    const curProgressPercent = curProgressTime / elementOffset(progress).width;
    barProgress.style.width = curProgressPercent * 100 + "%";
    // 当前显示时间
    cTime = curProgressPercent * tTime;
    crrTime.innerHTML = curTimeStr(cTime);
    // 视频播放位置
    video.currentTime = cTime | 0;
    // 小圆点位置
    curProgress.style.left = `${curProgressTime - 4}px`;

    videoPlay();
  };

  /** @desc ------------------- 拖动播放视频 ------------------- */
  let draging = false;
  let distance = 0;
  // 当前播放: 小圆点位置，进度条长度，视频播放位置，当前时间显示
  const curProgressPlay = ():number => {
    // 计算点击此处的currentTime
    const currentTime = (distance / elementOffset(progress).width) * tTime;
    // 页面回显的currentTime数据
    cTime = currentTime;
    crrTime.innerHTML = curTimeStr(currentTime);
    
    // bar进度条长度
    const curProgressPercent = distance / elementOffset(progress).width;
    barProgress.style.width = curProgressPercent * 100 + "%";
    // 小圆点位置
    curProgress.style.left = `${distance - 4}px`;

    return currentTime
  };
  const dragStart = function(event: MouseEvent | TouchEvent): void {
    event.preventDefault();
    if (!videoCanPlay) return;
    //按下鼠标标志
    draging = true;

    // 视频暂时停止
    video.pause();
    videoPause();
    const offsetX = (event as TouchEvent).touches ? (event as TouchEvent).touches[0].clientX : mouseOffset(event as MouseEvent).x
    distance = offsetX - elementOffset(progress).left; //记录点击的离起点的距离
  };
  const dragIng = function(event: MouseEvent | TouchEvent): void {
    event.preventDefault();
    if (!videoCanPlay) return;
    if (!draging) return; //如果没有通过鼠标点击起点，则直接不进行下面计算

    const offsetX = (event as TouchEvent).touches ? (event as TouchEvent).touches[0].clientX : mouseOffset(event as MouseEvent).x 
    let disX = offsetX - elementOffset(progress).left;

    // 进行边界判断
    if (disX > elementOffset(progress).width) {
      disX = elementOffset(progress).width;
    }
    if (disX < 0) {
      disX = 0;
    }
    distance = disX;

    curProgressPlay();
  };
  const dragEnd = (event: MouseEvent | TouchEvent):void => {
    event.preventDefault();
    if (!videoCanPlay) return;
    draging = false;
    const currentTime = curProgressPlay();
    // 视频播放位置
    video.currentTime = currentTime | 0;
    videoPlay();
  }
  const dragCancel = function(event: MouseEvent | TouchEvent): void {
    event.preventDefault();
    if (!draging) return
    dragEnd(event)
  };
  progressBox.onmousedown = dragStart
  progressBox.ontouchstart = dragStart
  progressBox.onmouseleave = dragCancel
  progressBox.ontouchcancel = dragCancel
  progressBox.onmouseup = dragEnd
  progressBox.ontouchend = dragEnd
  progressBox.onmousemove = dragIng
  progressBox.ontouchmove = dragIng

  /** @desc ------------------- 实现全屏的效果 ------------------- */
  const fullStyle = (isFull:anyType) => {
    if (isFull) {
      content.setAttribute(
        "style",
        "position:fixed; top:0; left:0; height:100%; width: 100%; max-width: inherit; z-index:9999;"
      );
      video.setAttribute("style", "height:100%");
    } else {
      video.pause();
      videoPause();
      
      content.setAttribute("style", contentStyle);
      video.setAttribute("style", '');
    }
  }
  document.addEventListener("fullscreenchange", function(event) {
    fullStyle(document.fullscreenElement)
  });
  video.addEventListener("fullscreenchange", function() {
    fullStyle((video as anyType).webkitDisplayingFullscreen)
  });
  video.addEventListener("webkitendfullscreen", function() {
      video.pause();
      videoPause();
      content.setAttribute("style", contentStyle);
      video.setAttribute("style", 'opacity:0.9999'); // ios 视频退出后控制栏自动隐藏，测试设置opaciy小于1可解决
  });
  video.addEventListener("x5videoexitfullscreen", function() {
    const fullscreenVideo = video as anyType;
    fullscreenVideo.webkitExitFullScreen();
  });

  fullscreen.onclick = function(): void {
    if (!videoCanPlay) return;

    // safari, mobile, ipad
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    if (isSafari || !isPc()) {
      const fullscreenVideo = video as anyType;
      if (fullscreenVideo.requestFullscreen) {
        fullscreenVideo.requestFullscreen();
      } else if (fullscreenVideo.mozRequestFullScreen) {
        fullscreenVideo.mozRequestFullScreen();
      } else if (fullscreenVideo.webkitRequestFullscreen) {
        fullscreenVideo.webkitRequestFullscreen();
      } else if (fullscreenVideo.webkitSupportsFullscreen) {
        fullscreenVideo.webkitEnterFullscreen();
      }
    } else {
      const ele = document.documentElement as anyType;
      if (document.fullscreenElement === null) {
        if (ele.requestFullscreen) {
          ele.requestFullscreen();
        } else if (ele.mozRequestFullScreen) {
          ele.mozRequestFullScreen();
        } else if (ele.webkitRequestFullscreen) {
          ele.webkitRequestFullscreen();
        } else if (ele.webkitSupportsFullscreen) {
          ele.webkitEnterFullscreen();
        }
      } else {
        const de = document;
        if (de.exitFullscreen) {
          de.exitFullscreen();
        } else if (ele.mozCancelFullScreen) {
          ele.mozCancelFullScreen();
        } else if (ele.webkitCancelFullScreen) {
          ele.webkitCancelFullScreen();
        }
      }
    }
  };
};

export default {
  videoInit,
  videoPlayer
};
