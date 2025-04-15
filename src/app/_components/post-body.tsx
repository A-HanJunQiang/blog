"use client";

import markdownStyles from "./markdown-styles.module.css";
import { useEffect } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/github-dark.css'; // 添加暗色主题

type Props = {
  content: string;
};

export function PostBody({ content }: Props) {
  useEffect(() => {
    // 检测当前是否为暗色模式
    const isDark = document.documentElement.classList.contains('dark');
    
    // 高亮所有代码块并应用对应主题
    document.querySelectorAll('pre code').forEach((block) => {
      if (isDark) {
        block.classList.add('github-dark');
        block.classList.remove('github');
      } else {
        block.classList.add('github');
        block.classList.remove('github-dark');
      }
      hljs.highlightElement(block as HTMLElement);
    });
  }, [content]);

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={markdownStyles["markdown"]}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
