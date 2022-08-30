const initialState = {
    users:[],
    error:null,
    selected:[]
}



export default (state=initialState, action) =>{
    switch(action.type){
        case "CARER_LIST_SUCCESS":
            console.log("mairuuuuuuuuuuuuuuuuuuu")
            return{
                ...state,
                users:action.payload
            }
        case "CARER_LIST_FAIL":
            return{
                ...state,
                users:[],
                error: action.payload
            }
        case "SET_ASSIGNED_USERS":
            return{
                ...state,
                selected:action.payload
            }
        default:
            return{
                ...state
            }
    }
}