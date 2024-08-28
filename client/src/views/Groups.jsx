
import { useStyles } from "./Styles/GROUPS_STYLE"
import GroupsListMenu from "../components/group-components/GroupListMenu"
import GroupChat from "../components/group-components/GroupChat"
import { useParams } from "react-router-dom"
import GroupMembers from "../components/group-components/GroupMembers"




const Groups =()=>{
    const {id}=useParams()

    return(
        <>
        <GroupsListMenu/>
        {id&&<GroupChat />}
        {id&&<GroupMembers/>}
        </>
    )
}
export default Groups