import DOMPurify from "dompurify";
import Quill, { DeltaOperation } from "quill";
import MediaLoading from "../blots/MediaUplodBlots";
import { anyType } from "../types";
import { uuid } from "../utils";

const Delta = Quill.import("delta");
const Clipboard = Quill.import("modules/clipboard");

interface Options {
  allowed: boolean;
  keepSelection: boolean;
  imageUpload: (src: string) => Promise<string>;
}
interface Allowed {
  ALLOWED_TAGS: string[];
  ALLOWED_ATTR: string[];
}
class PasteSmart extends Clipboard {
  static keepSelection = false;
  static allowed = [];

  constructor(quill: Quill, options: Options) {
    super(quill, options);

    this.allowed = options.allowed;
    this.keepSelection = options.keepSelection;
    this.imageUpload = options.imageUpload;
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    if (this.options && this.options.paste) {
      this.options.paste(event)
    }

    const range = this.quill.getSelection();

    const text = (event.clipboardData as DataTransfer).getData("text/plain");
    const html = (event.clipboardData as DataTransfer).getData("text/html");

    let delta = new Delta().retain(range.index).delete(range.length);

    let content: string | TrustedHTML = text;
    if (html) {
      const allowed = this.getAllowed();
      content = DOMPurify.sanitize(html, allowed);

      const pasteDelta = this.convert(content);

      // delta标识需要上传的图片
      if (this.imageUpload) {
        pasteDelta.ops = pasteDelta.map(function(item: DeltaOperation, index: number): DeltaOperation {
          if (item.insert && typeof item.insert === "object" && "image" in item.insert) {
            item.attributes = item.attributes || {};
            item.attributes.link = "#quill-paste-img-upload";
          }
          return item;
        });
      }
      delta = delta.concat(pasteDelta);
    } else {
      delta = delta.insert(content);
    }

    this.quill.updateContents(delta, (Quill as anyType).sources.USER);

    // move cursor
    delta = this.convert(content);
    if (this.keepSelection) this.quill.setSelection(range.index, delta.length(), (Quill as anyType).sources.SILENT);
    else this.quill.setSelection(range.index + delta.length(), (Quill as anyType).sources.SILENT);

    this.quill.scrollIntoView();

    if (this.imageUpload) {
      /** @desc 上传图片
       * 1: 替换带有#paste-img-upload为loading样式
       * 2: 上传图片
       * 3: 替换为单独img标签
       * */
      interface IdItem {
        src: string;
        id: string;
      }
      const uploadImg = this.quill.root.getElementsByTagName("a");
      const uploadImgArr = Array.prototype.slice.call(uploadImg);
      const uploadImgIdArr: IdItem[] = [];

      // 替换需要上传的图片为上传中样式
      uploadImgArr.map((item, index) => {
        if (item.getAttribute("href") === "#quill-paste-img-upload") {
          const src = item.getElementsByTagName("img")[0].getAttribute("src");
          const index = this.quill.getIndex(Quill.find(item));
          const id = `quillImageUploading-${uuid()}`;

          this.quill.deleteText(index, 1, "user");
          this.quill.insertEmbed(index, MediaLoading.blotName, { src, id }, "user");

          uploadImgIdArr.push({ src, id });
        }
        return item;
      });

      // 上传完成后替换成单图片blot
      uploadImgIdArr.map(async (item: IdItem, index: number) => {
        const newSrc = await this.imageUpload(item.src);
        if (newSrc) {
          const ele = document.getElementById(item.id);
          const index = this.quill.getIndex(Quill.find(ele as Node));

          ele?.remove();
          // this.quill.deleteText(index, 1, "user");
          this.quill.insertEmbed(index, "image", `${newSrc}`, "user");
        }
      });
    }
  }

  getAllowed(): Allowed {
    const tidy: anyType = {};

    if (this.allowed && this.allowed.tags) tidy.ALLOWED_TAGS = this.allowed.tags;
    if (this.allowed && this.allowed.attributes) tidy.ALLOWED_ATTR = this.allowed.attributes;

    if (tidy.ALLOWED_TAGS === undefined || tidy.ALLOWED_ATTR === undefined) {
      let undefinedTags = false;
      if (tidy.ALLOWED_TAGS === undefined) {
        undefinedTags = true;
        tidy.ALLOWED_TAGS = ["p", "br", "span"];
      }

      let undefinedAttr = false;
      if (tidy.ALLOWED_ATTR === undefined) {
        undefinedAttr = true;
        tidy.ALLOWED_ATTR = ["class"];
      }

      const toolbar = this.quill.getModule("toolbar");
      toolbar.controls.forEach((control: [string, { value: string; options: string }]) => {
        switch (control[0]) {
          case "bold":
            if (undefinedTags) {
              tidy.ALLOWED_TAGS.push("b");
              tidy.ALLOWED_TAGS.push("strong");
            }
            break;

          case "italic":
            if (undefinedTags) {
              tidy.ALLOWED_TAGS.push("i");
            }
            break;

          case "underline":
            if (undefinedTags) {
              tidy.ALLOWED_TAGS.push("u");
            }
            break;

          case "strike":
            if (undefinedTags) {
              tidy.ALLOWED_TAGS.push("s");
            }
            break;

          case "color":
          case "background":
            if (undefinedAttr) {
              tidy.ALLOWED_ATTR.push("style");
            }
            break;

          case "script":
            if (undefinedTags) {
              if (control[1].value === "super") {
                tidy.ALLOWED_TAGS.push("sup");
              } else if (control[1].value === "sub") {
                tidy.ALLOWED_TAGS.push("sub");
              }
            }
            break;

          case "header":
            if (undefinedTags) {
              const detectAllowedHeadingTag = (value: string): void => {
                if (value === "1") {
                  tidy.ALLOWED_TAGS.push("h1");
                } else if (value === "2") {
                  tidy.ALLOWED_TAGS.push("h2");
                } else if (value === "3") {
                  tidy.ALLOWED_TAGS.push("h3");
                } else if (value === "4") {
                  tidy.ALLOWED_TAGS.push("h4");
                } else if (value === "5") {
                  tidy.ALLOWED_TAGS.push("h5");
                } else if (value === "6") {
                  tidy.ALLOWED_TAGS.push("h6");
                }
              };

              if (control[1].value) detectAllowedHeadingTag(control[1].value);
              else if (control[1].options && control[1].options.length) {
                [].forEach.call(control[1].options, (option: { value: string }) => {
                  if (option.value) detectAllowedHeadingTag(option.value);
                });
              }
            }
            break;

          case "code-block":
            if (undefinedTags) {
              tidy.ALLOWED_TAGS.push("pre");
            }
            if (undefinedAttr) {
              tidy.ALLOWED_ATTR.push("spellcheck");
            }
            break;

          case "list":
            if (undefinedTags) {
              if (control[1].value === "ordered") {
                tidy.ALLOWED_TAGS.push("ol");
              } else if (control[1].value === "bullet") {
                tidy.ALLOWED_TAGS.push("ul");
              }
              tidy.ALLOWED_TAGS.push("li");
            }
            break;

          case "link":
            if (undefinedTags) {
              tidy.ALLOWED_TAGS.push("a");
            }
            if (undefinedAttr) {
              tidy.ALLOWED_ATTR.push("href");
              tidy.ALLOWED_ATTR.push("target");
              tidy.ALLOWED_ATTR.push("rel");
            }
            break;

          case "image":
            if (undefinedTags) {
              tidy.ALLOWED_TAGS.push("img");
            }
            if (undefinedAttr) {
              tidy.ALLOWED_ATTR.push("src");
              tidy.ALLOWED_ATTR.push("title");
              tidy.ALLOWED_ATTR.push("alt");
            }
            break;

          case "video":
            if (undefinedTags) {
              tidy.ALLOWED_TAGS.push("iframe");
            }
            if (undefinedAttr) {
              tidy.ALLOWED_ATTR.push("frameborder");
              tidy.ALLOWED_ATTR.push("allowfullscreen");
              tidy.ALLOWED_ATTR.push("src");
            }
            break;

          case "blockquote":
            if (undefinedTags) {
              tidy.ALLOWED_TAGS.push(control[0]);
            }
            break;
        }
      });
    }

    return tidy;
  }
}

// Quill.register('modules/clipboard', PasteSmart, true);
export default PasteSmart;
