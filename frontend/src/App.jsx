import { useState } from 'react'
import axios from "axios"
import './App.css'
import { useEffect } from 'react'
import { FaCopy } from "react-icons/fa";
import { MdOutlineRefresh } from "react-icons/md";
import { FaChartSimple } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";

function App() {

  const [newUrl, setNewUrl] = useState("")
  const [urls, setUrls] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [latestUrl, setLatestUrl] = useState(null)
  const [showAnalytics, setShowAnalytics] = useState(null)


  // show analytics button
  const showAnalyticsButton = (id) => {
    setShowAnalytics(prev => (prev === id ? null : id))
  }


  // create URL
  const createUrl = async (e) => {
    e.preventDefault()
    if(!newUrl){
      return
    }
    try{
      const response = await axios.post("/api/shortner", {redirectUrl: newUrl})

      setUrls([response.data, ...urls])
      setLatestUrl(response.data)
      setNewUrl("")
    } catch(err){
      console.log("error while creating url: ", err);
      
    }
  }


  // get all URL
  const fetchUrl = async () => {
    try{
      const response = await axios.get("/api/url/all")
      setUrls(response.data.reverse())

    } catch(err) {
      console.log("error while getting all url", err);
    } finally{
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUrl()
  }, [])



  // delete URL
  const deleteUrl = async (id) => {
    try{
      await axios.delete(`/api/delete/${id}`)
      fetchUrl()
    } catch(err){
      console.log("error while deliting todo: ", err);
    }
  }


 // copy url
 const copyURL = async (shortId) => {
  const shortIdUrl = `http://localhost:3000/api/${shortId}`
  try{
    await navigator.clipboard.writeText(shortIdUrl)
    alert(`Short URL copied:  "${shortIdUrl}" ✅`)
  } catch(err){
    console.log("error while copy: ", err);
  }
 }


  return (
    <>
      <div className='  flex flex-row selection:text-white selection:bg-black'>
        <div className='h-screen w-3/4 bg-white-100 left-0 top-0 sticky p-5 flex justify-center ' >
          
          <div className='rounded-lg mt-20 w-180 h-130 bg-amber-300 p-5 flex flex-col items-center shadow-[5px_5px_var(--color-black)] border-3 break-all px-10'>
            <h1 className='text-2xl font-semibold '>Enter your link</h1>


            <form onSubmit={createUrl} className='mt-7 flex flex-col   h-full justify-center items-center'>
              <div>
                <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} type="text" className='rounded-md border-3 mr-4 w-110 h-14 bg-white outline-blue-500  px-3 text-lg font-medium' />

                <button className='rounded-md bg-black p-1 h-14 w-31 text-xl font-semibold text-white hover:bg-neutral-800 active:scale-98  shadow-[3px_3px_var(--color-neutral-600)]  active:shadow-none transition-all duration-100  cursor-pointer '>Enter</button>
              </div>
              

              <div className='flex items-center justify-center h-full text-lg text-neutral-600 mb-15'>

                {
                  !latestUrl ? (
                    <div className='flex justify-center items-center h-full'>
                      <h1>No URL yet</h1>
                    </div>
                  ) : (
                    <div>
                      {urls.slice(0, 1).map((url) => (
                        <div key={url._id}>
                          
                          <a href={`/api/${url.shortId}`}>
                            <h1 className='font-semibold text-neutral-500 text-xl hover:text-neutral-800'><span className='font-semibold text-black text-2xl '>Link:   </span> {url.redirectUrl}</h1>
                          </a>
                              
                            
                          <p className='text-xl font-semibold text-blue-600 mt-3'><span className='font-semibold text-black text-2xl'>Short urls: </span>  http://localhost:3000/api/{url.shortId}</p>

                          <div className='flex gap-5'>
                            <button onClick={() => setLatestUrl(null)} className='mt-7 border-2 rounded-md p-1 h-11 w-30 bg-red-500 border-black text-black font-semibold cursor-pointer active:scale-98 hover:bg-red-400 transition-all duration-200  shadow-[2px_2px_var(--color-black)] active:shadow-none flex gap-1 items-center justify-center'>
                            <MdOutlineRefresh className='text-2xl' />
                            Refresh</button>

                            <button onClick={() => copyURL(url.shortId)} className='mt-7 border-2 rounded-md p-1 h-11 w-47 bg-black border-black text-white font-semibold cursor-pointer active:scale-98 hover:bg-neutral-800 transition-all duration-100  shadow-[2px_2px_var(--color-neutral-500)] active:shadow-none flex gap-2 items-center justify-center'>
                            <FaCopy className='text-2xl' />
                            Copy short URL</button>
                          </div>
                          

                        </div>
                      ))}
                    </div>
                    
                  )
                }
              
                
              </div>



            </form>


            


          </div>
          
        </div>







        <div className=' h-screen w-2/5  bg-amber-300 overflow-y-auto'>
          <div className='h-full  p-5'>
            <h1 className='font-semibold text-2xl flex justify-center text-neutral-800 mb-8 '>Show all URLs</h1>

            {/* get data map all */}
            <div className=' pb-3'>

              {
                isLoading ? (
                  <div className='flex justify-center'>
                    <h1>Loading...</h1>
                  </div>
                ) :
                urls.length === 0 ? (
                  <div className='rounded-md bg-white shadow-[4px_4px_var(--color-black)] p-3 border-2 justify-center flex '>
                    <h1>No url yet</h1>
                  </div>
                ) : (
                  <div className=''>
                    <div>
                      {
                        urls.map((url) => (
                          <div key={url._id} className='rounded-md bg-white shadow-[4px_4px_var(--color-black)] p-3 border-2 mb-5 flex flex-col gap-1 break-all'>
                            <a href={`/api/${url.redirectUrl}`}>
                              <h1 className='text-md font-semibold text-neutral-500 hover:text-neutral-800 transition-all duration-200'><span className='font-bold text-black '>Link: </span> {url.redirectUrl}</h1>
                            </a>
                            
                           
                            <p className='text-md font-semibold text-blue-600'><span className='font-bold text-black '>Short urls: </span>  http://localhost:3000/api/{url.shortId}</p>

                            <p className='text-md font-bold text-black'>Total clicks: <span className='font-mono font-normal text-neutral-600 '>{url.visitHistory.length}</span></p>

                            {
                              showAnalytics === url._id ? (
                                url.visitHistory.map((visitHistory, i) => (
                                  <div key={i}>
                                    <p className='text-sm font-mono tracking-tight text-neutral-700'>{i + 1}. {visitHistory.timestamps}</p>
                                  </div> 
                                ))
                              ) : (
                                <div></div>
                              )
                            }




                            <div className='flex gap-3'>

                              <button onClick={() => copyURL(url.shortId)} className='relative mt-4.5 rounded-md p-1 w-7.5 h-7.5 bg-black  text-white font-semibold cursor-pointer active:scale-97 hover:bg-neutral-700 transition-all duration-100 flex gap-2 items-center justify-center group '>

                                <span className='absolute -top-6 h-5 w-10 font-normal pb-1  flex justify-center items-center text-xs
                              bg-black text-white rounded-md
                                opacity-0 group-hover:opacity-100
                                transition-all duration-200'>copy</span>

                              <FaCopy className='text-md' /></button>


                              <button onClick={() => showAnalyticsButton(url._id)} className='relative mt-4.5 rounded-md p-1 w-7.5 h-7.5 bg-yellow-400  text-black font-semibold cursor-pointer active:scale-97 hover:bg-yellow-500 border-2 transition-all duration-100 flex gap-2 items-center justify-center group shadow-[2px_2px_var(--color-black)] active:shadow-none'>
                                
                                <span className='absolute -top-6.5 h-5 w-23 font-normal pb-1  flex justify-center items-center text-xs
                              bg-black text-white rounded-md
                                opacity-0 group-hover:opacity-100
                                transition-all duration-200'>show analytics</span>
                                
                                <FaChartSimple className='text-lg' /></button>


                              <button onClick={() => deleteUrl(url._id)} className='relative mt-4.5 rounded-md w-7.5 h-7.5 bg-red-500  text-black font-semibold cursor-pointer active:scale-97 hover:bg-red-600 border-2 transition-all duration-100 flex gap-2 items-center justify-center group shadow-[2px_2px_var(--color-black)] active:shadow-none'>
                                
                                <span className='absolute -top-7 h-5.5 w-12 font-normal pb-1  flex justify-center items-center text-xs
                              bg-black text-white rounded-md
                                opacity-0 group-hover:opacity-100
                                transition-all duration-200'>delete</span>
                                
                                <MdDeleteForever className='text-xl' /></button>

                            </div>
                            

                          </div>
                        ))
                      }



                    </div>
                  </div>
                  
                )
              }






            </div>


          </div>
        </div>
      </div>
    </>
  )
}

export default App
