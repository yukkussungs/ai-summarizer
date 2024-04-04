"use client"
import Image from "next/image"

const Hero = () => {
  return (
    <header className='w-full flex justify-center items-center flex-col'>
      <nav className='flex justify-between items-center w-full mb-10 pt-3'>
        <Image className='w-28 object-contain' src="/assets/logo.svg" alt='sumz_logo' width={90} height={30}/>
        <button type='button' onClick={() => window.open('https://github.com/yukkussungs/ai-summarizer')} className="black_btn">Github</button>
      </nav>
      <h1 className='head_text'>
        記事の要約
        <span className='orange_gradient'>AI</span>
      </h1>
      <h2 className='desc'>
        LangChainとGemini AI技術で、長いニュース記事を核心だけ素早く把握！
      </h2>
    </header>
  )
}

export default Hero