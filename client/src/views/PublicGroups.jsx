import { Card } from "@mui/material"
import { useEffect, useState } from "react";
import { useStyles } from "../views/Styles/PUBLIC_GROUP_STYLE"
import CardMedia from "@mui/material/Card";
import CardContent from "@mui/material/Card";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import { CardActions } from "@mui/material";
import emptyFile from "../images/addImage.png"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const PublicGroups = () => {
  const [groups, setGroups] = useState([]);
  const classes = useStyles()
  const user = useSelector(data => data.user.info)
  const nav=useNavigate()

  useEffect(() => {
    (async () => {
      const accessToken = sessionStorage.getItem('accessToken')
      const response = await fetch('http://localhost:3001/group/publicGroups', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (response.ok) {
        const data = await response.json()
        setGroups(data)
      }
    })()

  }, [])

const handleButton=async(e,groupId)=>{
  const buttonText=e.target.innerText;
  if(buttonText==='LEAVE'){
    console.log(groups)
    return
  }
  const accessToken=sessionStorage.getItem('accessToken')
 const response= await fetch('http://localhost:3001/group/join',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body:JSON.stringify({
      userId:user.id,
      groupId:groupId
    })
  })
  if(response.ok){
   nav(`/groups/${groupId}`)
  }
}

  return (
    groups.length > 0 ? <div className={classes.field}>
      {groups.map((group) => {
        return <Card key={group.id} className={classes.publicCard}>
          <Typography gutterBottom variant="h5" component="div">
            {group?.name}
          </Typography>

          <CardMedia
            className={classes.image}
            component="img"
            src={group.image_url ? `http://localhost:3001${group.image_url}` : emptyFile}
            alt="Group Image"
          />

          <Typography variant="h6" color="text.secondary">
            {group.description.length>25?group.description.slice(0,25)+'...':group.description}
          </Typography>
          <CardActions>
            <Button 
            onClick={(e)=>handleButton(e,group.id)}
            className={classes.button}
            size="large"
             variant="outlined"
              >{group.member_ids.includes(user?.id) ? 'Leave' : 'Join'}
              </Button>

          </CardActions>
        </Card>

      })}
    </div> :
      <></>
  )

}
export default PublicGroups