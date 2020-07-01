import { NotVoid } from "lodash";

interface InitParams {
  height?: string;
  width?: string;
}
export const videoInit: (args?: InitParams) => NotVoid;

interface PlayerParams extends InitParams {
  id: string;
}
export const videoPlayer: (args: PlayerParams) => void;

interface CreateParams {
  videoWrapper: HTMLDivElement;
  src: string;
  id: string;
}
export const videoPlayerCreate: (args: CreateParams) => void;

export default {
  videoInit,
  videoPlayerCreate,
  videoPlayer
};
