import { BuilderContext, BuilderOutput, createBuilder } from "@angular-devkit/architect";
import { JsonObject } from "@angular-devkit/core";
import * as chokidar from "chokidar";
import * as path from "path";

/**
 * 构建过程的配置选项
 */
interface Options extends JsonObject {
  /**
   * 需要监听的文件夹
   */
  watchFolder: string;
  /**
   * 需要忽略的文件或文件夹
   */
  ignored: string[];
}

/**
 * 异步函数用于构建文件复制流程
 * 该函数设置文件监听器，以根据给定的选项和上下文环境来复制文件
 *
 * @param options - 构建过程的配置选项，包括监听文件夹等
 * @param context - 构建上下文，包含工作区根路径、日志记录器等
 * @returns 返回一个Promise，表示构建过程的输出结果
 */
async function copyFileBuilder(options: Options, context: BuilderContext): Promise<BuilderOutput> {
  return new Promise<BuilderOutput>((resolve, reject) => {
    try {
      // 获取工作区的根路径
      const workspaceRoot = context.workspaceRoot;
      // 计算完整的监听路径
      const fullWatchPath = path.resolve(workspaceRoot, options.watchFolder);

      // 初始化文件监听器
      const watcher = chokidar.watch(fullWatchPath, {
        ignored: options.ignored || [/(^|[\/\\])\../, /node_modules/], // 默认忽略隐藏文件和 node_modules
        persistent: true,
        ignoreInitial: false,
      });

      // 当监听器准备就绪时触发
      watcher.on("ready", () => {
        context.logger.info(`开始监听文件夹: ${ fullWatchPath }`);
      });

      // 当文件发生变化时触发
      watcher.on("change", (filePath: any) => {
        context.logger.info(`文件已修改: ${ filePath }`);
        // todo: 在这里添加你想要执行的操作，比如触发重新构建
      });

      // 当新文件被添加时触发
      watcher.on("add", (filePath: any) => {
        context.logger.info(`新文件已添加: ${ filePath }`);
        // todo: 处理新文件添加的逻辑
      });

      // 当文件被删除时触发
      watcher.on("unlink", (filePath: any) => {
        context.logger.info(`文件已删除: ${ filePath }`);
        // todo: 处理文件删除的逻辑
      });

      // 当监听过程中发生错误时触发
      watcher.on("error", (error: { message: any; }) => {
        context.logger.error(`文件监听错误: ${ error }`);
        reject({success: false, error: error.message});
      });

      // 报告构建正在运行
      context.reportRunning();
      // 报告当前状态为监听文件中
      context.reportStatus("监听文件中...");

      // 调度构建目标
      const serve = context.scheduleTarget({
        project: "zx-ng",
        target: "serve",
        configuration: "development",
      }).then((res) => {
        console.log(res);
      });

      // 返回一个函数，用于清理资源和解析Promise
      return () => {
        watcher.close();
        resolve(serve.then());
      };
    } catch (err) {
      // 错误处理
      context.logger.error(err);
      return {
        success: false,
        error: err.message,
      };
    }
  });
}

export default createBuilder(copyFileBuilder);
