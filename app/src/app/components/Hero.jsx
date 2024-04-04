"use client"

const Hero = () => {
  return (
    <header className='w-full flex justify-center items-center flex-col'>
      <nav className='flex justify-between items-center w-full mb-10 pt-3'>
        <img src="/assets/logo.svg" alt="sumz_logo" className='w-28 object-contain' />
        <button type='button' onClick={() => window.open('https://github.com/yukkussungs')} className="black_btn">Github</button>
      </nav>
      <h1 className='head_text'>
        記事の要約
        <span className='orange_gradient'>AI</span>
      </h1>
      <h2 className='desc'>
      LangChainとGemini AIを使って記事を日本語にシンプルに変換します。 <br/>
それは、長い記事を明確で簡潔な要約に変換します。
      </h2>
    </header>
  )
}

export default Hero