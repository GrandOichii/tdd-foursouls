import React from 'react'
import './card.css'
// import background from '../../assets/brain.png'

export default function(props) {
    return <div className='card-container'>
        <img src={props.background} alt='Failed'/>
        <div className='card-name-box'>
            <div className='card-name'>
                {props.cardName}
            </div>
        </div>
        <div className='card-text-box'>
            <span className='card-text'>
                {props.cardText}
            </span>
        </div>
    </div>
}