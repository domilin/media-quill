/**
 * @desc 生成uuid 全局唯一标识符（GUID，Globally Unique Identifier）也称作 UUID(Universally Unique IDentifier)
 * @method uuid()
 * */
export const uuid = (): string => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
  
  /**
   * @desc 滚动条的滚动位置
   * @returns {top,  left}
   * @method scrollOffset()
   */
  export const scrollOffset = (): { left: number; top: number } => {
    if (window.pageXOffset) {
      return {
        left: window.pageXOffset,
        top: window.pageYOffset
      };
    } else {
      const el = document.scrollingElement || document.documentElement;
      return {
        left: el.scrollLeft,
        top: el.scrollTop
      };
    }
  };
  
  /**
   * @desc 获取元素相对于文档的绝对位置和高宽/getBoundingClientRect元素相对于可视区域的位置与高宽
   * @returns {top,  left}
   * @method elementOffset()
   */
  export const elementOffset = (
    ele: HTMLElement
  ): {
    top: number;
    left: number;
    bottom: number;
    right: number;
    height: number;
    width: number;
  } => {
    return {
      top: ele.getBoundingClientRect().top + scrollOffset().top,
      left: ele.getBoundingClientRect().left + scrollOffset().left,
      bottom: ele.getBoundingClientRect().bottom + scrollOffset().top,
      right: ele.getBoundingClientRect().right + scrollOffset().left,
      height: ele.getBoundingClientRect().height,
      width: ele.getBoundingClientRect().width
    };
  };
  
  /**
   * @desc 获取鼠标相对于文档的坐标/离可视区域的用clientX+clientY
   * @returns {top,  left}
   * @method mouseOffset()
   */
  export const mouseOffset = (event: MouseEvent): { x: number; y: number } => {
    const e = event || window.event;
    const scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    const scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    return {
      x: e.pageX || e.clientX + scrollX,
      y: e.pageY || e.clientY + scrollY
    };
  };