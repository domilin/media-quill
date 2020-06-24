# Media Quill

Rich text editor based on Quill。  
The pictures in the copied HTML content, pasteboard pictures, custom picture upload, pictures can be freely controlled in size. You can upload and insert videos by yourself. Since it is an extension of quill, all methods of quill are applicable

# Support

Built in vanilla JS, typescript support, so it can be used on React, Vue, Angular as well

# API

Provide two apis

### 1: videoInit

Used to reedit text and rich text display

```javascript
videoInit({ width: "600px", height: "400px" });
```

width: video component width  
height: Video component height

### 2: mediaUploading

Check for pictures and videos uploaded when submitting rich text

```javascript
editorQuill.mediaUploading();
```

# Example

**Since it contains the video player, it contains both ends: editor side, display side**

The editor side instance code use Typescript  
The display side instance code use Javascript

But they can all use JS or TS

#### EditorSide

```typescript
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import MediaQuill from "media-quill";
import { videoInit } from "media-quill/es/videoPlayer";
import { RootDispatch } from "../../models/store";

import "./index.scss";

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote"],
  [{ align: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "image", "video"],
  ["clean"], // remove formatting button
];

export default (): JSX.Element => {
  const dispatch: RootDispatch = useDispatch();
  // 设置编辑器
  const [editor, setEditor] = useState<null | MediaQuill>(null);
  useEffect(() => {
    if (editor) return;
    const options = {
      modules: {
        toolbar: {
          container: toolbarOptions,
        },
        imageResize: {},
        clipboard: {
          imageUpload: async (url: string): Promise<string | undefined> => {
            const res = await dispatch.common.urlImgUpload([
              {
                signTime: new Date().getTime(),
                imgSrc: url || "",
              },
            ]);
            if (res?.code === 1 && res?.obj[0]?.imgSrc) {
              return res.obj[0].imgSrc;
            }
          },
        },
        mediaUploader: {
          imageUpload: async (file: File): Promise<string | undefined> => {
            const res = await dispatch.common.fileImgUpload({
              type: "news",
              uploadFile: file,
            });

            if (res?.code === 1) {
              return res.obj;
            }
          },
          videoUpload: async (file: File): Promise<string | undefined> => {
            const videoUrl = await dispatch.common.fileLargeUpload({ file });
            if (videoUrl) return videoUrl;
          },
        },
      },
      placeholder: "请输入文章内容",
      theme: "snow",
    };
    const editorQuill = new MediaQuill("#editorQuill", options);
    setEditor(editorQuill);

    // Initialize the video player
    videoInit();
    // Check if a picture or video is uploading
    console.log(editorQuill.mediaUploading());
  }, [editor, dispatch]);
  return <div id="editorQuill"></div>;
};
```

```stylesheet
@import "../../../node_modules/media-quill/es/index.scss";
```

#### DisplaySide

```javascript
import React, { useEffect, useState } from "react";
import { videoInit } from "media-quill/es/videoPlayer";
export default () => {
  useEffect(() => {
    videoInit({ width: "640px" });
  }, []);
  return <div>rich html</div>;
};
```

```stylesheet
@import "../../../node_modules/media-quill/es/index.scss";
```
