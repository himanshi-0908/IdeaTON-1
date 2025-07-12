"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export const RoomJoinAnimation = ({ isVisible, onComplete }: { isVisible: boolean; onComplete: () => void }) => {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    const steps = [
      { delay: 0, duration: 1000 },
      { delay: 1000, duration: 1000 },
      { delay: 2000, duration: 500 },
    ]

    steps.forEach((stepConfig, index) => {
      setTimeout(() => {
        setStep(index + 1)
        if (index === steps.length - 1) {
          setTimeout(onComplete, stepConfig.duration)
        }
      }, stepConfig.delay)
    })
  }, [isVisible, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="connecting"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="space-y-4"
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
                />
              </div>
              <h3 className="text-2xl font-bold text-white">Connecting to Room</h3>
              <p className="text-gray-300">Establishing secure P2P connection...</p>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="initializing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-3xl"
                >
                  🎤
                </motion.div>
              </div>
              <h3 className="text-2xl font-bold text-white">Initializing Audio</h3>
              <p className="text-gray-300">Setting up voice streaming...</p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              className="space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 mx-auto bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center"
              >
                <span className="text-3xl">✨</span>
              </motion.div>
              <h3 className="text-2xl font-bold text-white">Ready to Chat!</h3>
              <p className="text-gray-300">Welcome to the voice room</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export const ParticipantJoinEffect = ({ participant, onComplete }: { participant: any; onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-40"
    >
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center"
        >
          <span className="text-white text-sm">👋</span>
        </motion.div>
        <div>
          <p className="font-medium">{participant.username} joined</p>
          <p className="text-sm text-gray-500">Welcome to the room!</p>
        </div>
      </div>
    </motion.div>
  )
}
