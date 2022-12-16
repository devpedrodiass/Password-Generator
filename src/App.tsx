import { useRef, useState } from "react"
import { Checkbox } from "./components/Checkbox/Checkbox"
import * as zod from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Clipboard, CheckCircle } from "phosphor-react"
import { motion } from "framer-motion"

const generatedPasswordSchema = zod.object({
  length: zod.number().min(1).max(32),
  includeNumbers: zod.boolean(),
  includeSymbols: zod.boolean(),
  includeUppercase: zod.boolean(),
  includeLetters: zod.boolean(),
})

type GeneratedPasswordType = zod.output<typeof generatedPasswordSchema>

const generatePassword = (
  length: number,
  includeLetters: boolean,
  includeNumbers: boolean,
  includeSymbols: boolean,
  includeUppercase: boolean
) => {
  let charset = ""
  if (includeLetters) charset += "abcdefghijklmnopqrstuvwxyz"
  if (includeNumbers) charset += "0123456789"
  if (includeSymbols) charset += "!@#$%^&*()_+-="
  if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let password = ""
  for (let i = 0; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  return password === "undefined" ? "No options selected" : password
}

interface GeneratedPassword {
  password: string
  createdAt: string
}

function App() {
  const [generatedPassword, setGeneratedPassword] = useState<string>("")
  const [generatedPasswords, setGeneratedPasswords] = useState<
    GeneratedPassword[]
  >(() => JSON.parse(localStorage.getItem("generatedPasswords@v1") ?? "[]"))
  const [showOldPasswords, setShowOldPasswords] = useState<boolean>(false)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GeneratedPasswordType>({
    resolver: zodResolver(generatedPasswordSchema),
    defaultValues: {
      includeLetters: false,
      includeNumbers: false,
      includeSymbols: false,
      includeUppercase: false,
      length: 1,
    },
  })

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedPassword)
  }

  const onSubmit = (data: GeneratedPasswordType) => {
    const {
      length,
      includeLetters,
      includeNumbers,
      includeSymbols,
      includeUppercase,
    } = data
    const newPassword = generatePassword(
      length,
      includeLetters,
      includeNumbers,
      includeSymbols,
      includeUppercase
    )
    setGeneratedPassword(newPassword)
    if (newPassword !== "No options selected") {
      setGeneratedPasswords((prev) => [
        ...prev,
        {
          password: newPassword,
          createdAt: new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
            timeZone: "America/Los_Angeles",
          }).format(new Date()),
        },
      ])
      localStorage.setItem(
        "generatedPasswords@v1",
        JSON.stringify(generatedPasswords)
      )
    }
  }

  return (
    // Container
    <div className="flex justify-center bg-blue900 min-h-screen min-w-screen">
      {/* Content */}
      <div className="w-[448px] max-w-md p-7">
        {/* Header */}
        <motion.header
          animate={{
            opacity: [0, 1],
            y: [-20, 0],
          }}
          transition={{ duration: 0.5 }}
          className="w-full text-center"
        >
          {/* Title */}
          <h1 className="text-blue-400 font-bold text-2xl">
            Password Generator
          </h1>
        </motion.header>

        {/* Main */}
        <motion.main
          animate={{
            opacity: [0, 1],
          }}
          transition={{ duration: 0.5 }}
          className="mt-4 w-full"
        >
          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full"
          >
            {/* Generated Password */}
            <div className="w-full">
              <label className="text-gray400" htmlFor="password">
                Generated Password
              </label>
              <div className="flex gap-2 w-full">
                <input
                  disabled
                  placeholder="Password goes here..."
                  value={generatedPassword}
                  className={`w-full bg-blue800 px-4 py-3  rounded-md placeholder:text-blue-400  ${
                    generatedPassword === "No options selected"
                      ? "text-red-400"
                      : "text-white"
                  }`}
                  type="text"
                  id="password"
                />
                {generatedPassword &&
                generatedPassword !== "No options selected" ? (
                  <motion.button
                    animate={{
                      scale: [0.8, 1],
                      opacity: [0, 1],
                    }}
                    transition={{ duration: 0.5 }}
                    onClick={copyToClipboard}
                    type="button"
                    title="Copy to clipboard"
                    className="text-blue-400 cursor-pointer hover:brightness-75 transition-all"
                  >
                    <Clipboard weight="bold" size={16} />
                  </motion.button>
                ) : null}
              </div>
            </div>

            {/* Lenght */}
            <div className="w-full flex flex-row justify-between">
              <label className="text-gray400" htmlFor="lenght">
                Lenght (1-32)
              </label>
              <input
                placeholder="0"
                className=" bg-blue800 px-2 py-1 w-[18px] text-white rounded-md placeholder:text-blue-400"
                type="text"
                id="lenght"
                required
                {...register("length", {
                  valueAsNumber: true,
                  onChange: (e) => {
                    if (e.target.value > 32) {
                      e.target.value = 32
                    } else if (e.target.value < 1) {
                      e.target.value = 1
                    }
                  },
                })}
              />
            </div>

            {/* Include Numbers */}
            <div className="w-full flex gap-2 items-center justify-between">
              <label className="text-gray400" htmlFor="numbers">
                Include Numbers
              </label>
              <Controller
                control={control}
                name="includeNumbers"
                render={({ field }) => {
                  const { onChange, value } = field
                  return (
                    <Checkbox id="numbers" checked={value} onClick={onChange} />
                  )
                }}
              />
            </div>

            {/* Include Letters */}
            <div className="w-full flex gap-2 items-center justify-between">
              <label className="text-gray400" htmlFor="letters">
                Include Letters
              </label>
              <Controller
                control={control}
                name="includeLetters"
                render={({ field }) => {
                  const { onChange, value } = field
                  return (
                    <Checkbox id="letters" checked={value} onClick={onChange} />
                  )
                }}
              />
            </div>

            {/* Include Symbols */}
            <div className="w-full flex gap-2 items-center justify-between">
              <label className="text-gray400" htmlFor="symbols">
                Include Symbols
              </label>
              <Controller
                control={control}
                name="includeSymbols"
                render={({ field }) => {
                  const { onChange, value } = field
                  return (
                    <Checkbox id="symbols" checked={value} onClick={onChange} />
                  )
                }}
              />
            </div>

            {/* Include Uppercase */}
            <div className="w-full flex gap-2 items-center justify-between">
              <label className="text-gray400" htmlFor="uppercase">
                Include Uppercase
              </label>
              <Controller
                control={control}
                name="includeUppercase"
                render={({ field }) => {
                  const { onChange, value } = field
                  return (
                    <Checkbox
                      id="uppercase"
                      checked={value}
                      onClick={onChange}
                    />
                  )
                }}
              />
            </div>
            {/* Submit */}
            <button
              type="submit"
              className="text-center p-2 bg-blue-400 text-blue-800 font-bold rounded-md cursor-pointer hover:brightness-75 transition-all"
            >
              Generate Password
            </button>
          </form>

          {/* Divider */}
          <div className="w-full h-[1px] bg-blue-400 my-4" />

          {/* Generated Passwords */}
          <div className="flex items-center flex-col mt-5">
            <h1 className="text-gray400 text-md">Generated Passwords</h1>
            {generatedPasswords.length > 0 ? (
              <>
                {showOldPasswords ? (
                  <motion.div
                    animate={{
                      scale: [0, 1],
                    }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col gap-2 mt-2"
                  >
                    {generatedPasswords.map(
                      ({ createdAt, password }, index) => (
                        <motion.div
                          key={`${password}-${index}`}
                          animate={{
                            opacity: [0, 1],
                            height: [0, 24],
                          }}
                          transition={{ duration: 0.5 }}
                          className="flex gap-2 items-center justify-between h-auto"
                        >
                          <span className="text-blue-400 bg-blue800 p-1 rounded-md text-xs">
                            {createdAt}
                          </span>
                          <span className="text-gray400 truncate text-xs max-w-[80px]">
                            {password}
                          </span>
                          <button
                            onClick={copyToClipboard}
                            type="button"
                            title="Copy to clipboard"
                            className="text-blue-400 cursor-pointer hover:brightness-75 transition-all"
                          >
                            <Clipboard weight="bold" size={16} />
                          </button>
                        </motion.div>
                      )
                    )}
                  </motion.div>
                ) : null}
                <button
                  onClick={() => setShowOldPasswords(!showOldPasswords)}
                  type="button"
                  className="text-blue-400 cursor-pointer p-2 rounded-md mt-2 hover:brightness-125 transition-all"
                >
                  {showOldPasswords ? "Hide" : "Show"}
                </button>
              </>
            ) : (
              <span className="text-blue-400 mt-2 text-center">
                No Generated Passwords Yet :(
              </span>
            )}
          </div>
        </motion.main>
      </div>
    </div>
  )
}

export default App
