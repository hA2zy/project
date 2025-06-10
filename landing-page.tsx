"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

interface LandingPageProps {
  onStartDiary: () => void
}

export default function LandingPage({ onStartDiary }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image src="/logo.svg" alt="EMO Logo" width={100} height={36} priority />
        </div>
        {/* 오른쪽 위 로그인 텍스트 삭제 */}
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center space-y-8">
          {/* Main Message */}
          <h1 className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed">
            일기를 작성하여 AI로 감정을 분석해보세요
          </h1>

          {/* CTA Button */}
          <Button
            onClick={onStartDiary}
            className="px-12 py-4 bg-orange-300 hover:bg-orange-400 text-gray-800 font-medium rounded-full border-0 text-lg"
          >
            일기 쓰러가기
          </Button>
        </div>
      </div>
    </div>
  )
}
