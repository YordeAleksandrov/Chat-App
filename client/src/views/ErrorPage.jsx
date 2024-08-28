import Err_IMG from '../images/Error_Page.jpg'
const ErrorPage=()=>{
    return (
        <div style={{width:'100%',
        height:'100vh',
        backgroundImage:`url(${Err_IMG})`,
        backgroundSize:'cover',
        backgroundPosition: 'center'
        }}>

        </div>
    )
}
export default ErrorPage