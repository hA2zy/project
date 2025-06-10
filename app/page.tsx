"use client"

import { useState, useEffect } from "react"
import LandingPage from "../landing-page"
import LoginPage from "../login-page"
import MainDashboard from "../main-dashboard"

export default function Page() {
  const [currentPage, setCurrentPage] = useState<"landing" | "login" | "dashboard">("landing")
  const [isLoading, setIsLoading] = useState(true)

  // 페이지 로드 시 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      try {
        const isLoggedIn = localStorage.getItem("isLoggedIn")
        const currentUser = localStorage.getItem("currentUser")

        if (isLoggedIn === "true" && currentUser) {
          setCurrentPage("dashboard")
        } else {
          setCurrentPage("landing")
        }
      } catch (error) {
        console.error("로그인 상태 확인 중 오류:", error)
        setCurrentPage("landing")
      } finally {
        setIsLoading(false)
      }
    }

    checkLoginStatus()
  }, [])

  const handleStartDiary = () => {
    setCurrentPage("login")
  }

  const handleBackToLanding = () => {
    setCurrentPage("landing")
  }

  const handleLoginSuccess = (username: string) => {
    try {
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("currentUser", username)
      setCurrentPage("dashboard")
    } catch (error) {
      console.error("로그인 정보 저장 중 오류:", error)
    }
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("currentUser")
      setCurrentPage("landing")
    } catch (error) {
      console.error("로그아웃 중 오류:", error)
    }
  }

  // 로딩 중일 때 표시할 화면
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (currentPage === "login") {
    return <LoginPage onBackToLanding={handleBackToLanding} onLoginSuccess={handleLoginSuccess} />
  }

  if (currentPage === "dashboard") {
    return <MainDashboard onLogout={handleLogout} />
  }

  return <LandingPage onStartDiary={handleStartDiary} />
}
