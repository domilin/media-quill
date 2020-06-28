import Quill from "quill";
import defaultsDeep from "lodash/defaultsDeep";
import { DisplaySize } from "./modules/DisplaySize";
import { Toolbar } from "./modules/Toolbar";
import { Resize } from "./modules/Resize";
import * as DefaultOptions from "./defaultOptions";
import { anyType, BaseJson } from "../types";

interface Map {
  [key: string]: anyType;
  [index: number]: anyType;
}
const knownModules = { DisplaySize, Toolbar, Resize } as Map;

/**
 * Custom module for quilljs to allow user to resize <img> elements
 * (Works on Chrome, Edge, Safari and replaces Firefox's native resize behavior)
 */
interface Options {
  modules: Map;
  overlayStyles: BaseJson;
}
export default class ImageResize {
  public quill: Quill;
  public options: Options;
  public moduleClasses: Map;
  public modules: Map;
  public overlay!: HTMLDivElement | null;
  public img!: HTMLImageElement | null;

  public constructor(quill: Quill, options: Options) {
    // save the quill reference and options
    this.quill = quill;

    // Apply the options to our defaults, and stash them for later
    // defaultsDeep doesn't do arrays as you'd expect, so we'll need to apply the classes array from options separately
    let moduleClasses: undefined | Map;
    if (options.modules) {
      moduleClasses = options.modules.slice();
    }

    // Apply options to default options
    this.options = defaultsDeep({}, options, DefaultOptions.default);

    // (see above about moduleClasses)
    if (moduleClasses) {
      this.options.modules = moduleClasses;
    }

    // disable native image resizing on firefox
    document.execCommand("enableObjectResizing", false, "false");

    // respond to clicks inside the editor
    this.quill.root.addEventListener("click", this.handleClick, false);

    (this.quill as anyType).root.parentNode.style.position =
      (this.quill as anyType).root.parentNode.style.position || "relative";

    // setup modules
    this.moduleClasses = this.options.modules;

    this.modules = [];

    // 父级滚动时hide(), 防止在定了高宽后，resize位置跟图片位置不一致
    (this.quill as anyType).root.addEventListener('scroll', (event:MouseEvent) =>{ 
      this.hide()
    })
  }

  public initializeModules = (): void => {
    this.removeModules();

    this.modules = this.moduleClasses.map((ModuleClass: anyType) => {
      return new (knownModules[ModuleClass] || ModuleClass)(this);
    });

    for (const module of this.modules as anyType) {
      module.onCreate();
    }

    this.onUpdate();
  };

  public onUpdate = (): void => {
    this.repositionElements();
    this.modules.forEach((module: { onUpdate: () => void }) => {
      module.onUpdate();
    });
  };

  public removeModules = (): void => {
    this.modules.forEach((module: { onDestroy: () => void }) => {
      module.onDestroy();
    });

    this.modules = [];
  };

  public handleClick = (event: MouseEvent): void => {
    const ele = event.target as HTMLImageElement;
    if (ele && ele.tagName && ele.tagName.toUpperCase() === "IMG") {
      if (this.img === ele) {
        // we are already focused on this image
        // 图片上传中
        return;
      }
      if (this.img) {
        // we were just focused on another image
        this.hide();
      }
      // clicked on an image inside the editor
      this.show(ele);
    } else if (this.img) {
      // clicked on a non image
      this.hide();
    }
  };

  public show = (img: HTMLImageElement): void => {
    // keep track of this img element
    this.img = img;

    this.showOverlay();

    this.initializeModules();
  };

  public showOverlay = (): void => {
    if (this.overlay) {
      this.hideOverlay();
    }

    const index = this.quill.getIndex(Quill.find(this.img as Node))
    this.quill.setSelection(index, 0);

    // prevent spurious text selection
    this.setUserSelect("none");

    // listen for the image being deleted or moved
    document.addEventListener("keyup", this.checkImage, true);
    this.quill.root.addEventListener("input", this.checkImage, true);

    // Create and add the overlay
    this.overlay = document.createElement("div");
    Object.assign(this.overlay.style, this.options.overlayStyles);

    (this.quill as anyType).root.parentNode.appendChild(this.overlay);

    this.repositionElements();
  };

  public hideOverlay = (): void => {
    if (!this.overlay) {
      return;
    }

    // Remove the overlay
    (this.quill as anyType).root.parentNode.removeChild(this.overlay);
    this.overlay = null;

    // stop listening for image deletion or movement
    document.removeEventListener("keyup", this.checkImage);
    this.quill.root.removeEventListener("input", this.checkImage);

    // reset user-select
    this.setUserSelect("");
  };

  public repositionElements = (): void => {
    if (!this.overlay || !this.img) {
      return;
    }

    // position the overlay over the image
    const parent = (this.quill as anyType).root.parentNode;
    const imgRect = this.img.getBoundingClientRect();
    const containerRect = parent.getBoundingClientRect();

    Object.assign(this.overlay.style, {
      left: `${imgRect.left - containerRect.left - 1 + parent.scrollLeft}px`,
      top: `${imgRect.top - containerRect.top + parent.scrollTop}px`,
      width: `${imgRect.width}px`,
      height: `${imgRect.height}px`
    });
  };

  public hide = (): void => {
    this.hideOverlay();
    this.removeModules();
    this.img = null;
  };

  public setUserSelect = (value: string): void => {
    ["userSelect", "mozUserSelect", "webkitUserSelect", "msUserSelect"].forEach((prop: anyType) => {
      // set on contenteditable element and <html>
      this.quill.root.style[prop] = value;
      document.documentElement.style[prop] = value;
    });
  };

  public checkImage = (event: Event): void => {
    if (this.img) {
      if ((event as KeyboardEvent).keyCode === 46 || (event as KeyboardEvent).keyCode === 8) {
        Quill.find(this.img).deleteAt(0);
      }
      this.hide();
    }
  };
}
