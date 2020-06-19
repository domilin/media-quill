import { BaseModule } from "./BaseModule";

export class DisplaySize extends BaseModule {
  public display!: HTMLDivElement;

  public onCreate = (): void => {
    // Create the container to hold the size display
    this.display = document.createElement("div");

    // Apply styles
    Object.assign(this.display.style, this.options.displayStyles);

    // Attach it
    this.overlay.appendChild(this.display);
  };

  public onDestroy = (): void => {
    // console.log("onDestroy");
  };

  public onUpdate = (): void => {
    if (!this.display || !this.img) {
      return;
    }

    const size = this.getCurrentSize();
    this.display.innerHTML = size.join(" &times; ");
    if (size[0] > 120 && size[1] > 30) {
      // position on top of image
      Object.assign(this.display.style, {
        right: "4px",
        bottom: "4px",
        left: "auto"
      });
    } else if (this.img.style.float === "right") {
      // position off bottom left
      const dispRect = this.display.getBoundingClientRect();
      Object.assign(this.display.style, {
        right: "auto",
        bottom: `-${dispRect.height + 4}px`,
        left: `-${dispRect.width + 4}px`
      });
    } else {
      // position off bottom right
      const dispRect = this.display.getBoundingClientRect();
      Object.assign(this.display.style, {
        right: `-${dispRect.width + 4}px`,
        bottom: `-${dispRect.height + 4}px`,
        left: "auto"
      });
    }
  };

  public getCurrentSize = (): number[] => {
    return [this.img.width, Math.round((this.img.width / this.img.naturalWidth) * this.img.naturalHeight)];
  };
}
