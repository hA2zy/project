"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, Edit, User } from "lucide-react"
import MyPage from "./my-page"
import Image from "next/image"

interface DiaryEntry {
  date: string
  content: string
  emotion: string
  emoji: string
  emotionImage: string
}

interface MainDashboardProps {
  onLogout: () => void
}

export default function MainDashboard({ onLogout }: MainDashboardProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1)) // 2025년 6월 (0부터 시작하므로 5가 6월)
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [diaryText, setDiaryText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [diaryEntries, setDiaryEntries] = useState<{ [key: string]: DiaryEntry }>({})
  const [viewMode, setViewMode] = useState<"write" | "view">("write")
  const [currentPage, setCurrentPage] = useState<"dashboard" | "mypage">("dashboard")
  const [currentUser, setCurrentUser] = useState<string>("")

  // 컴포넌트 마운트 시 저장된 데이터 불러오기
  useEffect(() => {
    try {
      // 현재 사용자 정보 가져오기
      const user = localStorage.getItem("currentUser")
      if (user) {
        setCurrentUser(user)

        // 사용자별 일기 데이터 불러오기
        const savedDiaries = localStorage.getItem(`diaryEntries_${user}`)
        if (savedDiaries) {
          const parsedDiaries = JSON.parse(savedDiaries)
          setDiaryEntries(parsedDiaries)
        }
      }
    } catch (error) {
      console.error("저장된 데이터 불러오기 중 오류:", error)
    }
  }, [])

  // 일기 데이터가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (currentUser && Object.keys(diaryEntries).length > 0) {
      try {
        localStorage.setItem(`diaryEntries_${currentUser}`, JSON.stringify(diaryEntries))
      } catch (error) {
        console.error("일기 데이터 저장 중 오류:", error)
      }
    }
  }, [diaryEntries, currentUser])

  // 오늘 날짜 (실제 현재 날짜)
  const today = new Date()
  const todayYear = today.getFullYear()
  const todayMonth = today.getMonth()
  const todayDate = today.getDate()

  const getDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const getEmotionData = (emotion: string): { emoji: string; imagePath: string } => {
    const emotionMap: { [key: string]: { emoji: string; imagePath: string } } = {
      기쁨: { emoji: "😊", imagePath: "/emotions/행복.png" },
      슬픔: { emoji: "😢", imagePath: "/emotions/슬픔.png" },
      화남: { emoji: "😠", imagePath: "/emotions/분노.png" },
      놀람: { emoji: "😲", imagePath: "/emotions/놀람.png" },
      두려움: { emoji: "😨", imagePath: "/emotions/공포.png" },
      혐오: { emoji: "🤢", imagePath: "/emotions/혐오.png" },
      중립: { emoji: "😐", imagePath: "/emotions/중립.png" },
    }
    return emotionMap[emotion] || { emoji: "😊", imagePath: "/emotions/중립.png" }
  }

  const analyzeEmotion = (text: string): { emotion: string; emoji: string; emotionImage: string } => {
    // 간단한 감정 분석 로직 (실제로는 AI API를 사용)
    const sadWords = ["슬프", "우울", "힘들", "아프", "괴로", "별로", "안좋"]
    const happyWords = ["기쁘", "좋", "행복", "즐거", "신나", "최고", "완벽"]
    const angryWords = ["화나", "짜증", "분노", "열받", "빡쳐"]
    const fearWords = ["무섭", "두렵", "공포", "걱정"]
    const surpriseWords = ["놀라", "깜짝", "예상치 못한", "갑자기"]
    const disgustWords = ["역겹", "구역", "더럽", "혐오"]

    const lowerText = text.toLowerCase()

    let emotion = "중립"

    if (sadWords.some((word) => lowerText.includes(word))) {
      emotion = "슬픔"
    } else if (happyWords.some((word) => lowerText.includes(word))) {
      emotion = "기쁨"
    } else if (angryWords.some((word) => lowerText.includes(word))) {
      emotion = "화남"
    } else if (fearWords.some((word) => lowerText.includes(word))) {
      emotion = "두려움"
    } else if (surpriseWords.some((word) => lowerText.includes(word))) {
      emotion = "놀람"
    } else if (disgustWords.some((word) => lowerText.includes(word))) {
      emotion = "혐오"
    }

    const { emoji, imagePath } = getEmotionData(emotion)
    return { emotion, emoji, emotionImage: imagePath }
  }

  const getEmotionFeedback = (emotion: string): string => {
    const feedbackMap: { [key: string]: string } = {
      기쁨: "오늘 정말 행복한 하루를 보내셨네요! 😊 이런 긍정적인 에너지가 계속 이어지길 바라요. 기쁜 순간들을 더 많이 만들어가시길 응원합니다! 내일도 웃음 가득한 하루가 되시길 바라요! ✨",
      슬픔: "힘든 하루였군요. 😢 슬픈 감정도 소중한 감정 중 하나예요. 충분히 느끼고 표현하는 것이 중요해요. 내일은 조금 더 나은 하루가 되길 바라며, 언제든 힘이 필요하시면 주변 사람들에게 도움을 요청하세요. 당신은 혼자가 아니에요. 💙",
      화남: "오늘 화가 나는 일이 있으셨나 보네요. 😠 화난 감정을 일기로 표현하신 것만으로도 훌륭해요. 깊게 숨을 들이쉬고 내쉬며 마음을 진정시켜보세요. 화는 일시적인 감정이니까요. 내일은 더 평온한 마음으로 시작하실 수 있을 거예요! 🌱",
      놀람: "예상치 못한 일들이 많았던 하루였나 보네요! 😲 놀라운 일들이 때로는 새로운 기회가 되기도 해요. 변화와 예상치 못한 상황들을 긍정적으로 받아들이시는 모습이 멋져요. 앞으로도 열린 마음으로 새로운 경험들을 맞이하세요! 🌟",
      두려움:
        "무서운 일이나 걱정되는 일이 있으셨군요. 😨 두려움을 느끼는 것은 자연스러운 일이에요. 용기란 두려움이 없는 것이 아니라 두려움을 느끼면서도 앞으로 나아가는 것이죠. 한 걸음씩 천천히 나아가시면 돼요. 당신은 생각보다 강한 사람이에요! 💪",
      혐오: "불쾌한 일이 있으셨나 보네요. 🤢 이런 감정도 우리가 느낄 수 있는 자연스러운 감정이에요. 부정적인 감정을 일기로 표현하신 것이 좋은 방법이었어요. 이런 감정들을 건강하게 처리하고 넘어가시길 바라요. 내일은 더 좋은 일들이 기다리고 있을 거예요! 🌈",
      중립: "평온한 하루를 보내셨네요. 😐 때로는 잔잔하고 평온한 날들도 필요해요. 큰 감정의 기복 없이 안정적인 하루를 보내신 것도 의미가 있어요. 이런 평온함 속에서 자신을 돌아보고 내일을 준비하는 시간을 가져보세요. 🕊️",
    }
    return (
      feedbackMap[emotion] ||
      "오늘도 일기를 작성해주셔서 감사해요. 매일 자신의 감정을 기록하는 것은 정말 소중한 습관이에요! 💝"
    )
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const monthNames = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ]

  // 일요일부터 시작하도록 변경
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    setSelectedDate(null)
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    setSelectedDate(null)
  }

  const handleDateClick = (day: number) => {
    setSelectedDate(day)
    const dateKey = getDateKey(currentDate.getFullYear(), currentDate.getMonth(), day)
    const existingEntry = diaryEntries[dateKey]

    if (existingEntry) {
      // 기존 일기가 있으면 보기 모드
      setViewMode("view")
      setDiaryText(existingEntry.content)
    } else {
      // 새로운 일기 작성 모드
      setViewMode("write")
      setDiaryText("")
    }
  }

  const handleRecord = async () => {
    if (!diaryText.trim() || !selectedDate) return

    setIsAnalyzing(true)

    // AI 분석 시뮬레이션
    setTimeout(() => {
      const analysis = analyzeEmotion(diaryText)
      const dateKey = getDateKey(currentDate.getFullYear(), currentDate.getMonth(), selectedDate)

      const newEntry: DiaryEntry = {
        date: dateKey,
        content: diaryText,
        emotion: analysis.emotion,
        emoji: analysis.emoji,
        emotionImage: analysis.emotionImage,
      }

      setDiaryEntries((prev) => ({
        ...prev,
        [dateKey]: newEntry,
      }))

      setViewMode("view")
      setIsAnalyzing(false)
    }, 2000)
  }

  const handleEditDiary = () => {
    setViewMode("write")
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // 현재 표시 중인 달력의 연도와 월
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()

    // 빈 칸 추가 (월 시작 전)
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-12 h-12"></div>)
    }

    // 날짜 추가
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = getDateKey(currentYear, currentMonth, day)
      const entry = diaryEntries[dateKey]
      const isSelected = selectedDate === day

      // 오늘 날짜인지 확인
      const isToday = currentYear === todayYear && currentMonth === todayMonth && day === todayDate

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all border-2 relative
            ${
              isSelected
                ? "ring-2 ring-orange-400 bg-orange-100 border-orange-400"
                : isToday
                  ? "border-orange-500 bg-orange-50"
                  : entry
                    ? "border-orange-300 hover:bg-orange-50"
                    : "border-gray-300 hover:bg-gray-50"
            }`}
        >
          {entry ? (
            <div className="relative w-8 h-8">
              <Image
                src={entry.emotionImage || "/placeholder.svg"}
                alt={entry.emotion}
                fill
                sizes="32px"
                className="object-contain"
              />
            </div>
          ) : (
            <span className={`font-medium ${isToday ? "text-orange-600" : "text-gray-700"}`}>{day}</span>
          )}

          {/* 오늘 날짜 표시 (점) */}
          {isToday && !entry && (
            <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
            </div>
          )}

          {/* 오늘 날짜 표시 (테두리) - 일기가 있는 경우 */}
          {isToday && entry && <div className="absolute inset-0 rounded-full border-2 border-orange-500"></div>}
        </button>,
      )
    }

    return days
  }

  const handleGoToMyPage = () => {
    setCurrentPage("mypage")
  }

  const handleBackToDashboard = () => {
    setCurrentPage("dashboard")
  }

  const handleLogoutWithConfirm = () => {
    if (window.confirm("정말 로그아웃하시겠습니까?")) {
      onLogout()
    }
  }

  if (currentPage === "mypage") {
    return (
      <MyPage
        onBackToDashboard={handleBackToDashboard}
        onLogout={handleLogoutWithConfirm}
        diaryEntries={diaryEntries}
      />
    )
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Image src="/logo.svg" alt="EMO Logo" width={120} height={43} priority />
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Edit className="w-5 h-5 text-gray-600" />
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <p className="text-xl text-gray-800 mt-8">AI가 분석 중입니다.</p>
        </div>
      </div>
    )
  }

  const selectedDateKey = selectedDate
    ? getDateKey(currentDate.getFullYear(), currentDate.getMonth(), selectedDate)
    : null
  const selectedEntry = selectedDateKey ? diaryEntries[selectedDateKey] : null

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image src="/logo.svg" alt="EMO Logo" width={100} height={36} priority />
          {currentUser && (
            <span className="ml-4 text-sm text-gray-600">
              안녕하세요, <span className="font-medium text-orange-400">남궁윤교</span>님!
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <Edit className="w-5 h-5 text-gray-600 cursor-pointer" />
          <User className="w-5 h-5 text-gray-600 cursor-pointer" onClick={handleGoToMyPage} />
        </div>
      </div>

      <div className="p-8 flex space-x-8">
        {/* Calendar Section */}
        <div className="flex-1 max-w-md">
          <div className="bg-orange-300 rounded-t-lg p-4 flex items-center justify-between">
            <button onClick={handlePrevMonth}>
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <span className="text-gray-700 font-medium">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button onClick={handleNextMonth}>
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          <div className="bg-orange-100 p-4">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-sm text-gray-600 font-medium">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>

            {/* 오늘 날짜 표시 범례 */}
            <div className="mt-4 flex items-center justify-end">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-50 border-2 border-orange-500 rounded-full mr-2"></div>
                <span className="text-xs text-gray-600">오늘</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 space-y-6">
          {selectedDate && viewMode === "write" && !selectedEntry ? (
            // 새 일기 작성 모드
            <div className="space-y-4">
              <div className="bg-orange-300 rounded-lg p-4">
                <h2 className="text-lg font-medium text-gray-800">
                  {currentDate.getFullYear()}.{String(currentDate.getMonth() + 1).padStart(2, "0")}.
                  {String(selectedDate).padStart(2, "0")}
                </h2>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600">어떤 하루 보내셨나요?</p>

                <Textarea
                  value={diaryText}
                  onChange={(e) => setDiaryText(e.target.value)}
                  placeholder="오늘의 일기를 작성해주세요..."
                  className="min-h-32 resize-none border-2 border-orange-300 focus:border-orange-400 rounded-lg"
                />

                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-2">
                    {diaryText.length > 0 ? `${Math.max(0, 99 - diaryText.length)}자 남음` : ""}
                  </p>
                  <Button
                    onClick={handleRecord}
                    disabled={!diaryText.trim()}
                    className="bg-orange-300 hover:bg-orange-400 text-gray-800 font-medium rounded-full px-8"
                  >
                    기록하기
                  </Button>
                </div>
              </div>
            </div>
          ) : selectedDate && viewMode === "write" && selectedEntry ? (
            // 기존 일기 수정 모드
            <div className="space-y-4">
              <div className="bg-orange-300 rounded-lg p-4">
                <h2 className="text-lg font-medium text-gray-800">
                  {currentDate.getFullYear()}.{String(currentDate.getMonth() + 1).padStart(2, "0")}.
                  {String(selectedDate).padStart(2, "0")}
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600">일기 수정하기</p>

                <Textarea
                  value={diaryText}
                  onChange={(e) => setDiaryText(e.target.value)}
                  placeholder="일기를 수정해주세요..."
                  className="min-h-32 resize-none border-2 border-orange-300 focus:border-orange-400 rounded-lg"
                />

                <div className="flex justify-between items-center">
                  <Button
                    onClick={() => setViewMode("view")}
                    variant="outline"
                    className="border-orange-300 text-gray-700 hover:bg-orange-50"
                  >
                    취소
                  </Button>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-2">
                      {diaryText.length > 0 ? `${Math.max(0, 99 - diaryText.length)}자 남음` : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : selectedDate && viewMode === "view" && selectedEntry ? (
            // 기존 일기 보기 모드
            <div className="space-y-6">
              <div className="bg-orange-300 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {currentDate.getFullYear()}.{String(currentDate.getMonth() + 1).padStart(2, "0")}.
                    {String(selectedDate).padStart(2, "0")}의 일기
                  </h2>
                  {/* <Button
                    onClick={handleEditDiary}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-700 hover:bg-gray-50"
                  >
                    수정
                  </Button> */}
                </div>
                <p className="text-gray-700 leading-relaxed">{selectedEntry.content}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">
                      오늘의 <span className="text-orange-400">감정</span>
                    </h3>
                    <div className="relative w-10 h-10">
                      <Image
                        src={selectedEntry.emotionImage || "/placeholder.svg"}
                        alt={selectedEntry.emotion}
                        fill
                        sizes="40px"
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <p className="text-gray-700">
                    남궁윤교님의 감정 상태는{" "}
                    <span className="text-orange-400 font-medium">{selectedEntry.emotion}</span>
                    으로 보입니다.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-bold mb-4">
                    오늘의 <span className="text-orange-400">피드백</span>
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{getEmotionFeedback(selectedEntry.emotion)}</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
