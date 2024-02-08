import React, {useState} from 'react'
import InputCredentials from './inputCredentials';


const AccounStart = (props) => {
    const [isInverstorActive, setIsInverstorActive] = useState(true); 
    function handleInvestorClick(){
        setIsInverstorActive(true);
    }
    function handleStartupClick(){
        setIsInverstorActive(false);
    }
  return (
    <div className='credentials'>
        <div className='AccountStart'>
        <InputCredentials text={props.text} mode={isInverstorActive?'Investor':'Startup'}/>
        <p className='account-type'>What type of acoount do you want</p>
            <div className='account-type-div'>
                <div className={`account ${isInverstorActive ? 'active' : 'inactive'}`} onClick={handleInvestorClick}>
                    <img className="account-img" src={require("../Assests/images/investor.png")}></img>
                    <p className='account-name'>Investor</p>
                </div>
                <div className={`account ${isInverstorActive ? 'inactive' : 'active'}`}>
                    <img className="account-img" src={require("../Assests/images/startup.png")} onClick={handleStartupClick}></img>
                    <p className='account-name'>Startup</p>
                </div>
            </div>
        </div>
        
    </div>
  )
}

export default AccounStart
