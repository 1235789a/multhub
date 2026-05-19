// ============================================================
// 🪡 interp — 极简的 {{var}} 字符串插值工具
// ============================================================
// 用例：
//   interp(t.heroStatusLine, { forging: 5, shipped: 0, total: 8 })
// 规则：
//   - 缺失的 key 保留原始 {{key}}（便于排错）
//   - 数字会自动转字符串
//   - 不做任何 HTML 转义；调用端只放纯文本变量

export function interp(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    if (Object.prototype.hasOwnProperty.call(vars, key)) {
      return String(vars[key]);
    }
    return match;
  });
}
