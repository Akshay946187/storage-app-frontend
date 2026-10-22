

const Detailpopup = ({item,setshowDetailPopup}) => {
    console.log(item)
  return (
   <div className="w-screen h-screen absolute top-30 flex items-center justify-center" onClick={()=>setshowDetailPopup(false)}>
     <div className="bg-gray-200 h-1/2 w-1/2 flex items-center justify-center flex-col p-5 gap-3">
      <h1 className = "text-xl font-bold" >fileName : <span className="text-xl font-bold text-blue-600">{item.fileName}</span></h1>
      <p className = "text-xl font-bold">fileSize : <span className="text-xl font-bold text-blue-600">{(item.fileSize / 1024).toFixed(1)}kb</span></p>
      <p className = "text-sm font-bold">createdAt : <span className="text-xl font-bold text-blue-600">{item.createdAt}</span></p>
      <p className = "text-sm font-bold">updatedAt : <span className="text-xl font-bold text-blue-600">{item.updatedAt}</span></p>
    </div>
   </div>
  )
}

export default Detailpopup
