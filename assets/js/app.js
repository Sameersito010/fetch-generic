let cl=console.log;

const postContainer=document.getElementById("postContainer");
const postForm=document.getElementById("postForm");
const titleControl=document.getElementById("title");
const bodyControl=document.getElementById("body");
const userIdControl=document.getElementById("userId");
const submitBtn=document.getElementById("submitBtn");
const updateBtn=document.getElementById("updateBtn");
const loader=document.getElementById("loader");

let baseUrl=`https://http-promise-firebase-default-rtdb.asia-southeast1.firebasedatabase.app/`

let postUrl=`${baseUrl}/posts.json`


// const createCard=(postObj)=>{
//     let card=document.createElement("div");
//     card.className="card mb-4"
//     card.id=post.id;
//     card.innerHTML=` <div class="card-header">
//                         <h2 class="m-0">
//                             ${postObj.title}
//                         </h2>
//                     </div>
//                     <div class="card-body">
//                         <p class="m-0">
//                         ${postObj.body}
//                         </p>
//                     </div>
//                     <div class="card-footer d-flex justify-content-between">
//                         <button class="btn btn-outline-primary" type="button" onClick="onEdit(this)">
//                             Edit
//                         </button>
//                         <button class="btn btn-outline-danger" type="button" onClick="onDelete(this)">
//                             Delete
//                         </button>
//                     </div>`


//                     postContainer.append(card)    
// }


// const templatingOfposts=(posts)=>{
//     postContainer.innerHTML=``;
// posts.forEach(post=>{
//  createCard(post)  
// });


// }




let postobjtemplating = eve => {
    let card = document.createElement('div');
    card.className = 'card mb-4 ';
    card.id = eve.id
    card.innerHTML = `
                        <div class="card-header">
                            <h2>${eve.title}</h2>
                        </div>
                        <div class="card-body overflow-auto">
                            <p>${eve.body}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-outline-success" onclick="onEdit(this)"><strong>Edit</strong></button>
                            <button class="btn btn-outline-danger" onclick="onDelete(this)"><strong>Delete</strong></button>
                        </div>
                    </div>
                `
    postContainer.append(card);
}

const objtoArr=(resObj)=>{
    let resultArr=[];
    for(const key in resObj){
        let obj=resObj[key]
        obj.id=key
        resultArr.push(obj);
    }
    return resultArr
}

const makeApiCall=(apiUrl,methodName,msgBody=null)=>{
    loader.classList.remove("d-none")
    return fetch (apiUrl,{
    method:methodName,
    body:msgBody,
    headers:{
        "Content-type":"Application/json"
    }
})
.then(res=>{
    loader.classList.add("d-none")
    return res.json()
   
})


}


makeApiCall(postUrl, "GET")
.then(data=>{
    cl(data);
    let postArr=objtoArr(data);
    cl(postArr)
    postArr.forEach(arr=>{
        postobjtemplating(arr) 
    })
})
.catch(err=>cl(err))



const onpostSubmit=(eve)=>{
    eve.preventDefault();
    let newPost={
        title:titleControl.value,
        body:bodyControl.value,
        userId:userIdControl.value
    }
    cl(newPost);
    makeApiCall(postUrl,"POST",JSON.stringify(newPost))

    .then(res=>{
        cl(res)
        newPost.id=res.name
        postobjtemplating(newPost)
    })
    .catch(cl)
    .finally(()=>{
        postForm.reset()
    })
}


const onEdit=(eve)=>{
    let editid=eve.closest(".card").id
    cl(editid);
    localStorage.setItem("edit",editid)
    let editUrl=`${baseUrl}/posts/${editid}.json` //we need url to make api call 

    // cl(editUrl);
    
    makeApiCall(editUrl,"GET")

    .then((res)=>{
        cl(res);
        titleControl.value=res.title,
        bodyControl.value=res.body,
        userIdControl.value=res.userId
        updateBtn.classList.remove("d-none")
        submitBtn.classList.add("d-none")
        windows.scrollto(0,0)
    })
    // .catch(cl)
   
}


const onDelete=(ele)=>{
cl(ele)

let deleteId=ele.closest(".card").id
let deleteUrl=`${baseUrl}/posts/${deleteId}.json`

let getconfirm=confirm(`are you sure want to delete`)

if (getconfirm){
        
    makeApiCall(deleteUrl,"DELETE")
    .then(res=>{
        
        document.getElementById(deleteId).remove()


    })
    .catch(cl)

    }
}
    






// Swal.fire(
//     {
    
//     title: "Are you sure?",
//     text: "You won't be able to revert this!",
//     icon: "warning",
//     showCancelButton: true,
//     cancelButtonColor: "#d33",
//     confirmButtonText: "Yes, delete it!"
// }).then((result) => {
    
//     if (result.isConfirmed) {
//         fetch(dlturl,"DELETE")
//             .then(res => {
                
//                 document.getElementById(dltid).remove()
//             })
//             .catch(err => {
//                 cl(err)
//             })
//             .finally(() => {
//                 postForm.reset()
//             })
//         Swal.fire({
//             title: "Deleted!",
//             text: "Your file has been deleted.",
//             icon: "success",
//             timer: 1000,
//         });

//     }
// })


const onPostupdate=(ele)=>{
let updateId=localStorage.getItem("edit")
cl(updateId);
let updateUrl=`${baseUrl}/posts/${updateId}.json`

let updateObj={
    title:titleControl.value,
    body:bodyControl.value,
    userId:userIdControl.value,
   id:updateId
    
}
cl(updateObj);
makeApiCall(updateUrl,"PUT",JSON.stringify(updateObj))
.then(res=>{
    cl(res);
    let data=[...document.getElementById(updateId).children]
    data[0].innerHTML=`<h2>${res.title}</h2>`
    data[1].innerHTML=`<p>${res.body}</p>`
    
})
.catch(cl)
.finally(()=>{
    postForm.reset()
    submitBtn.classList.remove("d-none")
    updateBtn.classList.add("d-none")
})
}




postForm.addEventListener("submit",onpostSubmit)
updateBtn.addEventListener("click",onPostupdate)
