import React, { useState, useEffect } from "react";

import './App.css';
import MediaQuill from './MediaQuill'

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
              }, 20000);
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
              }, 100000);
            });

            return uploadUrl;
          },
          videoUpload: async (file: File): Promise<string> => {
            console.log(file);
            const uploadUrl: string = await new Promise(function(resolve) {
              setTimeout(function() {
                resolve("https://hx24-media.huoxing24.com/video/news/2020/06/18/20200618082120636599.mp4");
              }, 100000);
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
  return (
    <div className="App">
      <div id="editorQuill"></div>
      <button onClick={()=>{
        editor?.mediaUploading()
      }}>检测是否加载中</button>
    </div>
  );
}

export default App;
