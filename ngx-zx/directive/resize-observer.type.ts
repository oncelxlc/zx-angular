/**
 * ResizeObserver types for ngx-zx
 */
export interface SizeData {
  width: number;
  height: number;
  contentWidth: number;
  contentHeight: number;
}

/**
 * ResizeObserver state management
 */
export interface ResizeState {
  isResizing: boolean;
  startTime: number;
  changeCount: number;
}
