# VS Code 扩展快速入门

[English](./vsc-extension-quickstart.md) | 中文

## 文件夹内容

- 此文件夹包含扩展所需的所有文件。
- `package.json` - 清单文件，用于声明扩展和命令。
  - 示例插件注册了一个命令，并定义了其标题和命令名称。VS Code 可以根据这些信息在命令面板中显示命令，而无需加载插件。
- `src/extension.ts` - 主文件，提供命令的实现。
  - 该文件导出一个 `activate` 函数，在扩展首次激活时调用（本例中通过执行命令触发）。在 `activate` 函数内部，我们调用 `registerCommand`。
  - 我们将包含命令实现的函数作为第二个参数传递给 `registerCommand`。

## 快速启动

- 按 `F5` 打开一个加载了扩展的新窗口。
- 通过命令面板运行命令：按 `Ctrl+Shift+P`（Mac 上为 `Cmd+Shift+P`），输入 `Hello World`。
- 在 `src/extension.ts` 中设置断点来调试扩展。
- 在调试控制台中查看扩展的输出。

## 修改代码

- 修改 `src/extension.ts` 中的代码后，可以从调试工具栏重新启动扩展。
- 也可以重新加载 VSCode 窗口（`Ctrl+R` 或 Mac 上的 `Cmd+R`）来加载更改。

## 探索 API

- 打开 `node_modules/@types/vscode/index.d.ts` 文件可以查看完整的 API 文档。

## 运行测试

- 安装 [Extension Test Runner](https://marketplace.visualstudio.com/items?itemName=ms-vscode.extension-test-runner)
- 通过 **Tasks: Run Task** 命令运行 "watch" 任务。确保该任务正在运行，否则测试可能无法被发现。
- 从活动栏打开 Testing 视图，点击 "Run Test" 按钮，或使用快捷键 `Ctrl/Cmd + ; A`
- 在 Test Results 视图中查看测试结果输出。
- 修改 `src/test/extension.test.ts` 或在 `test` 文件夹中创建新的测试文件。
  - 测试运行器只会识别匹配 `**.test.ts` 模式的文件。
  - 可以在 `test` 文件夹中创建子文件夹来组织测试结构。

## 更多资源

- [遵循 UX 指南](https://code.visualstudio.com/api/ux-guidelines/overview) 创建与 VS Code 原生界面无缝集成的扩展。
- 通过[打包扩展](https://code.visualstudio.com/api/working-with-extensions/bundling-extension)减小扩展体积并提升启动速度。
- 在 VS Code 扩展市场[发布扩展](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)。
- 设置[持续集成](https://code.visualstudio.com/api/working-with-extensions/continuous-integration)自动化构建流程。
- 集成[问题反馈](https://code.visualstudio.com/api/get-started/wrapping-up#issue-reporting)流程，获取用户提交的问题和功能请求。
