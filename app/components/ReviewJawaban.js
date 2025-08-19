'use client'
import { useState } from 'react'

export default function ReviewJawaban({ 
  soalList, 
  jawabanUser, 
  onClose 
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  if (!soalList || !jawabanUser || soalList.length === 0) {
    return null
  }
  
  const getStatusIcon = (isCorrect) => {
    return isCorrect ? '✅' : '❌'
  }
  
  const getStatusColor = (isCorrect) => {
    return isCorrect ? 'text-green-600' : 'text-red-600'
  }
  
  const currentSoal = soalList[currentIndex]
  const userAnswer = jawabanUser[currentIndex]
  const isCorrect = userAnswer === currentSoal.jawaban_benar
  
  const correctCount = jawabanUser.filter((jawaban, index) => 
    jawaban === soalList[index].jawaban_benar
  ).length
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">📋 Review Jawaban</h2>
              <p className="text-blue-100 mt-1">Lihat jawaban Anda dan pembahasan</p>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-all"
            >
              ×
            </button>
          </div>
          
          {/* Stats */}
          <div className="mt-4 flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                📊 Soal {currentIndex + 1} dari {soalList.length}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <span className="text-green-300">✅</span>
                <span>{correctCount}</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="text-red-300">❌</span>
                <span>{soalList.length - correctCount}</span>
              </span>
              <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
                {Math.round((correctCount / soalList.length) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status Current Question */}
          <div className={`text-center mb-6 p-4 rounded-lg ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border-2`}>
            <div className={`text-5xl mb-2 ${getStatusColor(isCorrect)}`}>
              {getStatusIcon(isCorrect)}
            </div>
            <h3 className={`text-xl font-bold ${getStatusColor(isCorrect)}`}>
              {isCorrect ? '🎉 Jawaban Benar!' : '😅 Jawaban Salah'}
            </h3>
            <p className="text-gray-600 mt-1">
              {isCorrect 
                ? 'Selamat! Anda menjawab dengan tepat' 
                : 'Jangan khawatir, mari pelajari jawaban yang benar'
              }
            </p>
          </div>

          {/* Question */}
          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
              <h4 className="font-semibold text-gray-700 text-sm mb-2">PERTANYAAN:</h4>
              <h3 className="font-bold text-lg text-gray-800">
                {currentIndex + 1}. {currentSoal.pertanyaan}
              </h3>
            </div>
            
            {/* Answer Options */}
            <div className="space-y-3">
              {['A', 'B', 'C', 'D'].map((option) => {
                const isUserAnswer = userAnswer === option
                const isCorrectAnswer = currentSoal.jawaban_benar === option
                
                let containerClass = 'p-4 rounded-lg border-2 transition-all duration-200'
                let textColor = 'text-gray-700'
                let bgColor = 'bg-gray-50 border-gray-200'
                
                if (isCorrectAnswer) {
                  bgColor = 'bg-green-100 border-green-400'
                  textColor = 'text-green-800'
                }
                
                if (isUserAnswer && !isCorrect) {
                  bgColor = 'bg-red-100 border-red-400'
                  textColor = 'text-red-800'
                }
                
                return (
                  <div 
                    key={option}
                    className={`${containerClass} ${bgColor} ${textColor}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <span className="font-bold text-lg min-w-[24px]">{option}.</span>
                        <span className="text-base leading-relaxed">
                          {currentSoal[`pilihan_${option.toLowerCase()}`]}
                        </span>
                      </div>
                      
                      {/* Status Icons */}
                      <div className="flex items-center space-x-2 ml-4">
                        {isUserAnswer && (
                          <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                            👤 Pilihan Anda
                          </span>
                        )}
                        {isCorrectAnswer && (
                          <div className="flex items-center space-x-1">
                            <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                              ✓ Jawaban Benar
                            </span>
                          </div>
                        )}
                        {isUserAnswer && !isCorrect && (
                          <span className="text-red-600 text-2xl">✗</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Explanation */}
          {currentSoal.penjelasan && (
            <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-bold text-blue-800 mb-3 flex items-center space-x-2">
                <span>💡</span>
                <span>Penjelasan & Pembahasan:</span>
              </h4>
              <p className="text-blue-700 leading-relaxed text-base">
                {currentSoal.penjelasan}
              </p>
            </div>
          )}

          {/* Additional Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-gray-700">Jawaban Benar</div>
                <div className="text-lg font-bold text-green-600">
                  {currentSoal.jawaban_benar}. {currentSoal[`pilihan_${currentSoal.jawaban_benar.toLowerCase()}`]}
                </div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-700">Jawaban Anda</div>
                <div className={`text-lg font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {userAnswer ? `${userAnswer}. ${currentSoal[`pilihan_${userAnswer.toLowerCase()}`]}` : 'Tidak dijawab'}
                </div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-700">Status</div>
                <div className={`text-lg font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? '✓ Benar' : '✗ Salah'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
            >
              <span>←</span>
              <span>Sebelumnya</span>
            </button>
            
            <div className="text-center">
              <div className="text-sm text-gray-600">Navigasi Soal</div>
              <div className="font-bold text-lg">{currentIndex + 1} / {soalList.length}</div>
            </div>
            
            <button
              onClick={() => setCurrentIndex(Math.min(soalList.length - 1, currentIndex + 1))}
              disabled={currentIndex === soalList.length - 1}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
            >
              <span>Selanjutnya</span>
              <span>→</span>
            </button>
          </div>

          {/* Question Grid Navigation */}
          <div>
            <h4 className="font-semibold mb-3 text-center text-gray-700">Ringkasan Semua Soal:</h4>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2 justify-items-center">
              {soalList.map((_, index) => {
                const isCurrentSoal = index === currentIndex
                const isAnswerCorrect = jawabanUser[index] === soalList[index].jawaban_benar
                
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`
                      w-12 h-12 rounded-lg text-sm font-bold border-2 transition-all duration-200 hover:scale-105
                      ${isCurrentSoal 
                        ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg' 
                        : 'border-gray-300 hover:border-gray-400'
                      }
                      ${isAnswerCorrect 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }
                    `}
                  >
                    {index + 1}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}