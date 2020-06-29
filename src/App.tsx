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

    const htmlStr = `<div class=><p><strong>.田启成</strong></p><p>·Filecoin可能是下半年比较大的机会，当目前Fil期货流动性比较差，很少的资金量就会对市场带来很大波动。</p><p>·虽然Filecoin和EOS有很多相似之处，但Filecoin在币圈寒冬里以区块链底层基础建设公链的身份，带着去中心化存储应用落地的使命，可能带来一波区块链革命性机会。</p><p>·Fil长期币价主要受制于共识价值和应用价值，共识价值取决于对未来项目或币价的预期，由市场热度决定；应用价值取决于未来Filecoin生态应用的多少，或者说有多少Filecoin会通过应用生态进行流转。</p><p><strong>2.商思林</strong></p><p>·跟比特币相比，Filecoin挖矿的生态更呈现为All in one，或者链式生态，矿机、矿场、矿池、算力平台多位一体，彼此的有机性很强，不容易迁移。将来竞争可能更多集中在以矿机集群为基础形态的矿池上面。</p><p>·经济模型只是FIL投资背后的影响因素之一，虽然Filecoin的经济模型比较复杂，但对于一般投资者，其实并不需要头疼。FIL奖励目前有储存奖励、检索奖励、和出块奖励，其中出块奖励最为丰厚，也是矿工们争夺的首要目标；在奖励背后是Filecoin的承诺质押和存储交易质押体系，以及与之匹配的惩罚机制。</p><p>·本质上，Fil期货热也跟市场上缺少相对大热点有关系的，比特币目前在盘整期，以太坊也要再等待，波卡和Filecoin不在一个量级上。除了Filecoin，看不到其他现象级的热点。只有赚钱效应才能吸引更多的钱进入市场，推动币价。</p><p><strong>3.酒儿</strong></p><p>·目前期货的价格是早期投资人在主网上线前做的一种积极助推。通过独特的IPFS和挖矿概念把这一领域的开拓性和想象力在市场的各处宣传出来，虽然看起来市场的氛围导向是利好的，但是主网正式上线后，市场对价值的衡量效果可能不如预期。</p><div class="quill-video-player" id="quillVideoPlayerc8a6a8bd-5ffc-4b98-bf97-fc1761403c54"><div class="quill-video-player-content"><video  playsinline=true webkit-playsinline=true x5-playsinline=true src="https://test-hx24-media.huoxing24.com/video/news/2020/06/28/20200628163521700403.mp4"></video><div class="quill-video-player-controls"><div class="quill-video-player-switch"><div class="quill-video-player-icon-play"><svg viewBox="0 0 1024 1024"><path d="M246.4 912.64c-17.92 0-32-14.08-32-32V231.68c0-37.12 19.2-71.04 51.84-89.6 32.64-18.56 71.04-18.56 103.68 0L870.4 430.72c32.64 18.56 51.84 51.84 51.84 89.6 0 37.12-19.2 71.04-51.84 89.6l-469.76 271.36c-15.36 8.96-34.56 3.84-43.52-11.52-8.96-15.36-3.84-34.56 11.52-43.52L838.4 554.88c17.92-10.24 19.84-27.52 19.84-33.92 0-7.04-1.92-23.68-19.84-33.92L337.28 197.76c-17.92-10.24-33.28-3.2-39.68 0-5.76 3.2-19.84 13.44-19.84 33.92v648.96c0.64 17.92-14.08 32-31.36 32z"></path></svg></div><div class="quill-video-player-icon-pause"><svg viewBox="0 0 1024 1024"><path d="M325.5 192.5c-19.9 0-36 16.1-36 36v567c0 19.9 16.1 36 36 36s36-16.1 35-36v-567c1-19.9-15.1-36-35-36z m373 0c-19.9 0-36 16.1-36 36v567c0 19.9 16.1 36 36 36s36-16.1 36-36v-567c0-19.9-16.1-36-36-36z" p-id="7763"></path></svg></div></div><div class="quill-video-player-progress"><div class="quill-video-player-progress-bar"></div></div><div class="quill-video-player-time" contenteditable="false"><div class="quill-video-player-cur-time">--:--</div><span>/</span><div class="quill-video-player-total-time">--:--</div></div><div class="quill-video-player-fullscreen"><svg viewBox="0 0 1024 1024"><path d="M160 96h192q14.016 0.992 23.008 10.016t8.992 22.496-8.992 22.496T352 160H160v192q0 14.016-8.992 23.008T128 384t-23.008-8.992T96 352V96h64z m0 832H96v-256q0-14.016 8.992-23.008T128 640t23.008 8.992T160 672v192h192q14.016 0 23.008 8.992t8.992 22.496-8.992 22.496T352 928H160zM864 96h64v256q0 14.016-8.992 23.008T896 384t-23.008-8.992T864 352V160h-192q-14.016 0-23.008-8.992T640 128.512t8.992-22.496T672 96h192z m0 832h-192q-14.016-0.992-23.008-10.016T640 895.488t8.992-22.496T672 864h192v-192q0-14.016 8.992-23.008T896 640t23.008 8.992T928 672v256h-64z" p-id="8486"></path></svg></div></div><div class="quill-media-loading-content"></div></div></div><p><br></p><p>·从FIL自身来看，是否有更好的信息存储方案，对矿工来讲收益是否理想，对安全、效率和去中心化的方面如何平衡，在冗余信息上的处理方式等等都会影响整个项目的长远走向。</p><p>·项目实际应用中能够解决多大的问题，自身是否存在严重的逻辑漏洞决定了项目的市场和预期，而挖矿收益、释放规则等会影响矿工，进而影响二级市场和投资人等等。</p><p><strong>4.李翔敏</strong></p><p>· 目前Filecoin生态处于初级阶段，矿机生态相对完善，但和比特币相比，还没有形成某个矿机巨头绝对垄断的局面，矿机厂商都在跑马圈地，在主网上线后还会激烈竞争。而协议开发者生态还相对较弱，无论开发者的数量还是Dapp数量跟以太坊都不在一个级别，有较长的路要走。</p><p>受助于Filecoin的带动和Coinbase等大交易所未来准备上线存储类代币的利好，存储板块项目今年已经有了一波显著的行情，包括Storj和Sia币价都上涨超过200%</p><p>在Filecoin网络真正成熟稳定且有海量商用存储需求真实涌入之前，FIL 币价将主要由购币抵押的矿工以及二级市场投资者支撑，矿工与存储空间的增长情况以及二级市场的投资炒作热度会在很大程度决定FIL的币价走势。</p><p><strong>5.胡锋</strong></p><p>· Fil价格“上线即巅峰”的概率很小，不会走EOS的</p></div>`
    editor.clipboard.dangerouslyPasteHTML(htmlStr, 'user')
    // editor.root.innerHTML = htmlStr

    if (isWechat()) {
      document.addEventListener("WeixinJSBridgeReady", function () {
        var audio = document.getElementsByTagName("video");
        for (var i = 0; i < audio.length; i++) {
            audio[i].load();
            videoInit({width: '500px', height: '400px'})
        }
      }, false);
    } else {
      videoInit({width: '500px', height: '400px'})
    }
     
  }, [editor])
  return (
    <div className="App">
      <div dangerouslySetInnerHTML={{ __html: `<p><strong>联播+</strong>“体育代表着青春、健康、活力，关乎人民幸福，关乎民族未来。”</p><p>多年来，习近平总书记积极弘扬体育文化精神、倡导体育运动普及发展，在助力中华儿女共圆百年奥运梦和发展奥林匹克文化上更是不遗余力。他曾在不同场合对奥林匹克精神作出阐述，也身体力行加入到践行奥林匹克精神的行动当中。</p><p>6月23日是国际奥林匹克日，央视网《联播+》特梳理相关论述，与您共同感悟习近平总书记的五环情怀。</p><p><img src="https://hx24.huoxing24.com/image/crawler/2020/06/12/1591948252841567.jpg"/></p><p><br/></p><p><br/></p><div class="quill-video-player" id="quillVideoPlayere507e14c-f3db-47de-8f58-b340ba8efabd"><div class="quill-video-player-content"><video playsinline="true" webkit-playsinline="true" x5-playsinline="true" src="https://test-hx24-media.huoxing24.com/video/news/2020/06/23/20200623191858733119.mp4"></video><div class="quill-video-player-controls"><div class="quill-video-player-switch"><div class="quill-video-player-icon-play"><svg viewBox="0 0 1024 1024"><path d="M246.4 912.64c-17.92 0-32-14.08-32-32V231.68c0-37.12 19.2-71.04 51.84-89.6 32.64-18.56 71.04-18.56 103.68 0L870.4 430.72c32.64 18.56 51.84 51.84 51.84 89.6 0 37.12-19.2 71.04-51.84 89.6l-469.76 271.36c-15.36 8.96-34.56 3.84-43.52-11.52-8.96-15.36-3.84-34.56 11.52-43.52L838.4 554.88c17.92-10.24 19.84-27.52 19.84-33.92 0-7.04-1.92-23.68-19.84-33.92L337.28 197.76c-17.92-10.24-33.28-3.2-39.68 0-5.76 3.2-19.84 13.44-19.84 33.92v648.96c0.64 17.92-14.08 32-31.36 32z"></path></svg></div><div class="quill-video-player-icon-pause"><svg viewBox="0 0 1024 1024"><path d="M325.5 192.5c-19.9 0-36 16.1-36 36v567c0 19.9 16.1 36 36 36s36-16.1 35-36v-567c1-19.9-15.1-36-35-36z m373 0c-19.9 0-36 16.1-36 36v567c0 19.9 16.1 36 36 36s36-16.1 36-36v-567c0-19.9-16.1-36-36-36z" p-id="7763"></path></svg></div></div><div class="quill-video-player-progress"><div class="quill-video-player-progress-bar"></div></div><div class="quill-video-player-time" contenteditable="false"><div class="quill-video-player-cur-time">00:00</div><span>/</span><div class="quill-video-player-total-time">01:45</div></div><div class="quill-video-player-fullscreen"><svg viewBox="0 0 1024 1024"><path d="M160 96h192q14.016 0.992 23.008 10.016t8.992 22.496-8.992 22.496T352 160H160v192q0 14.016-8.992 23.008T128 384t-23.008-8.992T96 352V96h64z m0 832H96v-256q0-14.016 8.992-23.008T128 640t23.008 8.992T160 672v192h192q14.016 0 23.008 8.992t8.992 22.496-8.992 22.496T352 928H160zM864 96h64v256q0 14.016-8.992 23.008T896 384t-23.008-8.992T864 352V160h-192q-14.016 0-23.008-8.992T640 128.512t8.992-22.496T672 96h192z m0 832h-192q-14.016-0.992-23.008-10.016T640 895.488t8.992-22.496T672 864h192v-192q0-14.016 8.992-23.008T896 640t23.008 8.992T928 672v256h-64z" p-id="8486"></path></svg></div></div><div class="quill-media-loading-content" style="display:none"></div></div></div><p><br/></p>` }}></div>

      <div id="editorQuill"></div>
      <button onClick={() => {
        const oldDelta = editor?.root.innerHTML
        // const oldDelta = editor?.getContents();
        editor?.setContents(editor.clipboard.convert('<div>asfd</div>'));
        setTimeout(()=>{
            editor?.setContents(editor.clipboard.convert(oldDelta));
        }, 1000)
        console.log(editor?.root.innerHTML);
        editor?.mediaUploading()
      }}>检测是否加载中</button>
    </div>
  );
}

export default App;
