import Quill from "quill";
import MedaiUploader from "./MediaUploader";
import ImageResize from "./ImageResize";
import PasteSmart from "./PasteSmart";
import { videoInit } from './blots/VideoPlayBlots/videoPlayer'

import "./index.scss";

Quill.debug("warn");
Quill.register("modules/mediaUploader", MedaiUploader);
Quill.register("modules/imageResize", ImageResize);
Quill.register("modules/clipboard", PasteSmart, true);

export default class MediaQuill extends Quill {
    // 默认视频播放: 重新编辑文章
    public videoInit ():void {
        videoInit()
    }

    // 提交时检测是否有media-uploading, img的src是否包含base64
    public mediaUploading (): boolean {
        const uploading = this.root.getElementsByClassName('quill-media-uploading')
        const base64Img = this.root.getElementsByTagName('img')
        if (uploading.length === 0 && base64Img.length === 0) return true
        
        if (uploading.length > 0) {
            const item = uploading[0]
            item.scrollIntoView();
            return false
        }

        if (base64Img.length > 0) {
            for (let key in base64Img) {
                const item = base64Img[key]
                const src = item.getAttribute('src') || ""
                const reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\\/?%\s]*?)\s*$/i;

                if (reg.test(src)) {
                    item.scrollIntoView();
                    return false
                }
            }
        }
        
        return false
    }
}
