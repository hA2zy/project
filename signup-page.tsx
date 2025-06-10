"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"

interface SignupPageProps {
  onBackToLogin: () => void
}

export default function SignupPage({ onBackToLogin }: SignupPageProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    phone: "",
    verificationCode: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({
    username: false,
    password: false,
    phone: false,
    verificationCode: false,
  })
  const [touched, setTouched] = useState({
    username: false,
    password: false,
    phone: false,
    verificationCode: false,
  })
  const [isVerificationSent, setIsVerificationSent] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (touched[field as keyof typeof touched]) {
      validateField(field, value)
    }
  }

  const validateField = (field: string, value: string) => {
    let hasError = false

    switch (field) {
      case "username":
        hasError = value.length < 2 || value.length > 8
        break
      case "password":
        hasError = value.length === 0
        break
      case "phone":
        hasError = !/^010-\d{4}-\d{4}$/.test(value)
        break
      case "verificationCode":
        hasError = value.length === 0
        break
    }

    setErrors((prev) => ({ ...prev, [field]: hasError }))
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    validateField(field, formData[field as keyof typeof formData])
  }

  const handleSendVerification = () => {
    if (formData.phone && /^010-\d{4}-\d{4}$/.test(formData.phone)) {
      setIsVerificationSent(true)
      console.log("인증번호 발송:", formData.phone)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newTouched = {
      username: true,
      password: true,
      phone: true,
      verificationCode: true,
    }
    setTouched(newTouched)

    Object.keys(formData).forEach((field) => {
      validateField(field, formData[field as keyof typeof formData])
    })

    const hasErrors = Object.values(errors).some((error) => error)
    if (!hasErrors) {
      console.log("회원가입 성공:", formData)
      // 회원가입 성공 후 로그인 페이지로 돌아가기
      onBackToLogin()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Image src="/logo.svg" alt="EMO Logo" width={120} height={43} priority />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <div className="relative">
              <Input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                onBlur={() => handleBlur("username")}
                placeholder="아이디를 입력하세요"
                className={`w-full px-4 py-3 rounded-full bg-white text-gray-900 placeholder-gray-500 border-0 outline-none shadow-none focus:outline-none focus:ring-0 focus:shadow-none ${
                  errors.username ? "focus:border-2 focus:border-red-500" : "focus:border-2 focus:border-yellow-400"
                }`}
                style={{ boxShadow: "none" }}
              />
            </div>
            {errors.username && <p className="text-red-500 text-xs text-right">다시 확인해주세요</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-3 rounded-full bg-white text-gray-900 placeholder-gray-500 border-0 outline-none shadow-none focus:outline-none focus:ring-0 focus:shadow-none focus:border-2 focus:border-yellow-400"
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
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input
                type="text"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                placeholder="전화번호를 입력하세요"
                className="flex-1 px-4 py-3 rounded-full bg-white text-gray-900 placeholder-gray-500 border-0 outline-none shadow-none focus:outline-none focus:ring-0 focus:shadow-none focus:border-2 focus:border-yellow-400"
                style={{ boxShadow: "none" }}
              />
              <Button
                type="button"
                onClick={handleSendVerification}
                className="px-6 py-3 bg-orange-300 hover:bg-orange-400 text-gray-800 font-medium rounded-full border-0"
              >
                인증번호
              </Button>
            </div>
          </div>

          {/* Verification Code Field */}
          <div className="space-y-2">
            <div className="relative">
              <Input
                type="text"
                value={formData.verificationCode}
                onChange={(e) => handleInputChange("verificationCode", e.target.value)}
                onBlur={() => handleBlur("verificationCode")}
                placeholder="인증번호를 입력하세요"
                className="w-full px-4 py-3 rounded-full bg-white text-gray-900 placeholder-gray-500 border-0 outline-none shadow-none focus:outline-none focus:ring-0 focus:shadow-none focus:border-2 focus:border-yellow-400"
                style={{ boxShadow: "none" }}
              />
            </div>
          </div>

          {/* Signup Button */}
          <Button
            type="submit"
            className="w-full py-4 bg-orange-300 hover:bg-orange-400 text-gray-800 font-medium rounded-full border-0 text-base"
          >
            회원가입
          </Button>
        </form>

        {/* Back to Login */}
        <div className="text-center">
          <button type="button" onClick={onBackToLogin} className="text-sm text-gray-600 hover:text-gray-800">
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  )
}
