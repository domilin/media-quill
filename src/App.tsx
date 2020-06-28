import React, { useState, useEffect } from "react";

import './App.css';
import MediaQuill from './MediaQuill'
import { videoInit } from './MediaQuill/blots/VideoPlayBlots/videoPlayer'

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

    const htmlStr = `<div class=><p style="text-align: left;">12月15日上午，“粤港澳区块链产业智库“（以下简称“智库“）在广州科学城会议中心举行的“深入学习习近平总书记关于区块链重要讲话精神系列培训活动第二期暨2019粤港澳区块链重大项目签约活动”（以下简称“该活动”）上正式成立，挪威工程院院士容淳铭担任荣誉顾问，清华x-lab青藤链盟研究院院长钟宏担任首席顾问，首批来自政产学研各领域的指导专家和专家成员登台亮相。<br></p><p style="text-align: left;">该活动由区块链产业人才研究所、清华x-lab、国研智库创新科学园数权经济创新发展中心、赛迪区块链研究院联合粤港澳大湾区区块链联盟、广州市区块链产业协会举办，旨在深入学习习总书记区块链重要讲话精神，加快落实广州市委书张硕辅到黄浦区开展区块链技术和产业发展工作调研时的工作部署。。。。。</p><p style="text-align: center;"><img src="https://img.jinse.com/2780216_image3.png" alt="7ZUXy2KqllT2eEKHUnFB3fqfdwwA0q6nRixWeI8r.png"> <br></p><p style="text-align: left;">（粤港澳区块链产业智库发起机构代表，从左至右：区块链产业人才研究所负责人张晓媛、广州市区块链产业协会秘书长任豪、香港城市大学商学院教授刘光梧、赛迪智库网络安全研究所所长刘权、挪威工程院院士容淳铭、清华x-lab青藤链盟研究院院长钟宏、中山大学数据科学与计算机学院教授郑子彬、区块链产业智库秘书长傅明）</p><p style="text-align: left;"><strong>智库先行，国际视角深入解读总书记关于区块链重要讲话精神</strong></p><p style="text-align: left;">区块链发展国家战略叠加粤港澳大湾区建设规划，如何突破，智库先行。</p><p style="text-align: left;">“粤港澳区块链产业智库“是由区块链产业人才研究所、区块链产业智库、清华x-lab、广州市区块链产业协会、赛迪智库网络安全研究所、挪威工程院、中山大学数据科学与计算机学院、香港城市大学商学院等机构共同发起。</p><p style="text-align: center;"><img src="https://img.jinse.com/2780218_image3.png" alt="aaP8nf3iFMo1DAJtxenIyfmJPPdR6XwDlZdXVPo5.png"> <br></p><p style="text-align: left;">作为全国首个区域性区块链产业智库，“粤港澳区块链产业智库”将依托粤港澳独特的区位优势，聚合政产学研媒各领域专业机构的权威专家学者，为粤港澳区块链技术与产业创新发展和融合发展，提供顶层规划、人才体系、产业聚合、创新应用的综合智库服务。</p><p style="text-align: left;">在智库成立仪式上，首批专家登台亮相，挪威工程院容淳铭院士出任荣誉顾问，清华x-lab青藤链盟研究院院长钟宏出任首席顾问，来自高校和科研机构的权威专家包括赛迪智库网络安全研究所所长刘权，中山大学教授郑子彬、吴维冈、卞静，香港城市大学刘光梧，福州大学郑相涵研究员等出任智库指导专家，专家团成员还有来自行业协会、服务机构和企业的一线专家。</p><p style="text-align: center;"> <img src="https://img.jinse.com/2780220_image3.png" alt="ZijHJgyKtuiupDaS6w0EpnH8uIVrc0fSTd5eXteB.png"><br></p><p style="text-align: left;"><strong>粤港澳区块链发展路径，大学习、大讨论再掀新高潮</strong></p><p style="text-align: left;">智库荣誉顾问容淳铭院士在活动上做了题为《基于区块链的未来互联网服务》主题报告，围绕“如何把包括5G技术、人工智能在内的中国领先世界的技术与区块链技术充分结合起来”的重大命题展开分享；刘权所长带来《如何理解和应用区块链技术》主题分享，详细解读区块链技术上升为国家战略的深远意义，深入分析区块链技术在我国技术创新和产业变革当中发挥的重要作用。</p><p style="text-align: center;"><img src="https://img.jinse.com/2780222_image3.png" alt="VTbj07V5OwxYj3cNNkQF1MvkTLBWlTLjg4LM093N.png"> <br></p><p style="text-align: center;">（粤港澳区块链产业智库荣誉顾问挪威工程院院士容淳铭）</p><p style="text-align: center;"><img src="https://img.jinse.com/2780249_image3.png" alt="FW80gyeRZjexxx4YKWAiHi3vvncAEBxTXwErm5ia.png">（粤港澳区块链产业智库指导专家 赛迪智库网络安全研究所所长刘权）</p><p style="text-align: left;"><strong>粤港澳区块链产业智库高峰对话 国际国内专家建言献策</strong></p><p style="text-align: left;">粤港澳区块链产业智库高峰对话由智库首席顾问钟宏院长主持。挪威工程院容淳铭院士、赛迪智库网络安全研究所刘权所长、中山大学数据科学与计算机学院郑子彬教授、香港城市大学商学院刘光梧教授以及粤港澳大湾区区块链联盟、广州市区块链产业协会任豪秘书长参与了对话，为粤港澳发展区块链技术与产业建言献策。嘉宾结合当下国内外区块链产业发展趋势，围绕粤港澳大湾区区块链自身发展特色，广泛探讨了广州区块链产业创新发展的重大机遇和可行路径。</p><p style="text-align: center;"><img src="https://img.jinse.com/2780252_image3.png" alt="OLVSDwRh4OoBABCLrTYY7BOO7saeiDL4aRz9xUwb.png"> <br></p><p style="text-align: center;">（嘉宾热议粤港澳区块链发展未来）</p><p style="text-align: left;">粤港澳区块链产业智库的成立对于粤港澳大湾区而言具有重大意义。未来，依托智库等重大平台项目，区域将进一步推动区块链和实体经济深度融合，助力打造“区块链+”典型应用场景，不断布局、加快培育区块链产业生态，加快打造区块链产业集聚区、创新引领区、应用先行区。</p><p style="text-align: left;"><strong>区块链产业智库，服务于区块链技术与产业发发展</strong></p><p style="text-align: left;">区块链产业智库，是由区块链产业人才研究所（工信部人才交流中心联合产业机构发起成立）、清华x-lab等多家机构共同发起。旨在聚合政产学研媒各领域专业机构的权威专家，服务于区块链技术与产业发展。</p><p style="text-align: left;">自成立以来区块链产业智库服务于中央机关、部委和地方政府，开展学习研讨、培训、论坛等活动。<strong>区块链产业智库联合各地区政府有关机构和各行业协会发起多个垂直行业和区域性和行业性的区块链产业智库</strong>，继粤港澳区块链产业智库之后，还将联合地方政府有关机构成立福建区块链产业智库成立、东莞区块链产业智库，联合部委和行业协会成立物联网区块链产业智库、可信数字身份与密码区块链应用智库、教育区块链应用智库、司法区块链产业智库、交通区块链产业智库等。力争在全国各地、各行业加快推进区块链技术于产业的创新发展，为实体经济插上“区块链+”的翅膀。</p><p style="text-align: left;">发起方介绍：</p><p style="text-align: left;">区块链产业人才研究所，是由工信部人才交流中心联合微众银行等行业头部企业共建，由链人国际具体运营，是集人才研究、人才培育、人才评价、人才服务为核心的品牌。</p><p style="text-align: left;">清华x-lab，是清华大学三创平台，提供创新人才培养和科技创新转化服务。由清华经管学院联合清华大学15个院系共建，培育清华1500多个创新项目，累计融资60多亿元。</p></div>`
    editor.clipboard.dangerouslyPasteHTML(htmlStr, 'user')

    videoInit({width: '500px', height: '400px'})
  }, [editor])
  return (
    <div className="App">
      <div id="editorQuill"></div>
      <button onClick={() => {
        console.log(editor?.root.innerHTML);
        editor?.mediaUploading()
      }}>检测是否加载中</button>

      <div dangerouslySetInnerHTML={{ __html: `<p><strong>联播+</strong>“体育代表着青春、健康、活力，关乎人民幸福，关乎民族未来。”</p><p>多年来，习近平总书记积极弘扬体育文化精神、倡导体育运动普及发展，在助力中华儿女共圆百年奥运梦和发展奥林匹克文化上更是不遗余力。他曾在不同场合对奥林匹克精神作出阐述，也身体力行加入到践行奥林匹克精神的行动当中。</p><p>6月23日是国际奥林匹克日，央视网《联播+》特梳理相关论述，与您共同感悟习近平总书记的五环情怀。</p><p><img src="https://hx24.huoxing24.com/image/crawler/2020/06/12/1591948252841567.jpg"/></p><p><br/></p><p><br/></p><div class="quill-video-player" id="quillVideoPlayere507e14c-f3db-47de-8f58-b340ba8efabd"><div class="quill-video-player-content"><video src="https://test-hx24-media.huoxing24.com/video/news/2020/06/23/20200623191858733119.mp4"></video><div class="quill-video-player-controls"><div class="quill-video-player-switch"><div class="quill-video-player-icon-play"><svg viewBox="0 0 1024 1024"><path d="M246.4 912.64c-17.92 0-32-14.08-32-32V231.68c0-37.12 19.2-71.04 51.84-89.6 32.64-18.56 71.04-18.56 103.68 0L870.4 430.72c32.64 18.56 51.84 51.84 51.84 89.6 0 37.12-19.2 71.04-51.84 89.6l-469.76 271.36c-15.36 8.96-34.56 3.84-43.52-11.52-8.96-15.36-3.84-34.56 11.52-43.52L838.4 554.88c17.92-10.24 19.84-27.52 19.84-33.92 0-7.04-1.92-23.68-19.84-33.92L337.28 197.76c-17.92-10.24-33.28-3.2-39.68 0-5.76 3.2-19.84 13.44-19.84 33.92v648.96c0.64 17.92-14.08 32-31.36 32z"></path></svg></div><div class="quill-video-player-icon-pause"><svg viewBox="0 0 1024 1024"><path d="M325.5 192.5c-19.9 0-36 16.1-36 36v567c0 19.9 16.1 36 36 36s36-16.1 35-36v-567c1-19.9-15.1-36-35-36z m373 0c-19.9 0-36 16.1-36 36v567c0 19.9 16.1 36 36 36s36-16.1 36-36v-567c0-19.9-16.1-36-36-36z" p-id="7763"></path></svg></div></div><div class="quill-video-player-progress"><div class="quill-video-player-progress-bar"></div></div><div class="quill-video-player-time" contenteditable="false"><div class="quill-video-player-cur-time">00:00</div><span>/</span><div class="quill-video-player-total-time">01:45</div></div><div class="quill-video-player-fullscreen"><svg viewBox="0 0 1024 1024"><path d="M160 96h192q14.016 0.992 23.008 10.016t8.992 22.496-8.992 22.496T352 160H160v192q0 14.016-8.992 23.008T128 384t-23.008-8.992T96 352V96h64z m0 832H96v-256q0-14.016 8.992-23.008T128 640t23.008 8.992T160 672v192h192q14.016 0 23.008 8.992t8.992 22.496-8.992 22.496T352 928H160zM864 96h64v256q0 14.016-8.992 23.008T896 384t-23.008-8.992T864 352V160h-192q-14.016 0-23.008-8.992T640 128.512t8.992-22.496T672 96h192z m0 832h-192q-14.016-0.992-23.008-10.016T640 895.488t8.992-22.496T672 864h192v-192q0-14.016 8.992-23.008T896 640t23.008 8.992T928 672v256h-64z" p-id="8486"></path></svg></div></div><div class="quill-media-loading-content" style="display:none"></div></div></div><p><br/></p>` }}></div>
    </div>
  );
}

export default App;
