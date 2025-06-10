"use client"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, Edit, User, ArrowLeft } from "lucide-react"
import Image from "next/image"

interface DiaryEntry {
  date: string
  content: string
  emotion: string
  emoji: string
  emotionImage: string
}

interface MyPageProps {
  onBackToDashboard: () => void
  onLogout: () => void
  diaryEntries: { [key: string]: DiaryEntry }
}

export default function MyPage({ onBackToDashboard, onLogout, diaryEntries }: MyPageProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("2025년 6월")

  // 선택된 기간을 년도와 월로 파싱
  const parseSelectedPeriod = (period: string) => {
    const match = period.match(/(\d{4})년 (\d{1,2})월/)
    if (match) {
      const year = Number.parseInt(match[1])
      const month = Number.parseInt(match[2]) - 1 // JavaScript Date는 0부터 시작
      return { year, month }
    }
    return { year: 2025, month: 5 } // 기본값: 2025년 6월
  }

  // 실제 일기 데이터를 기반으로 감정 통계 계산
  const calculateEmotionStats = () => {
    const { year, month } = parseSelectedPeriod(selectedPeriod)

    const emotionCounts: { [key: string]: number } = {
      기쁨: 0,
      슬픔: 0,
      화남: 0,
      놀람: 0,
      두려움: 0,
      혐오: 0,
      중립: 0,
    }

    // 선택된 기간에 해당하는 일기들만 필터링
    const filteredEntries = Object.values(diaryEntries).filter((entry) => {
      const entryDate = new Date(entry.date)
      return entryDate.getFullYear() === year && entryDate.getMonth() === month
    })

    // 감정별 카운트
    filteredEntries.forEach((entry) => {
      if (emotionCounts.hasOwnProperty(entry.emotion)) {
        emotionCounts[entry.emotion]++
      }
    })

    // 총 일기 수
    const totalEntries = filteredEntries.length

    // 백분율로 변환 (최대 100으로 정규화)
    const maxCount = Math.max(...Object.values(emotionCounts))
    const emotionStats: { [key: string]: number } = {}

    Object.keys(emotionCounts).forEach((emotion) => {
      if (totalEntries > 0) {
        emotionStats[emotion] = maxCount > 0 ? (emotionCounts[emotion] / maxCount) * 100 : 0
      } else {
        emotionStats[emotion] = 0
      }
    })

    return { emotionStats, emotionCounts, totalEntries, filteredEntries }
  }

  const { emotionStats, emotionCounts, totalEntries, filteredEntries } = calculateEmotionStats()

  // 가장 많은 감정 찾기
  const getMostFrequentEmotion = () => {
    if (totalEntries === 0) return null

    const maxCount = Math.max(...Object.values(emotionCounts))
    const mostFrequentEmotion = Object.keys(emotionCounts).find((emotion) => emotionCounts[emotion] === maxCount)

    return mostFrequentEmotion && maxCount > 0 ? mostFrequentEmotion : null
  }

  const mostFrequentEmotion = getMostFrequentEmotion()

  // 감정별 이미지 매핑
  const getEmotionImage = (emotion: string): string => {
    const emotionImageMap: { [key: string]: string } = {
      기쁨: "/emotions/행복.png",
      슬픔: "/emotions/슬픔.png",
      화남: "/emotions/분노.png",
      놀람: "/emotions/놀람.png",
      두려움: "/emotions/공포.png",
      혐오: "/emotions/혐오.png",
      중립: "/emotions/중립.png",
    }
    return emotionImageMap[emotion] || "/emotions/중립.png"
  }

  // 표시할 감정들 (가장 많은 감정을 첫 번째로, 나머지는 카운트 순으로)
  const getDisplayEmotions = () => {
    const emotions = Object.keys(emotionCounts)
      .filter((emotion) => emotionCounts[emotion] > 0)
      .sort((a, b) => emotionCounts[b] - emotionCounts[a])

    // 최대 4개까지만 표시
    return emotions.slice(0, 4)
  }

  const displayEmotions = getDisplayEmotions()

  // 감정별 색상 매핑
  const getEmotionColor = (emotion: string): string => {
    const colorMap: { [key: string]: string } = {
      기쁨: "text-yellow-500",
      슬픔: "text-blue-500",
      화남: "text-red-500",
      놀람: "text-purple-500",
      두려움: "text-gray-600",
      혐오: "text-green-600",
      중립: "text-gray-500",
    }
    return colorMap[emotion] || "text-gray-500"
  }

  // 월별 메시지 생성
  const getMonthlyMessage = () => {
    const { year, month } = parseSelectedPeriod(selectedPeriod)
    const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

    if (totalEntries === 0) {
      return `${year}년 ${monthNames[month]}에는 아직 작성된 일기가 없습니다.`
    }

    const monthName = monthNames[month]

    if (mostFrequentEmotion) {
      const emotionMessages: { [key: string]: string } = {
        기쁨: `${monthName}은 행복한 순간들이 많았던 달이네요! 😊`,
        슬픔: `${monthName}은 조금 힘든 시간들이 있었던 것 같아요. 💙`,
        화남: `${monthName}은 스트레스가 많았던 달이었나 보네요. 😤`,
        놀람: `${monthName}은 예상치 못한 일들이 많았던 달이었네요! 😲`,
        두려움: `${monthName}은 걱정이 많았던 달이었군요. 💪`,
        혐오: `${monthName}은 불쾌한 일들이 있었던 달이었네요. 🌈`,
        중립: `${monthName}은 평온하고 안정적인 달이었네요. 🕊️`,
      }

      return emotionMessages[mostFrequentEmotion] || `${monthName}의 감정을 분석해보세요.`
    }

    return `${monthName}의 감정 기록을 확인해보세요.`
  }

  // 레이더 차트를 위한 좌표 계산
  const getRadarPoints = (data: { [key: string]: number }, radius = 100) => {
    const emotions = Object.keys(data)
    const values = Object.values(data)
    const angleStep = (2 * Math.PI) / emotions.length

    return values
      .map((value, index) => {
        const angle = angleStep * index - Math.PI / 2 // -90도에서 시작
        const normalizedValue = (value / 100) * radius
        const x = 200 + normalizedValue * Math.cos(angle)
        const y = 200 + normalizedValue * Math.sin(angle)
        return `${x},${y}`
      })
      .join(" ")
  }

  // 축 라인을 위한 좌표 계산
  const getAxisLines = (radius = 120) => {
    const emotions = Object.keys(emotionStats)
    const angleStep = (2 * Math.PI) / emotions.length

    return emotions.map((emotion, index) => {
      const angle = angleStep * index - Math.PI / 2
      const x = 200 + radius * Math.cos(angle)
      const y = 200 + radius * Math.sin(angle)
      return { emotion, x, y, angle }
    })
  }

  const axisLines = getAxisLines()
  const dataPoints = getRadarPoints(emotionStats, 100)
  const backgroundPoints = getRadarPoints(
    Object.keys(emotionStats).reduce((acc, key) => ({ ...acc, [key]: 100 }), {}),
    120,
  )

  // 감정 다양성 계산
  const getEmotionDiversity = () => {
    const activeEmotions = Object.values(emotionCounts).filter((count) => count > 0).length
    return activeEmotions
  }

  const emotionDiversity = getEmotionDiversity()

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={onBackToDashboard} className="text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button onClick={onBackToDashboard} className="flex items-center hover:opacity-80 transition-opacity">
            <Image src="/logo.svg" alt="EMO Logo" width={100} height={36} priority />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <Edit className="w-5 h-5 text-gray-600 cursor-pointer" />
          <User className="w-5 h-5 text-gray-600 cursor-pointer" onClick={onLogout} />
        </div>
      </div>

      <div className="p-8 flex space-x-12">
        {/* Left Section */}
        <div className="flex-1 space-y-8">
          {/* Profile Section */}
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-orange-300 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                안녕하세요, <span className="text-orange-400">남궁윤교</span>님!! 👋
              </h2>
              <p className="text-gray-600 mt-2">{getMonthlyMessage()}</p>
            </div>
          </div>

          {/* Emotion Status Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">어떤 감정 상태죠?</h3>
            {totalEntries > 0 ? (
              <div className="flex space-x-8 items-end">
                {displayEmotions.map((emotion, index) => {
                  const isMostFrequent = emotion === mostFrequentEmotion
                  const size = isMostFrequent ? "w-16 h-16" : "w-12 h-12"

                  return (
                    <div key={index} className="text-center">
                      <div className={`relative ${size} mb-2 mx-auto`}>
                        <Image
                          src={getEmotionImage(emotion) || "/placeholder.svg"}
                          alt={emotion}
                          fill
                          sizes={isMostFrequent ? "64px" : "48px"}
                          className="object-contain"
                        />
                      </div>
                      <p className={`text-sm font-medium ${getEmotionColor(emotion)}`}>{emotion}</p>
                      <p className="text-xs text-gray-500">{emotionCounts[emotion]}회</p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">선택한 기간에 작성된 일기가 없습니다.</p>
                <p className="text-sm text-gray-400 mt-2">일기를 작성하면 감정 통계를 확인할 수 있어요!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Chart */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              <span className="text-orange-400">남궁윤교</span>님의 상태를 확인해 보세요
            </h2>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40 border-gray-300">
                <SelectValue />
                <ChevronDown className="w-4 h-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025년 6월">2025년 6월</SelectItem>
                <SelectItem value="2025년 5월">2025년 5월</SelectItem>
                <SelectItem value="2025년 4월">2025년 4월</SelectItem>
                <SelectItem value="2025년 3월">2025년 3월</SelectItem>
                <SelectItem value="2025년 2월">2025년 2월</SelectItem>
                <SelectItem value="2025년 1월">2025년 1월</SelectItem>
                <SelectItem value="2024년 12월">2024년 12월</SelectItem>
                <SelectItem value="2024년 11월">2024년 11월</SelectItem>
                <SelectItem value="2024년 10월">2024년 10월</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Radar Chart */}
          <div className="flex justify-center">
            <div className="relative">
              {totalEntries > 0 ? (
                <svg width="400" height="400" viewBox="0 0 400 400">
                  {/* Background hexagon */}
                  <polygon points={backgroundPoints} fill="none" stroke="#e5e7eb" strokeWidth="2" opacity="0.5" />

                  {/* Inner grid lines */}
                  {[0.2, 0.4, 0.6, 0.8].map((scale, index) => (
                    <polygon
                      key={index}
                      points={getRadarPoints(
                        Object.keys(emotionStats).reduce((acc, key) => ({ ...acc, [key]: 100 * scale }), {}),
                        120,
                      )}
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      opacity="0.3"
                    />
                  ))}

                  {/* Axis lines */}
                  {axisLines.map((axis, index) => (
                    <line
                      key={index}
                      x1="200"
                      y1="200"
                      x2={axis.x}
                      y2={axis.y}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      opacity="0.5"
                    />
                  ))}

                  {/* Data polygon */}
                  <polygon points={dataPoints} fill="rgba(251, 146, 60, 0.2)" stroke="#fb923c" strokeWidth="3" />

                  {/* Data points */}
                  {Object.entries(emotionStats).map(([emotion, value], index) => {
                    const angleStep = (2 * Math.PI) / Object.keys(emotionStats).length
                    const angle = angleStep * index - Math.PI / 2
                    const normalizedValue = (value / 100) * 100
                    const x = 200 + normalizedValue * Math.cos(angle)
                    const y = 200 + normalizedValue * Math.sin(angle)

                    return <circle key={emotion} cx={x} cy={y} r="4" fill="#fb923c" stroke="white" strokeWidth="2" />
                  })}

                  {/* Labels */}
                  {axisLines.map((axis, index) => (
                    <text
                      key={index}
                      x={axis.x + (axis.x > 200 ? 10 : axis.x < 200 ? -10 : 0)}
                      y={axis.y + (axis.y > 200 ? 15 : axis.y < 200 ? -5 : 0)}
                      textAnchor={axis.x > 200 ? "start" : axis.x < 200 ? "end" : "middle"}
                      className="text-sm fill-gray-600 font-medium"
                    >
                      {axis.emotion}
                    </text>
                  ))}
                </svg>
              ) : (
                <div className="w-96 h-96 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-gray-500 mb-2">선택한 기간에 데이터가 없습니다</p>
                    <p className="text-sm text-gray-400">일기를 작성하면 차트가 나타납니다</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 통계 요약 */}
          {totalEntries > 0 && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-medium text-gray-800 mb-3">{selectedPeriod} 통계</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">총 일기 수:</span>
                  <span className="font-medium ml-2">{totalEntries}개</span>
                </div>
                <div>
                  <span className="text-gray-600">주요 감정:</span>
                  <span className="font-medium ml-2 text-orange-400">{mostFrequentEmotion || "없음"}</span>
                </div>
                <div>
                  <span className="text-gray-600">감정 다양성:</span>
                  <span className="font-medium ml-2">{emotionDiversity}가지</span>
                </div>
                <div>
                  <span className="text-gray-600">평균 일기/주:</span>
                  <span className="font-medium ml-2">{Math.round((totalEntries / 4) * 10) / 10}개</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
