"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import SignupPage from "./signup-page"
import Image from "next/image"

interface LoginPageProps {
  onBackToLanding?: () => void
  onLoginSuccess?: (username: string) => void
}

export default function LoginPage({ onBackToLanding, onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({
    username: false,
    password: false,
    passwordKorean: false,
  })
  const [touched, setTouched] = useState({ username: false, password: false })
  const [currentPage, setCurrentPage] = useState<"login" | "signup">("login")

  // 한글 감지 함수
  const containsKorean = (text: string): boolean => {
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/
    return koreanRegex.test(text)
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
    if (touched.username) {
      setErrors((prev) => ({ ...prev, username: e.target.value.length === 0 }))
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)

    if (touched.password) {
      const hasKorean = containsKorean(newPassword)
      setErrors((prev) => ({
        ...prev,
        password: newPassword.length === 0,
        passwordKorean: hasKorean,
      }))
    }
  }

  const handleUsernameBlur = () => {
    setTouched((prev) => ({ ...prev, username: true }))
    setErrors((prev) => ({ ...prev, username: username.length === 0 }))
  }

  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, password: true }))
    const hasKorean = containsKorean(password)
    setErrors((prev) => ({
      ...prev,
      password: password.length === 0,
      passwordKorean: hasKorean,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const hasKorean = containsKorean(password)
    const newErrors = {
      username: username.length === 0,
      password: password.length === 0,
      passwordKorean: hasKorean,
    }
    setErrors(newErrors)
    setTouched({ username: true, password: true })

    if (!newErrors.username && !newErrors.password && !newErrors.passwordKorean) {
      console.log("로그인 시도:", { username, password })
      // 로그인 성공 시 상위 컴포넌트에 알림
      if (onLoginSuccess) {
        onLoginSuccess(username)
      }
    }
  }

  const handleSignupClick = () => {
    setCurrentPage("signup")
  }

  const handleBackToLogin = () => {
    setCurrentPage("login")
  }

  if (currentPage === "signup") {
    return <SignupPage onBackToLogin={handleBackToLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Back Button and Logo */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Image src="/logo.svg" alt="EMO Logo" width={120} height={43} priority />
          </div>
          <p className="text-gray-600 text-sm">das 계정으로 로그인 학교 사용할 보세요</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <div className="relative">
              <Input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                onBlur={handleUsernameBlur}
                placeholder="아이디를 입력하세요"
                className={`w-full px-4 py-3 rounded-full bg-white text-gray-900 placeholder-gray-500 border-0 outline-none shadow-none focus:outline-none focus:ring-0 focus:shadow-none ${
                  errors.username ? "focus:border-2 focus:border-red-500" : "focus:border-2 focus:border-yellow-400"
                }`}
                style={{ boxShadow: "none" }}
              />
              {/* 눈 아이콘 제거 */}
            </div>
            {errors.username && <p className="text-red-500 text-xs text-right">다시 확인해주세요</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                placeholder="비밀번호를 입력하세요"
                className={`w-full px-4 py-3 rounded-full bg-white text-gray-900 placeholder-gray-500 border-0 outline-none shadow-none focus:outline-none focus:ring-0 focus:shadow-none ${
                  errors.password || errors.passwordKorean
                    ? "focus:border-2 focus:border-red-500"
                    : "focus:border-2 focus:border-yellow-400"
                }`}
                style={{ boxShadow: "none" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs text-right">다시 확인해주세요</p>}
            {errors.passwordKorean && (
              <p className="text-red-500 text-xs text-right">비밀번호에 한글을 사용할 수 없습니다</p>
            )}
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full py-4 bg-orange-300 hover:bg-orange-400 text-gray-800 font-medium rounded-full border-0 text-base"
          >
            로그인
          </Button>

          {/* Links */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <button type="button" className="hover:text-gray-800">
                비밀번호 찾기
              </button>
              <span>|</span>
              <button type="button" className="hover:text-gray-800">
                아이디 찾기
              </button>
              <span>|</span>
              <button type="button" onClick={handleSignupClick} className="hover:text-gray-800">
                회원가입
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
