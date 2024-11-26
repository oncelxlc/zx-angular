import { BuilderContext, BuilderOutput, createBuilder } from "@angular-devkit/architect";
import { JsonObject } from "@angular-devkit/core";
import { promises as fs } from "fs";

interface Options extends JsonObject {
  source: string;
  destination: string;
}

/**
 * 异步函数：copyFileBuilder
 *
 * 该函数负责根据给定的选项配置，复制文件，并在构建过程中报告状态或错误
 * 主要用于构建过程中需要复制文件的场景
 *
 * @param options  包含源文件路径和目标文件路径的选项对象
 * @param context  构建器上下文，提供了报告状态和调度目标的方法
 * @returns 返回一个Promise，解析为构建输出对象
 */
async function copyFileBuilder(options: Options, context: BuilderContext): Promise<BuilderOutput> {
  // 报告文件复制过程的状态信息
  context.reportStatus(`Copying ${ options.source } to ${ options.destination }.`);
  try {
    // 异步复制文件，如果发生错误则会抛出异常
    await fs.copyFile(options.source, options.destination);
  } catch (err) {
    // 日志记录文件复制失败的信息
    context.logger.error("Failed to copy file.");
    // 返回构建输出，表示复制文件失败
    return {
      success: false,
      error: err.message,
    };
  }
  // 调度下一次构建目标，并返回调度结果的Promise
  return context.scheduleTarget({
    project: "zx-ng",
    target: "serve",
    configuration: "development",
  }).then();
}

export default createBuilder(copyFileBuilder);
