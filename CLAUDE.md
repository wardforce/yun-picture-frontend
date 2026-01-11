<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

## 项目常见问题解决方案

### Windows 端口 EACCES permission denied 错误
首选方案：依次执行 `net stop winnat` 和 `net start winnat` 重置 NAT 驱动释放端口。

若无效，再排查：
1. `netstat -ano | findstr :端口号` 检查端口占用并结束占用进程
2. `netsh interface ipv4 show excludedportrange protocol=tcp` 检查 Hyper-V 端口保留
3. 以管理员权限运行终端