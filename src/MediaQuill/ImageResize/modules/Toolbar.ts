import { BaseModule } from "./BaseModule";
import Quill from "quill";

const IconAlignLeft = `<svg viewBox="0 0 18 18" style="fill: rgb(68, 68, 68); stroke: rgb(68, 68, 68); stroke-width: 2;">
<line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"></line>
<line class="ql-stroke" x1="14" x2="4" y1="14" y2="14"></line>
<line class="ql-stroke" x1="12" x2="6" y1="4" y2="4"></line>
</svg>`;
const IconAlignCenter = `<svg viewBox="0 0 18 18" style="fill: rgb(68, 68, 68); stroke: rgb(68, 68, 68); stroke-width: 2;">
<line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"></line>
<line class="ql-stroke" x1="14" x2="4" y1="14" y2="14"></line>
<line class="ql-stroke" x1="12" x2="6" y1="4" y2="4"></line>
</svg>`;
const IconAlignRight = `<svg viewBox="0 0 18 18" style="fill: rgb(68, 68, 68); stroke: rgb(68, 68, 68); stroke-width: 2;">
<line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"></line>
<line class="ql-stroke" x1="15" x2="5" y1="14" y2="14"></line>
<line class="ql-stroke" x1="15" x2="9" y1="4" y2="4"></line>
</svg>`;

const Parchment = Quill.import("parchment");
const FloatStyle = new Parchment.Attributor.Style("float", "float");
const MarginStyle = new Parchment.Attributor.Style("margin", "margin");
const DisplayStyle = new Parchment.Attributor.Style("display", "display");

interface Alignment {
  icon: string;
  apply: () => void;
  isApplied: () => boolean;
}
export class Toolbar extends BaseModule {
  public toolbar!: HTMLDivElement;
  public alignments!: Alignment[];

  public onCreate = (): void => {
    // Setup Toolbar
    this.toolbar = document.createElement("div");
    Object.assign(this.toolbar.style, this.options.toolbarStyles);
    this.overlay.appendChild(this.toolbar);

    // Setup Buttons
    this.defineAlignments();
    this.addToolbarButtons();
  };

  // The toolbar and its children will be destroyed when the overlay is removed
  public onDestroy = (): void => {
    // console.log("onDestroy");
  };

  // Nothing to update on drag because we are are positioned relative to the overlay
  public onUpdate = (): void => {
    // console.log("onDestroy");
  };

  public defineAlignments = (): void => {
    this.alignments = [
      {
        icon: IconAlignLeft,
        apply: (): void => {
          this.img.setAttribute("style", "display:inline; float:left; margin: 0 1em 1em 0");
        },
        isApplied: (): boolean => FloatStyle.value(this.img) === "left"
      },
      {
        icon: IconAlignCenter,
        apply: (): void => {
          this.img.setAttribute("style", "display:block; float:inherit; margin: auto");
        },
        isApplied: (): boolean => MarginStyle.value(this.img) === "auto"
      },
      {
        icon: IconAlignRight,
        apply: (): void => {
          this.img.setAttribute("style", "display:inline; float:right; margin: 0 0 1em 1em");
        },
        isApplied: (): boolean => FloatStyle.value(this.img) === "right"
      }
    ];
  };

  public addToolbarButtons = (): void => {
    const buttons: HTMLSpanElement[] = [];
    this.alignments.forEach((alignment: Alignment, idx: number) => {
      const button = document.createElement("span");
      buttons.push(button);
      button.innerHTML = alignment.icon;

      button.addEventListener("click", () => {
        // deselect all buttons
        buttons.forEach(button => (button.style.filter = ""));
        if (alignment.isApplied()) {
          // If applied, unapply
          FloatStyle.remove(this.img);
          MarginStyle.remove(this.img);
          DisplayStyle.remove(this.img);
        } else {
          // otherwise, select button and apply
          this.selectButton(button);
          alignment.apply();
        }
        // image may change position; redraw drag handles
        this.requestUpdate();
      });

      Object.assign(button.style, this.options.toolbarButtonStyles);
      if (idx > 0) {
        button.style.borderLeftWidth = "0";
      }

      Object.assign((button.children[0] as HTMLSpanElement).style, this.options.toolbarButtonSvgStyles);
      if (alignment.isApplied()) {
        // select button if previously applied
        this.selectButton(button);
      }

      this.toolbar.appendChild(button);
    });
  };

  public selectButton = (button: HTMLSpanElement): void => {
    button.style.filter = "invert(20%)";
  };
}
