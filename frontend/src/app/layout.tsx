import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: '小微书',
  description: '你的第一个 Web 应用',
  keywords: ['阅读', '创作', '文章', '博客'],
  authors: [{ name: '小微书团队' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen`}>
        <div id="app-root" className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
