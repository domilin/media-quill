import React, { useState, useEffect } from "react";

import './App.css';
import MediaQuill from './MediaQuill'
import { videoInit } from './MediaQuill/blots/VideoPlayBlots/videoPlayer'

const isWechat = () => {
  const userAgent = window.navigator.userAgent.toLowerCase()
  return userAgent.indexOf('micromessenger') > -1 || false
}

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"], 
  ["blockquote"],
  [{ align: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "image", "video"],
  ["clean"]
];
function App() {
  // 设置编辑器
  const [editor, setEditor] = useState<null | MediaQuill>(null);
  useEffect(() => {
    if (editor) return;
    const options = {
      modules: {
        toolbar: {
          container: toolbarOptions
        },
        imageResize: {},
        clipboard: {
          imageUpload: async (url: string): Promise<string> => {
            console.log(url);
            const uploadUrl: string = await new Promise(function(resolve) {
              setTimeout(function() {
                resolve("https://hx24.huoxing24.com/image/crawler/2020/06/12/1591948252841567.jpg");
              }, 2000);
            });

            return uploadUrl;
          },
          paste: function(event: MouseEvent){
            console.log(event)
          }
        },
        mediaUploader: {
          imageUpload: async (file: File): Promise<string> => {
            console.log(file);
            const uploadUrl: string = await new Promise(function(resolve) {
              setTimeout(function() {
                resolve("https://hx24.huoxing24.com/image/crawler/2020/06/12/1591948252841567.jpg");
              }, 5000);
            });

            return uploadUrl;
          },
          videoUpload: async (file: File): Promise<string> => {
            console.log(file);
            const uploadUrl: string = await new Promise(function(resolve) {
              setTimeout(function() {
                resolve("https://test-hx24-media.huoxing24.com/video/news/2020/06/23/20200623191858733119.mp4");
              }, 1000);
            });

            return uploadUrl;
          }
        }
      },
      placeholder: "请输入文章内容",
      theme: "snow"
    };
    const editorQuill = new MediaQuill("#editorQuill", options);

    editorQuill.on("text-change", function(delta, oldDelta, source) {
      // if (source === "api") {
      //   console.log("An API call triggered this change.");
      // } else if (source === "user") {
      //   console.log("A user action triggered this change.");
      // }
      // console.log(oldDelta, delta);
    });

    editorQuill.on("selection-change", function(range, oldRange, source) {
      // if (range) {
      //   if (range.length === 0) {
      //     console.log("User cursor is on", range.index);
      //   } else {
      //     const text = editorQuill.getText(range.index, range.length);
      //     console.log("User has highlighted", text);
      //   }
      // } else {
      //   console.log("Cursor not in the editor");
      // }
    });

    setEditor(editorQuill);
  }, [editor]);

  useEffect(()=>{
    // setTimeout(function() {
    //   editor?.videoInit()
    // }, 2000);
    if (!editor) return

    const htmlStr = `<p><strong>.田启成</strong></p><p>·Filecoin可能是下半年比较大的机会，当目前Fil期货流动性比较差，很少的资金量就会对市场带来很大波动。</p><div class="quill-video-player" id="quillVideoPlayer6e5c6f15-2f0d-42f9-abb4-2b827fdb635f"><div class="quill-video-player-content"><video src="https://test-hx24-media.huoxing24.com/video/news/2020/06/23/20200623191858733119.mp4" playsinline="true" webkit-playsinline="true" x5-playsinline="true"></video><div class="quill-video-player-controls"><div class="quill-video-player-switch"><div class="quill-video-player-icon-play"><svg viewBox="0 0 1024 1024"><path d="M246.4 912.64c-17.92 0-32-14.08-32-32V231.68c0-37.12 19.2-71.04 51.84-89.6 32.64-18.56 71.04-18.56 103.68 0L870.4 430.72c32.64 18.56 51.84 51.84 51.84 89.6 0 37.12-19.2 71.04-51.84 89.6l-469.76 271.36c-15.36 8.96-34.56 3.84-43.52-11.52-8.96-15.36-3.84-34.56 11.52-43.52L838.4 554.88c17.92-10.24 19.84-27.52 19.84-33.92 0-7.04-1.92-23.68-19.84-33.92L337.28 197.76c-17.92-10.24-33.28-3.2-39.68 0-5.76 3.2-19.84 13.44-19.84 33.92v648.96c0.64 17.92-14.08 32-31.36 32z"></path></svg></div><div class="quill-video-player-icon-pause"><svg viewBox="0 0 1024 1024"><path d="M325.5 192.5c-19.9 0-36 16.1-36 36v567c0 19.9 16.1 36 36 36s36-16.1 35-36v-567c1-19.9-15.1-36-35-36z m373 0c-19.9 0-36 16.1-36 36v567c0 19.9 16.1 36 36 36s36-16.1 36-36v-567c0-19.9-16.1-36-36-36z" p-id="7763"></path></svg></div></div><div class="quill-video-player-progress-wrapper"><div class="quill-video-player-progress"><div class="quill-video-player-progress-bar"></div><div class="quill-video-player-progress-current"></div></div></div><div class="quill-video-player-time" contenteditable="false"><div class="quill-video-player-cur-time">00:00</div><span>/</span><div class="quill-video-player-total-time">01:45</div></div><div class="quill-video-player-fullscreen"><svg viewBox="0 0 1024 1024"><path d="M160 96h192q14.016 0.992 23.008 10.016t8.992 22.496-8.992 22.496T352 160H160v192q0 14.016-8.992 23.008T128 384t-23.008-8.992T96 352V96h64z m0 832H96v-256q0-14.016 8.992-23.008T128 640t23.008 8.992T160 672v192h192q14.016 0 23.008 8.992t8.992 22.496-8.992 22.496T352 928H160zM864 96h64v256q0 14.016-8.992 23.008T896 384t-23.008-8.992T864 352V160h-192q-14.016 0-23.008-8.992T640 128.512t8.992-22.496T672 96h192z m0 832h-192q-14.016-0.992-23.008-10.016T640 895.488t8.992-22.496T672 864h192v-192q0-14.016 8.992-23.008T896 640t23.008 8.992T928 672v256h-64z" p-id="8486"></path></svg></div></div><div class="quill-media-loading-content" style="display:none"></div><div class="quill-video-player-big-play-btn-mask"><div class="quill-video-player-big-play-btn"><svg viewBox="0 0 1024 1024"><path d="M246.4 912.64c-17.92 0-32-14.08-32-32V231.68c0-37.12 19.2-71.04 51.84-89.6 32.64-18.56 71.04-18.56 103.68 0L870.4 430.72c32.64 18.56 51.84 51.84 51.84 89.6 0 37.12-19.2 71.04-51.84 89.6l-469.76 271.36c-15.36 8.96-34.56 3.84-43.52-11.52-8.96-15.36-3.84-34.56 11.52-43.52L838.4 554.88c17.92-10.24 19.84-27.52 19.84-33.92 0-7.04-1.92-23.68-19.84-33.92L337.28 197.76c-17.92-10.24-33.28-3.2-39.68 0-5.76 3.2-19.84 13.44-19.84 33.92v648.96c0.64 17.92-14.08 32-31.36 32z"></path></svg></div></div></div></div><p><br></p><p>虽然Filecoin和EOS有很多相似之处，但Filecoin在币圈寒冬里以区块链底层基础建设公链的身份，带着去中心化存储应用落地的使命，可能带来一波区块链革命性机会。</p><p>·Fil长期币价主要受制于共识价值和应用价值，共识价值取决于对未来项目或币价的预期，由市场热度决定；应用价值取决于未来Filecoin生态应用的多少，或者说有多少Filecoin会通过应用生态进行流转。</p>`
    editor.clipboard.dangerouslyPasteHTML(htmlStr, 'user')
    // editor.root.innerHTML = htmlStr

    if (isWechat()) {
      document.addEventListener("WeixinJSBridgeReady", function () {
        var audio = document.getElementsByTagName("video");
        for (var i = 0; i < audio.length; i++) {
            audio[i].load();
            videoInit({width: '500px'})
        }
      }, false);
    } else {
      videoInit({width: '500px'})
    }
     
  }, [editor])
  return (
    <div className="App">
      <div dangerouslySetInnerHTML={{ __html: `<p><strong>.田启成</strong></p><p>·Filecoin可能是下半年比较大的机会，当目前Fil期货流动性比较差，很少的资金量就会对市场带来很大波动。</p><div class="quill-video-player" id="quillVideoPlayer6e5c6f15-2f0d-42f9-abb4-2b827fdb635f"><div class="quill-video-player-content"><video src="https://test-hx24-media.huoxing24.com/video/news/2020/06/23/20200623191858733119.mp4" playsinline="true" webkit-playsinline="true" x5-playsinline="true"></video><div class="quill-video-player-controls"><div class="quill-video-player-switch"><div class="quill-video-player-icon-play"><svg viewBox="0 0 1024 1024"><path d="M246.4 912.64c-17.92 0-32-14.08-32-32V231.68c0-37.12 19.2-71.04 51.84-89.6 32.64-18.56 71.04-18.56 103.68 0L870.4 430.72c32.64 18.56 51.84 51.84 51.84 89.6 0 37.12-19.2 71.04-51.84 89.6l-469.76 271.36c-15.36 8.96-34.56 3.84-43.52-11.52-8.96-15.36-3.84-34.56 11.52-43.52L838.4 554.88c17.92-10.24 19.84-27.52 19.84-33.92 0-7.04-1.92-23.68-19.84-33.92L337.28 197.76c-17.92-10.24-33.28-3.2-39.68 0-5.76 3.2-19.84 13.44-19.84 33.92v648.96c0.64 17.92-14.08 32-31.36 32z"></path></svg></div><div class="quill-video-player-icon-pause"><svg viewBox="0 0 1024 1024"><path d="M325.5 192.5c-19.9 0-36 16.1-36 36v567c0 19.9 16.1 36 36 36s36-16.1 35-36v-567c1-19.9-15.1-36-35-36z m373 0c-19.9 0-36 16.1-36 36v567c0 19.9 16.1 36 36 36s36-16.1 36-36v-567c0-19.9-16.1-36-36-36z" p-id="7763"></path></svg></div></div><div class="quill-video-player-progress-wrapper"><div class="quill-video-player-progress"><div class="quill-video-player-progress-bar"></div><div class="quill-video-player-progress-current"></div></div></div><div class="quill-video-player-time" contenteditable="false"><div class="quill-video-player-cur-time">00:00</div><span>/</span><div class="quill-video-player-total-time">01:45</div></div><div class="quill-video-player-fullscreen"><svg viewBox="0 0 1024 1024"><path d="M160 96h192q14.016 0.992 23.008 10.016t8.992 22.496-8.992 22.496T352 160H160v192q0 14.016-8.992 23.008T128 384t-23.008-8.992T96 352V96h64z m0 832H96v-256q0-14.016 8.992-23.008T128 640t23.008 8.992T160 672v192h192q14.016 0 23.008 8.992t8.992 22.496-8.992 22.496T352 928H160zM864 96h64v256q0 14.016-8.992 23.008T896 384t-23.008-8.992T864 352V160h-192q-14.016 0-23.008-8.992T640 128.512t8.992-22.496T672 96h192z m0 832h-192q-14.016-0.992-23.008-10.016T640 895.488t8.992-22.496T672 864h192v-192q0-14.016 8.992-23.008T896 640t23.008 8.992T928 672v256h-64z" p-id="8486"></path></svg></div></div><div class="quill-media-loading-content" style="display:none"></div><div class="quill-video-player-big-play-btn-mask"><div class="quill-video-player-big-play-btn"><svg viewBox="0 0 1024 1024"><path d="M246.4 912.64c-17.92 0-32-14.08-32-32V231.68c0-37.12 19.2-71.04 51.84-89.6 32.64-18.56 71.04-18.56 103.68 0L870.4 430.72c32.64 18.56 51.84 51.84 51.84 89.6 0 37.12-19.2 71.04-51.84 89.6l-469.76 271.36c-15.36 8.96-34.56 3.84-43.52-11.52-8.96-15.36-3.84-34.56 11.52-43.52L838.4 554.88c17.92-10.24 19.84-27.52 19.84-33.92 0-7.04-1.92-23.68-19.84-33.92L337.28 197.76c-17.92-10.24-33.28-3.2-39.68 0-5.76 3.2-19.84 13.44-19.84 33.92v648.96c0.64 17.92-14.08 32-31.36 32z"></path></svg></div></div></div></div><p><br></p><p>虽然Filecoin和EOS有很多相似之处，但Filecoin在币圈寒冬里以区块链底层基础建设公链的身份，带着去中心化存储应用落地的使命，可能带来一波区块链革命性机会。</p><p>·Fil长期币价主要受制于共识价值和应用价值，共识价值取决于对未来项目或币价的预期，由市场热度决定；应用价值取决于未来Filecoin生态应用的多少，或者说有多少Filecoin会通过应用生态进行流转。</p>` }}></div>

      <div id="editorQuill"></div>
      <button onClick={() => {
        // const oldDelta = editor?.root.innerHTML
        // const oldDelta = editor?.getContents();
        // editor?.setContents(editor.clipboard.convert('<div>asfd</div>'));
        // setTimeout(()=>{
        //     editor?.setContents(editor.clipboard.convert(oldDelta));
        // }, 1000)
        console.log(editor?.root.innerHTML);
        editor?.mediaUploading()
      }}>检测是否加载中</button>
    </div>
  );
}

export default App;
